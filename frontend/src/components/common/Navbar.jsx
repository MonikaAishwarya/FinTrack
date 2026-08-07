import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartPie, FaWallet, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleLogout = () => {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        logout();

        navigate("/login", { replace: true });

    };

    return (

        <nav className="bg-white shadow-lg px-8 py-4 flex justify-between items-center">

            <div className="flex items-center gap-3">

                <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaWallet className="text-xl" />
                </div>

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        FinTrack
                    </h1>

                    <p className="text-gray-500 text-sm">
                        Personal Finance Dashboard
                    </p>

                </div>

            </div>

            <div className="flex items-center gap-8">

                <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 font-semibold ${
                        location.pathname === "/dashboard"
                            ? "text-blue-600"
                            : "text-gray-600"
                    }`}
                >
                    <FaChartPie />
                    Dashboard
                </Link>

                <Link
                    to="/transactions"
                    className={`flex items-center gap-2 font-semibold ${
                        location.pathname === "/transactions"
                            ? "text-blue-600"
                            : "text-gray-600"
                    }`}
                >
                    <FaWallet />
                    Transactions
                </Link>

                <div className="flex items-center gap-4">

                    <div className="text-right">

                        <p className="font-semibold">
                            {user?.user?.name || "User"}
                        </p>

                        <p className="text-sm text-gray-500">
                            Welcome back
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

}