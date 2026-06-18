import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function AdminStores() {
  const [stores,  setStores]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [updating, setUpdating] = useState(null);

  const fetchStores = async () => {
    try {
      const res = await axiosInstance.get('/admin/stores');
      setStores(res.data.stores);
    } catch (err) {
      console.error('Failed to load stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleApprove = async (id) => {
    setUpdating(id);
    try {
      await axiosInstance.patch(`/admin/stores/${id}/approve`);
      setStores((prev) =>
        prev.map((s) => s._id === id ? { ...s, isApproved: true } : s)
      );
    } catch (err) {
      alert('Failed to approve store');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try {
      await axiosInstance.patch(`/admin/stores/${id}/reject`);
      setStores((prev) =>
        prev.map((s) => s._id === id ? { ...s, isApproved: false } : s)
      );
    } catch (err) {
      alert('Failed to reject store');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all'
    ? stores
    : filter === 'approved'
    ? stores.filter((s) => s.isApproved)
    : stores.filter((s) => !s.isApproved);

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Stores</h1>
            <p className="text-sm text-white/40 mt-1">{stores.length} total stores</p>
          </div>
          <Link
            to="/admin/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition no-underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all',      label: `All (${stores.length})` },
            { key: 'pending',  label: `Pending (${stores.filter((s) => !s.isApproved).length})` },
            { key: 'approved', label: `Approved (${stores.filter((s) => s.isApproved).length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white/30 text-sm text-center py-20">Loading stores...</p>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏪</p>
            <p className="text-white/30 text-sm">No stores found</p>
          </div>
        )}

        {/* Stores list */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtered.map((store) => (
              <div
                key={store._id}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">

                  {/* Store info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{store.storeName}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                        store.isApproved
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {store.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mb-2">
                      {store.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-white/30">Vendor</p>
                        <p className="text-xs text-white/60">{store.vendorId?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30">Email</p>
                        <p className="text-xs text-white/60">{store.vendorId?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30">Created</p>
                        <p className="text-xs text-white/60">
                          {new Date(store.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {!store.isApproved ? (
                      <button
                        onClick={() => handleApprove(store._id)}
                        disabled={updating === store._id}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-700 transition disabled:opacity-40"
                      >
                        {updating === store._id ? 'Approving...' : 'Approve'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(store._id)}
                        disabled={updating === store._id}
                        className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-medium rounded-xl hover:bg-red-600/30 transition disabled:opacity-40"
                      >
                        {updating === store._id ? 'Revoking...' : 'Revoke'}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}