import {
    Bell,
    Search
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Header() {

    const { user } = useAuth();

    const username =
        user?.name ||
        user?.username ||
        "User";

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (

        <header className="bg-white rounded-2xl shadow-sm px-8 py-5 flex items-center justify-between">

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

            <div className="flex items-center gap-5">

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

                <button className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">

                    <Bell size={20} />

                </button>

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