import {
    LayoutDashboard,
    Wallet,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ collapsed, setCollapsed }) {

    const { logout } = useAuth();

    return (

        <aside
            className={`
                fixed
                top-0
                left-0
                h-screen
                ${collapsed ? "w-20" : "w-64"}
                bg-slate-900
                text-white
                shadow-xl
                transition-all
                duration-300
                flex
                flex-col
                z-50
            `}
        >

            {/* Top */}

            <div className="flex items-center justify-between p-5 border-b border-slate-700">

                {!collapsed && (

                    <div>

                        <h1 className="text-2xl font-bold">
                            FinTrack
                        </h1>

                        <p className="text-sm text-slate-400">
                            Personal Finance
                        </p>

                    </div>

                )}

                <button

                    onClick={() => setCollapsed(!collapsed)}

                    className="p-2 rounded-lg hover:bg-slate-700 transition"

                >

                    {

                        collapsed

                            ? <ChevronRight size={20} />

                            : <ChevronLeft size={20} />

                    }

                </button>

            </div>

            {/* Navigation */}

            <nav className="flex-1 mt-8 flex flex-col gap-2 px-3">

                <NavLink

                    to="/dashboard"

                    className={({ isActive }) =>

                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`

                    }

                >

                    <LayoutDashboard size={22} />

                    {!collapsed && <span>Dashboard</span>}

                </NavLink>

                <NavLink

                    to="/transactions"

                    className={({ isActive }) =>

                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`

                    }

                >

                    <Wallet size={22} />

                    {!collapsed && <span>Transactions</span>}

                </NavLink>

            </nav>

            {/* Bottom */}

            <div className="mt-auto p-3">

                <button

                    onClick={logout}

                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-600 transition"

                >

                    <LogOut size={22} />

                    {!collapsed && <span>Logout</span>}

                </button>

            </div>

        </aside>

    );

}