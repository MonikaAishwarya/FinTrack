import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();
  
  const handleLogin = async () => {

      try {

          const response = await api.post("/auth/login", {
              email,
              password
          });

          login({
              token: response.data.token,
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email
          });

          toast.success("Login Successful!");

          navigate("/dashboard");

      } catch (error) {

          toast.error(
              error.response?.data?.message || "Login Failed"
          );

      }

  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to your FinTech Dashboard
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4 outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6 outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
            Login
        </button>

        <div className="text-center mt-6">

            <p className="text-gray-500">

                Don't have an account?

                <span
                    onClick={() => navigate("/register")}
                    className="text-blue-600 ml-2 cursor-pointer hover:underline font-semibold"
                >
                    Create Account
                </span>

            </p>

        </div>

      </div>

    </div>
  );
}