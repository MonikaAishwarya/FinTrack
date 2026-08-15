import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function FraudAlerts() {

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --------------------------------------------------
    // FETCH FRAUD ALERTS
    // --------------------------------------------------

    const fetchAlerts = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/fraud/alerts"
            );

            setAlerts(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch fraud alerts"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAlerts();

    }, []);

    // --------------------------------------------------
    // SEVERITY STYLING
    // --------------------------------------------------

    const getSeverityStyle = (severity) => {

        if (severity === "High") {

            return "bg-red-100 text-red-700";

        }

        if (severity === "Medium") {

            return "bg-yellow-100 text-yellow-700";

        }

        return "bg-blue-100 text-blue-700";

    };

    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* PAGE HEADER */}

                <div>

                    <h1 className="text-4xl font-bold text-slate-800">
                        Fraud Alerts
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Monitor suspicious transactions detected by the system.
                    </p>

                </div>


                {/* SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

                        <p className="text-sm text-slate-500">
                            Total Alerts
                        </p>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {alerts.length}
                        </p>

                    </div>


                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

                        <p className="text-sm text-slate-500">
                            High Severity
                        </p>

                        <p className="text-3xl font-bold text-red-600 mt-2">

                            {
                                alerts.filter(
                                    (alert) =>
                                        alert.severity === "High"
                                ).length
                            }

                        </p>

                    </div>


                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

                        <p className="text-sm text-slate-500">
                            Medium Severity
                        </p>

                        <p className="text-3xl font-bold text-yellow-600 mt-2">

                            {
                                alerts.filter(
                                    (alert) =>
                                        alert.severity === "Medium"
                                ).length
                            }

                        </p>

                    </div>

                </div>


                {/* ALERT LIST */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

                    <div className="p-6 border-b border-slate-200">

                        <h2 className="text-xl font-bold text-slate-800">
                            Suspicious Activity
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Alerts generated from transaction monitoring rules.
                        </p>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center text-slate-500">

                            Loading fraud alerts...

                        </div>

                    ) : alerts.length === 0 ? (

                        <div className="p-10 text-center">

                            <p className="text-lg font-semibold text-slate-700">
                                No fraud alerts
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                                No suspicious transactions have been detected.
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {alerts.map((alert) => (

                                <div
                                    key={alert.id}
                                    className="p-6 hover:bg-slate-50 transition"
                                >

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div className="flex-1">

                                            <div className="flex items-center gap-3 mb-2">

                                                <h3 className="font-bold text-slate-800">
                                                    {alert.alert_type}
                                                </h3>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityStyle(
                                                        alert.severity
                                                    )}`}
                                                >
                                                    {alert.severity}
                                                </span>

                                            </div>

                                            <p className="text-slate-600">
                                                {alert.message}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">

                                                <span>
                                                    Transaction #{alert.transaction_id}
                                                </span>

                                                <span>
                                                    {
                                                        alert.created_at
                                                            ? new Date(
                                                                  alert.created_at
                                                              ).toLocaleString()
                                                            : "Date unavailable"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>

    );

}