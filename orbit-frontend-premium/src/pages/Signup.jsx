import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Backend Signup Function
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
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

        // Redirect to login page
        navigate("/login");
      } else {
        alert(data.message || "Signup Failed ❌");
      }
    } catch (error) {
      alert("Server Error ❌ Backend not running");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-2xl">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8">
          Create Account ✨
        </h1>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          
          {/* Name */}
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Create password"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-300 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}