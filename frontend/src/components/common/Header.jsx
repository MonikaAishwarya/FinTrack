import { useEffect, useState } from "react";
import {
    Bell,
    Search,
    AlertTriangle
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Header() {

    const { user } = useAuth();

    const [alerts, setAlerts] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const username =
        user?.name ||
        user?.username ||
        "User";


    // --------------------------------------------------
    // FETCH FRAUD ALERTS
    // --------------------------------------------------

    const fetchAlerts = async () => {

        try {

            const response = await api.get(
                "/fraud/alerts"
            );

            setAlerts(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch fraud alerts",
                error
            );

        }

    };


    // --------------------------------------------------
    // FETCH ALERTS ON LOAD
    // --------------------------------------------------

    useEffect(() => {

        fetchAlerts();

    }, []);


    // --------------------------------------------------
    // CURRENT DATE
    // --------------------------------------------------

    const today = new Date().toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );


    return (

        <header className="bg-white rounded-2xl shadow-sm px-8 py-5 flex items-center justify-between">

            {/* ------------------------------------------------ */}
            {/* LEFT SIDE */}
            {/* ------------------------------------------------ */}

            <div>

                <p className="text-sm text-gray-500">
                    Welcome Back 👋
                </p>

                <h1 className="text-3xl font-bold text-slate-800 mt-1">
                    {username}
                </h1>

                <p className="text-gray-500 mt-1">
                    {today}
                </p>

            </div>


            {/* ------------------------------------------------ */}
            {/* RIGHT SIDE */}
            {/* ------------------------------------------------ */}

            <div className="flex items-center gap-5">


                {/* SEARCH */}

                <div className="relative">

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-72 h-11 rounded-xl border border-gray-200 pl-4 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <Search
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                </div>


                {/* ------------------------------------------------ */}
                {/* NOTIFICATION BELL */}
                {/* ------------------------------------------------ */}

                <div className="relative">

                    <button
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                        className="relative w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >

                        <Bell size={20} />

                        {/* ALERT COUNT */}

                        {alerts.length > 0 && (

                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">

                                {alerts.length > 99
                                    ? "99+"
                                    : alerts.length}

                            </span>

                        )}

                    </button>


                    {/* ------------------------------------------------ */}
                    {/* NOTIFICATION DROPDOWN */}
                    {/* ------------------------------------------------ */}

                    {showNotifications && (

                        <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">

                            {/* HEADER */}

                            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-800">
                                        Notifications
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Fraud alerts
                                    </p>

                                </div>

                                {alerts.length > 0 && (

                                    <span className="text-xs font-semibold text-red-600">
                                        {alerts.length} alert
                                        {alerts.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>

                                )}

                            </div>


                            {/* ALERTS */}

                            <div className="max-h-96 overflow-y-auto">

                                {alerts.length === 0 ? (

                                    <div className="px-5 py-10 text-center">

                                        <Bell
                                            size={32}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 font-semibold text-slate-700">
                                            No notifications
                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">
                                            No suspicious activity detected.
                                        </p>

                                    </div>

                                ) : (

                                    alerts.slice(0, 5).map(
                                        (alert) => (

                                            <div
                                                key={alert.id}
                                                className="px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition"
                                            >

                                                <div className="flex gap-3">

                                                    <div className="flex-shrink-0">

                                                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">

                                                            <AlertTriangle
                                                                size={18}
                                                                className="text-red-600"
                                                            />

                                                        </div>

                                                    </div>


                                                    <div className="flex-1 min-w-0">

                                                        <div className="flex items-center justify-between gap-2">

                                                            <p className="font-semibold text-sm text-slate-800 truncate">
                                                                {
                                                                    alert.alert_type
                                                                }
                                                            </p>

                                                            <span
                                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                                    alert.severity ===
                                                                    "High"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                            >
                                                                {
                                                                    alert.severity
                                                                }
                                                            </span>

                                                        </div>


                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {
                                                                alert.message
                                                            }
                                                        </p>


                                                        <p className="text-xs text-slate-400 mt-2">

                                                            Transaction #
                                                            {
                                                                alert.transaction_id
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )

                                )}

                            </div>


                            {/* FOOTER */}

                            {alerts.length > 5 && (

                                <div className="px-5 py-3 bg-slate-50 text-center">

                                    <p className="text-sm text-blue-600 font-semibold">

                                        View all alerts from Fraud Alerts page

                                    </p>

                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* ------------------------------------------------ */}
                {/* USER AVATAR */}
                {/* ------------------------------------------------ */}

                <div
                    title={username}
                    className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg"
                >
                    {username.charAt(0).toUpperCase()}
                </div>

            </div>

        </header>

    );

}