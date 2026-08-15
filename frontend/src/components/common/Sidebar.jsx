import {
    LayoutDashboard,
    Wallet,
    Users,
    ChartNoAxesCombined,
    FileText,
    ShieldAlert,
    LogOut,
    ChevronLeft,
    ChevronRight,
    SettingsIcon
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

            {/* ================================================== */}
            {/* TOP */}
            {/* ================================================== */}

            <div className="
                flex
                items-center
                justify-between
                p-5
                border-b
                border-slate-700
            ">

                {!collapsed && (

                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                        ">
                            FinTrack
                        </h1>

                        <p className="
                            text-sm
                            text-slate-400
                        ">
                            Personal Finance
                        </p>

                    </div>

                )}

                <button
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                    className="
                        p-2
                        rounded-lg
                        hover:bg-slate-700
                        transition
                    "
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >

                    {collapsed
                        ? <ChevronRight size={20} />
                        : <ChevronLeft size={20} />
                    }

                </button>

            </div>


            {/* ================================================== */}
            {/* NAVIGATION */}
            {/* ================================================== */}

            <nav className="
                flex-1
                mt-8
                flex
                flex-col
                gap-2
                px-3
            ">

                {/* ------------------------------------------------ */}
                {/* DASHBOARD */}
                {/* ------------------------------------------------ */}

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
                    title="Dashboard"
                >

                    <LayoutDashboard size={22} />

                    {!collapsed && (
                        <span>
                            Dashboard
                        </span>
                    )}

                </NavLink>


                {/* ------------------------------------------------ */}
                {/* TRANSACTIONS */}
                {/* ------------------------------------------------ */}

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
                    title="Transactions"
                >

                    <Wallet size={22} />

                    {!collapsed && (
                        <span>
                            Transactions
                        </span>
                    )}

                </NavLink>


                {/* ------------------------------------------------ */}
                {/* CUSTOMERS */}
                {/* ------------------------------------------------ */}

                <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`
                    }
                    title="Customers"
                >

                    <Users size={22} />

                    {!collapsed && (
                        <span>
                            Customers
                        </span>
                    )}

                </NavLink>


                {/* ------------------------------------------------ */}
                {/* ANALYTICS */}
                {/* ------------------------------------------------ */}

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`
                    }
                    title="Analytics"
                >

                    <ChartNoAxesCombined size={22} />

                    {!collapsed && (
                        <span>
                            Analytics
                        </span>
                    )}

                </NavLink>


                {/* ------------------------------------------------ */}
                {/* REPORTS */}
                {/* ------------------------------------------------ */}

                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`
                    }
                    title="Reports"
                >

                    <FileText size={22} />

                    {!collapsed && (
                        <span>
                            Reports
                        </span>
                    )}

                </NavLink>


                {/* ------------------------------------------------ */}
                {/* FRAUD ALERTS */}
                {/* ------------------------------------------------ */}

                <NavLink
                    to="/fraud-alerts"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`
                    }
                    title="Fraud Alerts"
                >

                    <ShieldAlert size={22} />

                    {!collapsed && (
                        <span>
                            Fraud Alerts
                        </span>
                    )}

                </NavLink>

                {/* ------------------------------------------------ */}
                {/* SETTINGS */}
                {/* ------------------------------------------------ */}

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                            isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-800"
                        }`
                    }
                    title="Settings"
                >

                    <SettingsIcon size={22} />

                    {!collapsed && (
                        <span>
                            Settings
                        </span>
                    )}

                </NavLink>

            </nav>


            {/* ================================================== */}
            {/* BOTTOM */}
            {/* ================================================== */}

            <div className="
                mt-auto
                p-3
            ">

                <button
                    onClick={logout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-4
                        px-4
                        py-3
                        rounded-xl
                        hover:bg-red-600
                        transition
                    "
                    title="Logout"
                >

                    <LogOut size={22} />

                    {!collapsed && (
                        <span>
                            Logout
                        </span>
                    )}

                </button>

            </div>

        </aside>

    );

}