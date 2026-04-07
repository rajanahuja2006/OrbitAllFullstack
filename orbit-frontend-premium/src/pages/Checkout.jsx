import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan");
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // If no session or plan is provided, go back
  useEffect(() => {
    if (!sessionId || !plan) {
      navigate("/pricing");
    }
  }, [sessionId, plan, navigate]);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate Successful return redirect
      navigate(`/payment-success?session_id=${sessionId}&plan=${plan}`);
    }, 1500);
  };

  const planNames = {
    basic: { name: "Basic Plan", price: "₹169" },
    premium: { name: "Premium Plan", price: "₹499" },
    pro: { name: "Pro Plan", price: "₹1,099" },
  };

  const currentPlan = planNames[plan] || { name: "Unknown Plan", price: "₹0" };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 text-white overflow-hidden">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#06b6d4] to-[#c084fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-md p-8 sm:p-12 rounded-3xl border border-white/10 max-w-lg w-full relative z-10 shadow-2xl shadow-black/50"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Secure Checkout</h2>
          <p className="text-gray-300 mt-2">Test Environment Checkout</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
            <p className="text-sm text-gray-400">Monthly Subscription</p>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            {currentPlan.price}
          </div>
        </div>

        {/* Payment Options Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition ${paymentMethod === "card" ? "bg-purple-500/30 border-purple-400 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              Credit Card
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition ${paymentMethod === "upi" ? "bg-purple-500/30 border-cyan-400 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              UPI App
            </button>
            <button
              onClick={() => setPaymentMethod("netbanking")}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition ${paymentMethod === "netbanking" ? "bg-purple-500/30 border-pink-400 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              Net Banking
            </button>
          </div>
        </div>

        <div className="space-y-5 bg-black/20 rounded-2xl p-6 border border-white/5">
          <AnimatePresence mode="wait">
            {paymentMethod === "card" && (
              <motion.div key="card" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card Information (Enter any data)</label>
                  <div className="relative">
                    <input type="text" placeholder="1234 5678 9101 1121" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                    <input type="text" placeholder="123" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                  <input type="text" placeholder="Jane Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                </div>
              </motion.div>
            )}

            {paymentMethod === "upi" && (
              <motion.div key="upi" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-5 text-center">
                <div className="bg-white p-4 rounded-xl inline-block mb-2">
                  <div className="w-32 h-32 border-4 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-xs">QR Code Mock</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Or enter UPI ID</label>
                  <input type="text" placeholder="example@okhdfcbank" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                </div>
              </motion.div>
            )}

            {paymentMethod === "netbanking" && (
              <motion.div key="netbanking" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Select your Bank</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank"].map(bank => (
                       <label key={bank} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition">
                         <input type="radio" name="bank" className="w-4 h-4 text-pink-500" />
                         <span className="text-sm">{bank}</span>
                       </label>
                    ))}
                  </div>
                  <select className="w-full mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all appearance-none cursor-pointer">
                    <option className="bg-gray-800 text-white">Other Banks...</option>
                    <option className="bg-gray-800 text-white">Punjab National Bank</option>
                    <option className="bg-gray-800 text-white">Bank of Baroda</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handlePay}
          disabled={loading}
          className="w-full mt-8 btn-primary !py-4 text-lg !rounded-xl relative overflow-hidden group shadow-[0_0_15px_rgba(168,85,247,0.5)] transition hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              Processing Transaction...
            </div>
          ) : (
            `Pay ${currentPlan.price} Securely`
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2">
          🔒 Encrypted test environment
        </p>
      </motion.div>
    </div>
  );
}
