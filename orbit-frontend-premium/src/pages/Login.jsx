import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Real Backend Login Function
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login Successful ✅");

        // ✅ Save Token in LocalStorage
        localStorage.setItem("token", data.token);

        // ✅ Save User in Context
        login(data.user);

        // ✅ Redirect Dashboard
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid Credentials ❌");
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
          Orbit Login 🚀
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
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
            placeholder="Enter password"
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
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-300 mt-6 text-sm">
          New user?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}