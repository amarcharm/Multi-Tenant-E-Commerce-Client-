import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const STATUS_COLORS = {
  pending:    'bg-yellow-500/10 text-yellow-400',
  processing: 'bg-blue-500/10 text-blue-400',
  shipped:    'bg-indigo-500/10 text-indigo-400',
  delivered:  'bg-green-500/10 text-green-400',
  cancelled:  'bg-red-500/10 text-red-400',
};

export default function MyOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/orders/my');
        setOrders(res.data.orders);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <p className="text-sm text-white/40 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <Link
            to="/products"
            className="px-4 py-2 border border-white/15 text-white/60 text-sm rounded-xl hover:bg-white/10 transition no-underline"
          >
            Continue shopping
          </Link>
        </div>

        {/* Loading */}
        {loading && <p className="text-white/30 text-sm text-center py-20">Loading orders...</p>}

        {/* Error */}
        {error && <p className="text-red-400 text-sm text-center py-20">{error}</p>}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-white/30 text-sm mb-6">No orders yet</p>
            <Link
              to="/products"
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition no-underline inline-block"
            >
              Browse products
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
              >
                {/* Order header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-white/40">Order ID</p>
                    <p className="text-xs font-mono text-white/60">{order._id}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-white/10 text-white/60'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <p className="text-sm text-white">
                        {item.productId?.name || 'Product'}
                        <span className="text-white/40 ml-2">x{item.quantity}</span>
                      </p>
                      <p className="text-sm text-white">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-white/40">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                    {order.storeId?.storeName && (
                      <p className="text-xs text-white/30 mt-0.5">
                        from {order.storeId.storeName}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white">Total: ₹{order.totalAmount}</p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}