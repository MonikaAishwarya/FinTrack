import {
    LayoutDashboard,
    Receipt,
    Wallet,
    LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {

    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        if (window.confirm("Are you sure you want to logout?")) {

            logout();

            navigate("/login");

        }

    };

    const menu = [

        {
            title: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            path: "/dashboard"
        },

        {
            title: "Transactions",
            icon: <Receipt size={20} />,
            path: "/transactions"
        }

    ];

    return (

        <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

            <div className="p-8 border-b border-slate-700">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">

                        <Wallet size={24} />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold">
                            FinTrack
                        </h1>

                        <p className="text-slate-400 text-sm">
                            Personal Finance
                        </p>

                    </div>

                </div>

            </div>

            <nav className="flex-1 mt-8">

                {

                    menu.map((item) => (

                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>

                                `flex items-center gap-4 px-8 py-4 transition

                                ${

                                    isActive

                                        ? "bg-blue-600"

                                        : "hover:bg-slate-800"

                                }`

                            }
                        >

                            {item.icon}

                            {item.title}

                        </NavLink>

                    ))

                }

            </nav>

            <button

                onClick={handleLogout}

                className="flex items-center gap-4 px-8 py-5 hover:bg-red-600 transition"

            >

                <LogOut size={20} />

                Logout

            </button>

        </aside>

    );

}