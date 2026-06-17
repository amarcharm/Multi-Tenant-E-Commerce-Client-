import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  delivered:  'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function VendorOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('all');
  const [updating, setUpdating] = useState(null); // tracks which order is being updated

  // Fetch all vendor orders
  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders/vendor-orders');
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axiosInstance.patch(`/orders/${orderId}/status`, { status: newStatus });
      // Update the order in local state without refetching
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  // Filter orders by status
  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  // Count orders per status for the summary tabs
  const countByStatus = (status) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-sm text-white/40 mt-1">
              {orders.length} total order{orders.length !== 1 ? 's' : ''} in your store
            </p>
          </div>
          <Link
            to="/vendor/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition no-underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {STATUSES.map((s) => (
            <div
              key={s}
              onClick={() => setFilter(s === filter ? 'all' : s)}
              className={`rounded-xl p-3 text-center cursor-pointer border transition ${
                filter === s
                  ? STATUS_COLORS[s]
                  : 'bg-white/[0.04] border-white/[0.08] hover:border-white/20'
              }`}
            >
              <p className="text-xl font-bold text-white">{countByStatus(s)}</p>
              <p className="text-xs text-white/40 capitalize mt-0.5">{s}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition capitalize ${
                filter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s} ({countByStatus(s)})
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white/30 text-sm text-center py-20">Loading orders...</p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-white/30 text-sm">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </p>
          </div>
        )}

        {/* Orders list */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
              >
                {/* Order top row */}
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-white/30 mb-1">Order ID</p>
                    <p className="text-xs font-mono text-white/50">{order._id}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Status dropdown */}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-white/30">Update status</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updating === order._id || order.status === 'delivered' || order.status === 'cancelled'}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:border-indigo-500 transition disabled:opacity-40 disabled:cursor-not-allowed capitalize
                        ${STATUS_COLORS[order.status]} bg-transparent`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-[#1a1830] text-white capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                    {updating === order._id && (
                      <p className="text-xs text-white/30">Updating...</p>
                    )}
                  </div>
                </div>

                {/* Customer info */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 mb-4">
                  <p className="text-xs text-white/30 mb-1">Customer</p>
                  <p className="text-sm text-white font-medium">{order.customerId?.name || 'Unknown'}</p>
                  <p className="text-xs text-white/40">{order.customerId?.email}</p>
                </div>

                {/* Delivery address */}
                {order.deliveryAddress && (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 mb-4">
                    <p className="text-xs text-white/30 mb-1">Delivery address</p>
                    <p className="text-sm text-white">{order.deliveryAddress.fullName}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city},
                      {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      📞 {order.deliveryAddress.phone}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="flex flex-col gap-2 mb-4">
                  <p className="text-xs text-white/30">Items ordered</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-white">
                          {item.productId?.name || 'Product'}
                        </p>
                        <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-white font-medium">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <p className="text-xs text-white/40">Order total</p>
                  <p className="text-base font-bold text-white">₹{order.totalAmount}</p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}