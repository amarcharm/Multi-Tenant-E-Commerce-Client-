import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">

        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Order placed!</h1>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          Your order has been placed successfully. You will receive updates on your delivery soon.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition no-underline inline-block"
          >
            View my orders
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-white/[0.06] text-white/60 border border-white/10 text-sm rounded-xl hover:bg-white/10 transition no-underline inline-block"
          >
            Continue shopping
          </Link>
        </div>

      </div>
    </div>
  );
}