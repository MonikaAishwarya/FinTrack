import { useState } from "react";
import toast from "react-hot-toast";
import {
    User,
    Mail,
    Lock,
    Bell,
    Wallet,
    LogOut
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Settings() {

    const { user, logout } = useAuth();

    const [notifications, setNotifications] = useState(true);

    const [currency, setCurrency] = useState("INR");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);


    // ==================================================
    // CHANGE PASSWORD
    // ==================================================

    const handleChangePassword = async (e) => {

        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {

            toast.error(
                "Please fill all password fields"
            );

            return;
        }

        if (newPassword !== confirmPassword) {

            toast.error(
                "New passwords do not match"
            );

            return;
        }

        if (newPassword.length < 6) {

            toast.error(
                "Password must contain at least 6 characters"
            );

            return;
        }

        try {

            setLoading(true);

            await api.put(
                "/auth/change-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword
                }
            );

            toast.success(
                "Password changed successfully"
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // SAVE PREFERENCES
    // ==================================================

    const savePreferences = () => {

        localStorage.setItem(
            "currency",
            currency
        );

        localStorage.setItem(
            "notifications",
            notifications
        );

        toast.success(
            "Preferences saved successfully"
        );

    };


    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div>

                    <h1 className="
                        text-4xl
                        font-bold
                        text-slate-800
                    ">
                        Settings
                    </h1>

                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        Manage your account and application preferences.
                    </p>

                </div>


                {/* ================================================== */}
                {/* PROFILE */}
                {/* ================================================== */}

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    border
                    border-slate-200
                    p-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    ">

                        <div className="
                            w-11
                            h-11
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                        ">

                            <User size={22} />

                        </div>

                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                Profile
                            </h2>

                            <p className="
                                text-sm
                                text-slate-500
                            ">
                                Your account information
                            </p>

                        </div>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                    ">

                        {/* NAME */}

                        <div>

                            <label className="
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                Name
                            </label>

                            <div className="
                                mt-2
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-200
                            ">

                                <User
                                    size={18}
                                    className="text-slate-400"
                                />

                                <span className="
                                    text-slate-700
                                ">
                                    {user?.name || "User"}
                                </span>

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label className="
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                Email
                            </label>

                            <div className="
                                mt-2
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-200
                            ">

                                <Mail
                                    size={18}
                                    className="text-slate-400"
                                />

                                <span className="
                                    text-slate-700
                                ">
                                    {user?.email || "Not available"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================== */}
                {/* PASSWORD */}
                {/* ================================================== */}

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    border
                    border-slate-200
                    p-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    ">

                        <div className="
                            w-11
                            h-11
                            rounded-xl
                            bg-purple-100
                            text-purple-600
                            flex
                            items-center
                            justify-center
                        ">

                            <Lock size={22} />

                        </div>

                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                Change Password
                            </h2>

                            <p className="
                                text-sm
                                text-slate-500
                            ">
                                Keep your account secure
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleChangePassword}
                        className="
                            max-w-xl
                            space-y-5
                        "
                    >

                        {/* CURRENT PASSWORD */}

                        <div>

                            <label className="
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter current password"
                                className="
                                    w-full
                                    mt-2
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-slate-300
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        {/* NEW PASSWORD */}

                        <div>

                            <label className="
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                className="
                                    w-full
                                    mt-2
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-slate-300
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label className="
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                className="
                                    w-full
                                    mt-2
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-slate-300
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-blue-600
                                text-white
                                font-semibold
                                hover:bg-blue-700
                                transition
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Changing..."
                                : "Change Password"
                            }

                        </button>

                    </form>

                </div>


                {/* ================================================== */}
                {/* PREFERENCES */}
                {/* ================================================== */}

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    border
                    border-slate-200
                    p-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    ">

                        <div className="
                            w-11
                            h-11
                            rounded-xl
                            bg-green-100
                            text-green-600
                            flex
                            items-center
                            justify-center
                        ">

                            <Wallet size={22} />

                        </div>

                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                Preferences
                            </h2>

                            <p className="
                                text-sm
                                text-slate-500
                            ">
                                Customize your FinTrack experience
                            </p>

                        </div>

                    </div>


                    <div className="
                        space-y-5
                        max-w-xl
                    ">

                        {/* CURRENCY */}

                        <div>

                            <label className="
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                Currency
                            </label>

                            <select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    mt-2
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-slate-300
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            >

                                <option value="INR">
                                    Indian Rupee (₹)
                                </option>

                                <option value="USD">
                                    US Dollar ($)
                                </option>

                                <option value="EUR">
                                    Euro (€)
                                </option>

                            </select>

                        </div>


                        {/* NOTIFICATIONS */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            p-4
                            rounded-xl
                            bg-slate-50
                            border
                            border-slate-200
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <Bell
                                    size={20}
                                    className="text-slate-500"
                                />

                                <div>

                                    <p className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                        Fraud Notifications
                                    </p>

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        Receive notifications for suspicious activity
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setNotifications(
                                        !notifications
                                    )
                                }
                                className={`
                                    relative
                                    w-12
                                    h-6
                                    rounded-full
                                    transition
                                    ${
                                        notifications
                                            ? "bg-blue-600"
                                            : "bg-slate-300"
                                    }
                                `}
                            >

                                <span
                                    className={`
                                        absolute
                                        top-1
                                        w-4
                                        h-4
                                        bg-white
                                        rounded-full
                                        transition
                                        ${
                                            notifications
                                                ? "left-7"
                                                : "left-1"
                                        }
                                    `}
                                />

                            </button>

                        </div>


                        {/* SAVE */}

                        <button
                            onClick={savePreferences}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-slate-900
                                text-white
                                font-semibold
                                hover:bg-slate-800
                                transition
                            "
                        >
                            Save Preferences
                        </button>

                    </div>

                </div>


                {/* ================================================== */}
                {/* LOGOUT */}
                {/* ================================================== */}

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    border
                    border-red-100
                    p-6
                ">

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-5
                    ">

                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                Logout
                            </h2>

                            <p className="
                                text-sm
                                text-slate-500
                                mt-1
                            ">
                                Sign out of your FinTrack account.
                            </p>

                        </div>


                        <button
                            onClick={logout}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-6
                                py-3
                                rounded-xl
                                bg-red-600
                                text-white
                                font-semibold
                                hover:bg-red-700
                                transition
                            "
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}