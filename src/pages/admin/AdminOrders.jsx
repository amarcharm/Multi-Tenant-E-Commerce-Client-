import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const STATUS_COLORS = {
  pending:    'bg-yellow-500/10 text-yellow-400',
  processing: 'bg-blue-500/10 text-blue-400',
  shipped:    'bg-indigo-500/10 text-indigo-400',
  delivered:  'bg-green-500/10 text-green-400',
  cancelled:  'bg-red-500/10 text-red-400',
};

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/admin/orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">All Orders</h1>
            <p className="text-sm text-white/40 mt-1">
              {orders.length} orders · ₹{totalRevenue} total revenue
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition no-underline"
          >
            ← Back to dashboard
          </Link>
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
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                filter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s} ({orders.filter((o) => o.status === s).length})
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white/30 text-sm text-center py-20">Loading orders...</p>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-white/30 text-sm">No orders found</p>
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
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="text-xs text-white/30">Order ID</p>
                    <p className="text-xs font-mono text-white/50">{order._id}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-xs text-white/30 mb-1">Customer</p>
                    <p className="text-xs text-white">{order.customerId?.name}</p>
                    <p className="text-xs text-white/40">{order.customerId?.email}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-xs text-white/30 mb-1">Store</p>
                    <p className="text-xs text-white">{order.storeId?.storeName || 'Unknown'}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-xs text-white/30 mb-1">Total</p>
                    <p className="text-sm font-bold text-white">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-white/60">
                        {item.productId?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="text-white/60">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}