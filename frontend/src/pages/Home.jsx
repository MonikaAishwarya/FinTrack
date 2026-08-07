import { Navigate, useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine } from "react-icons/fa";

export default function Home() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center">

            <div className="bg-white rounded-3xl shadow-2xl p-12 w-[500px] text-center">

                <div className="flex justify-center mb-6">

                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">

                        <FaWallet className="text-white text-5xl" />

                    </div>

                </div>

                <h1 className="text-5xl font-extrabold text-gray-800">

                    FinTrack

                </h1>

                <p className="text-gray-500 mt-4 text-lg leading-relaxed">

                    Your personal finance companion for managing
                    income, expenses and savings with insightful
                    analytics.

                </p>

                <div className="flex justify-center items-center gap-2 text-blue-600 mt-6 font-medium">

                    <FaChartLine />

                    <span>Track • Analyze • Grow</span>

                </div>

                <div className="mt-10 space-y-4">

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-md"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl text-lg font-semibold transition duration-300"
                    >
                        Create Account
                    </button>

                </div>

                <p className="text-gray-400 text-sm mt-8">

                    Secure • Fast • Easy to Use

                </p>

            </div>

        </div>

    );

}