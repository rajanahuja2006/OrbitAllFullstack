import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_CONFIG from "../utils/api";
import CrazyBackground from "../components/CrazyBackground";
import AnimatedParticles from "../components/AnimatedParticles";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(API_CONFIG.AUTH_SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup Successful ✅ Now Login");
        setTimeout(() => navigate("/login"), 500);
      } else {
        alert(data.message || "Signup Failed ❌");
      }
    } catch (error) {
      alert("Server Error ❌ Backend not running");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <CrazyBackground />
      <AnimatedParticles count={60} />
      
      <style>{`
        @keyframes glitchText {
          0% { text-shadow: 3px 0 #ff00ff, -3px 0 #00ffff; }
          25% { text-shadow: -3px 0 #ff00ff, 3px 0 #00ffff; }
          50% { text-shadow: 0 0 #ff00ff, 0 0 #00ffff; }
          75% { text-shadow: 3px 0 #ff00ff, -3px 0 #00ffff; }
          100% { text-shadow: -3px 0 #ff00ff, 3px 0 #00ffff; }
        }
        
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .glitch-title {
          animation: glitchText 0.3s infinite;
          font-size: 2.5rem;
          letter-spacing: 4px;
        }
        
        .signup-card {
          animation: slideInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: rgba(10, 14, 39, 0.6);
          border: 2px solid rgba(0, 255, 136, 0.3);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px 0 rgba(0, 255, 136, 0.1),
                      0 0 50px rgba(0, 255, 136, 0.05),
                      inset 0 0 30px rgba(0, 255, 136, 0.02);
        }
        
        .cyber-input {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 255, 136, 0.3);
          color: #00ff88;
          transition: all 0.3s ease;
          padding: 12px 16px;
          font-size: 16px;
        }
        
        .cyber-input::placeholder {
          color: rgba(0, 255, 136, 0.5);
        }
        
        .cyber-input:focus {
          background: rgba(0, 255, 136, 0.05);
          border-color: rgba(0, 255, 136, 0.8);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4), 
                      inset 0 0 20px rgba(0, 255, 136, 0.05);
          outline: none;
        }
        
        .cyber-button {
          background: linear-gradient(135deg, #00ff88, #00ffff);
          background-size: 200% 200%;
          animation: morphGradient 3s ease infinite;
          color: #0a0e27;
          font-weight: bold;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
        
        .cyber-button:hover:not(:disabled) {
          box-shadow: 0 0 40px rgba(0, 255, 136, 0.8), 0 0 60px rgba(0, 255, 255, 0.6);
          transform: translateY(-2px);
        }
        
        .cyber-button:disabled {
          opacity: 0.7;
        }
        
        @keyframes morphGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .login-link {
          color: #00ffff;
          text-decoration: none;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .login-link:hover {
          color: #00ff88;
          text-shadow: 0 0 10px #00ffff;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .input-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 8px;
          background: rgba(0, 255, 136, 0.1);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .input-wrapper:focus-within .input-glow {
          opacity: 1;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <div className="signup-card p-8 rounded-3xl">
          {/* Glitch Title */}
          <div className="text-center mb-8">
            <h1 className="glitch-title text-white font-black">
              INITIALIZE
            </h1>
            <p className="text-sm mt-3 text-cyan-400 tracking-widest font-mono">
              &gt; CREATE_NEW_ACCOUNT
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name Input */}
            <motion.div
              className="input-wrapper"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="input-glow rounded-lg"></div>
              <input
                type="text"
                placeholder="FULL_NAME"
                className="w-full cyber-input rounded-lg relative z-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>

            {/* Email Input */}
            <motion.div
              className="input-wrapper"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="input-glow rounded-lg"></div>
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                className="w-full cyber-input rounded-lg relative z-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="input-wrapper"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="input-glow rounded-lg"></div>
              <input
                type="password"
                placeholder="SECURE_PASSWORD"
                className="w-full cyber-input rounded-lg relative z-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            {/* Signup Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg cyber-button mt-6 text-sm uppercase"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⚙️</span> Creating Account...
                </span>
              ) : (
                "ACTIVATE_ACCOUNT"
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8 text-sm">
            <p className="text-gray-400">
              Already have access?{" "}
              <Link to="/login" className="login-link font-semibold">
                RETURN_TO_LOGIN
              </Link>
            </p>
            <p className="text-xs text-gray-600 font-mono mt-4">
              🔐 SECURE_MODE | STATUS: READY
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
}