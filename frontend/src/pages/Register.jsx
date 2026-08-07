import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

export default function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {

        try {

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            toast.success("Account Created Successfully!");

            setTimeout(() => {

                navigate("/login");

            }, 1000);

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Registration Failed"
            );

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

            <div className="bg-white p-8 rounded-xl shadow-xl w-[400px]">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Register to use FinTrack
                </p>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border rounded-lg p-3 mb-4 outline-none focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Register
                </button>

                <div className="text-center mt-6">

                    <p className="text-gray-500">

                        Already have an account?

                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-600 ml-2 cursor-pointer hover:underline font-semibold"
                        >
                            Login
                        </span>

                    </p>

                </div>

            </div>

        </div>

    );

}