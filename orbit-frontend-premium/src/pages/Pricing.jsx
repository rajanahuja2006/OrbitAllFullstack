import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBase } from "../utils/api";
import CrazyBackground from "../components/CrazyBackground";
import AnimatedParticles from "../components/AnimatedParticles";

const PLANS = [
  {
    name: "Basic",
    price: "$1.99",
    priceValue: 199,
    period: "month",
    resumeUploads: "5",
    features: [
      "5 Resume Uploads",
      "Basic ATS Analysis",
      "Email Support",
      "Download Reports"
    ],
    popular: false,
    id: "basic"
  },
  {
    name: "Premium",
    price: "$5.99",
    priceValue: 599,
    period: "month",
    resumeUploads: "50",
    features: [
      "50 Resume Uploads",
      "Advanced ATS Analysis",
      "AI Career Tutor Access",
      "Priority Email Support",
      "Job Matching",
      "Skill Recommendations"
    ],
    popular: true,
    id: "premium"
  },
  {
    name: "Pro",
    price: "$12.99",
    priceValue: 1299,
    period: "month",
    resumeUploads: "Unlimited",
    features: [
      "Unlimited Resume Uploads",
      "Expert Resume Review",
      "Full AI Suite Access",
      "24/7 Priority Support",
      "API Access",
      "Custom Roadmaps",
      "Interview Prep",
      "Monthly Strategy Call"
    ],
    popular: false,
    id: "pro"
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiBase = useMemo(() => getApiBase(), []);

  const handleSubscribe = async (planId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Create checkout session
      const response = await fetch(`${apiBase}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err.message || "Failed to process subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <CrazyBackground />
      <AnimatedParticles count={30} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan 🚀
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock premium features to accelerate your career growth
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-purple-500 ring-2 ring-purple-500/50"
                  : "border-purple-500/30 hover:border-purple-400"
              }`}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black/80" />
              
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm"
                >
                  MOST POPULAR ⭐
                </motion.div>
              )}

              <div className="relative z-10 p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-400">per {plan.period}</p>
                </div>

                {/* Resume Uploads */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="mb-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
                >
                  <p className="text-center text-lg font-semibold">
                    📄 <span className="text-cyan-400">{plan.resumeUploads}</span> Resume Uploads
                  </p>
                </motion.div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <motion.div
                      key={fidx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + fidx * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Subscribe Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/50"
                      : "bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-purple-300 border border-purple-500/50 hover:border-purple-400"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ⏳
                      </motion.div>
                      Processing...
                    </div>
                  ) : (
                    "Subscribe Now"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "Can I get a refund?",
                a: "We offer a 7-day money-back guarantee. If you're not satisfied, contact our support team."
              },
              {
                q: "Do you offer annual pricing?",
                a: "Currently, we offer monthly plans. Contact us for bulk or enterprise pricing options."
              },
              {
                q: "What happens when my uploads run out?",
                a: "When you reach your upload limit, you'll be prompted to upgrade your plan for more uploads."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-black/50 border border-purple-500/20"
              >
                <p className="font-semibold text-purple-300 mb-2">❓ {item.q}</p>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
