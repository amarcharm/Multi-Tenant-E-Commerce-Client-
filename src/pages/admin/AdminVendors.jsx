import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function AdminVendors() {
  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axiosInstance.get('/admin/vendors');
        setVendors(res.data.vendors);
      } catch (err) {
        console.error('Failed to load vendors', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    setDeleting(id);
    try {
      await axiosInstance.delete(`/admin/vendors/${id}`);
      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vendor');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Vendors</h1>
            <p className="text-sm text-white/40 mt-1">{vendors.length} registered vendors</p>
          </div>
          <Link
            to="/admin/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition no-underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white/30 text-sm text-center py-20">Loading vendors...</p>
        )}

        {/* Empty */}
        {!loading && vendors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-white/30 text-sm">No vendors registered yet</p>
          </div>
        )}

        {/* Vendors list */}
        {!loading && vendors.length > 0 && (
          <div className="flex flex-col gap-3">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-center justify-between flex-wrap gap-4"
              >
                {/* Avatar + info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0">
                    {vendor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{vendor.name}</p>
                    <p className="text-xs text-white/40">{vendor.email}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      Joined {new Date(vendor.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(vendor._id)}
                  disabled={deleting === vendor._id}
                  className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-500/20 text-xs rounded-xl hover:bg-red-600/20 transition disabled:opacity-40"
                >
                  {deleting === vendor._id ? 'Deleting...' : 'Delete vendor'}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}