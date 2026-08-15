import { useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Reports() {

    const [period, setPeriod] = useState("daily");

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(false);


    // --------------------------------------------------
    // FETCH REPORT
    // --------------------------------------------------

    const fetchReport = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/reports/${period}`
            );

            setReport(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to generate report"
            );

        } finally {

            setLoading(false);

        }

    };


    // --------------------------------------------------
    // DOWNLOAD CSV
    // --------------------------------------------------

    const downloadCSV = async () => {

        try {

            const response = await api.get(
                `/reports/export/csv?period=${period}`,
                {
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `${period}_report.csv`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success("CSV report downloaded!");

        } catch (error) {

            toast.error(
                "Failed to download CSV report"
            );

        }

    };


    // --------------------------------------------------
    // DOWNLOAD PDF
    // --------------------------------------------------

    const downloadPDF = async () => {

        try {

            const response = await api.get(
                `/reports/export/pdf?period=${period}`,
                {
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `${period}_report.pdf`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success("PDF report downloaded!");

        } catch (error) {

            toast.error(
                "Failed to download PDF report"
            );

        }

    };


    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* ------------------------------------------------ */}
                {/* HEADER */}
                {/* ------------------------------------------------ */}

                <div>

                    <h1 className="text-4xl font-bold text-slate-800">
                        Financial Reports
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Generate and export financial reports.
                    </p>

                </div>


                {/* ------------------------------------------------ */}
                {/* REPORT CONTROLS */}
                {/* ------------------------------------------------ */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                    <h2 className="text-xl font-bold text-slate-800 mb-5">
                        Report Period
                    </h2>


                    <div className="flex flex-col md:flex-row gap-4">

                        <select
                            value={period}
                            onChange={(e) =>
                                setPeriod(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="daily">
                                Daily Report
                            </option>

                            <option value="weekly">
                                Weekly Report
                            </option>

                            <option value="monthly">
                                Monthly Report
                            </option>

                        </select>


                        <button
                            onClick={fetchReport}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >

                            {loading
                                ? "Generating..."
                                : "Generate Report"
                            }

                        </button>

                    </div>

                </div>


                {/* ------------------------------------------------ */}
                {/* REPORT SUMMARY */}
                {/* ------------------------------------------------ */}

                {report && (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        <div className="bg-white rounded-2xl shadow border border-slate-200 p-5">

                            <p className="text-sm text-slate-500">
                                Total Transactions
                            </p>

                            <p className="text-2xl font-bold text-slate-800 mt-2">
                                {report.total_transactions}
                            </p>

                        </div>


                        <div className="bg-white rounded-2xl shadow border border-slate-200 p-5">

                            <p className="text-sm text-slate-500">
                                Total Revenue
                            </p>

                            <p className="text-2xl font-bold text-green-600 mt-2">
                                ₹{Number(
                                    report.total_revenue
                                ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </p>

                        </div>


                        <div className="bg-white rounded-2xl shadow border border-slate-200 p-5">

                            <p className="text-sm text-slate-500">
                                Total Expenses
                            </p>

                            <p className="text-2xl font-bold text-red-600 mt-2">
                                ₹{Number(
                                    report.total_expenses
                                ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </p>

                        </div>


                        <div className="bg-white rounded-2xl shadow border border-slate-200 p-5">

                            <p className="text-sm text-slate-500">
                                Net Revenue
                            </p>

                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                ₹{Number(
                                    report.net_revenue
                                ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2
                                })}
                            </p>

                        </div>

                    </div>

                )}


                {/* ------------------------------------------------ */}
                {/* TRANSACTION STATUS */}
                {/* ------------------------------------------------ */}

                {report && (

                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                        <h2 className="text-xl font-bold text-slate-800 mb-5">
                            Transaction Status
                        </h2>


                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                            <div>

                                <p className="text-sm text-slate-500">
                                    Successful
                                </p>

                                <p className="text-2xl font-bold text-green-600">
                                    {report.successful_transactions}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-slate-500">
                                    Pending
                                </p>

                                <p className="text-2xl font-bold text-yellow-600">
                                    {report.pending_transactions}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-slate-500">
                                    Failed
                                </p>

                                <p className="text-2xl font-bold text-red-600">
                                    {report.failed_transactions}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-slate-500">
                                    Refunded
                                </p>

                                <p className="text-2xl font-bold text-purple-600">
                                    {report.refunded_transactions}
                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* ------------------------------------------------ */}
                {/* EXPORT */}
                {/* ------------------------------------------------ */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                        Export Report
                    </h2>

                    <p className="text-sm text-slate-500 mb-5">
                        Download the selected report period as a PDF or CSV file.
                    </p>


                    <div className="flex flex-col sm:flex-row gap-4">

                        <button
                            onClick={downloadPDF}
                            className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        >
                            Download PDF
                        </button>


                        <button
                            onClick={downloadCSV}
                            className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        >
                            Download CSV
                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}