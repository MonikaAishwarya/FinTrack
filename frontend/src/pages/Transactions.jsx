import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";

import DashboardLayout from "../layouts/DashboardLayout";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionTable from "../components/transactions/TransactionTable";

export default function Transactions() {

    const [transactions, setTransactions] = useState([]);

    // Filters
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const perPage = 10;


    // --------------------------------------------------
    // FETCH TRANSACTIONS
    // --------------------------------------------------

    const fetchTransactions = async () => {

        try {

            const response = await api.get(
                "/transactions/",
                {
                    params: {
                        search,
                        type,
                        status,
                        date,
                        page,
                        per_page: perPage
                    }
                }
            );

            setTransactions(
                response.data.transactions
            );

            setTotalPages(
                response.data.pages
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch transactions"
            );

        }

    };


    // --------------------------------------------------
    // FETCH WHEN FILTERS / PAGE CHANGE
    // --------------------------------------------------

    useEffect(() => {

        fetchTransactions();

    }, [
        search,
        type,
        status,
        date,
        page
    ]);


    // --------------------------------------------------
    // ADD TRANSACTION
    // --------------------------------------------------

    const addTransaction = async (transaction) => {

        try {

            await api.post(
                "/transactions/",
                transaction
            );

            toast.success(
                "Transaction Added Successfully!"
            );

            setPage(1);

            fetchTransactions();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to add transaction"
            );

        }

    };


    // --------------------------------------------------
    // DELETE TRANSACTION
    // --------------------------------------------------

    const deleteTransaction = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;


        try {

            await api.delete(
                `/transactions/${id}`
            );

            toast.success(
                "Transaction Deleted!"
            );

            fetchTransactions();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

    };


    // --------------------------------------------------
    // FILTER HANDLERS
    // --------------------------------------------------

    const handleSearchChange = (e) => {

        setSearch(e.target.value);

        setPage(1);

    };


    const handleTypeChange = (e) => {

        setType(e.target.value);

        setPage(1);

    };


    const handleStatusChange = (e) => {

        setStatus(e.target.value);

        setPage(1);

    };


    const handleDateChange = (e) => {

        setDate(e.target.value);

        setPage(1);

    };


    // --------------------------------------------------
    // CLEAR FILTERS
    // --------------------------------------------------

    const clearFilters = () => {

        setSearch("");
        setType("");
        setStatus("");
        setDate("");
        setPage(1);

    };


    // --------------------------------------------------
    // EXPORT CSV / PDF REPORT
    // --------------------------------------------------

    const exportReport = async (format, period) => {

        try {

            const response = await api.get(
                `/reports/export/${format}`,
                {
                    params: {
                        period
                    },
                    responseType: "blob"
                }
            );


            const blob = new Blob(
                [response.data],
                {
                    type:
                        format === "csv"
                            ? "text/csv"
                            : "application/pdf"
                }
            );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                `${period}_report.${format}`;


            document.body.appendChild(link);


            link.click();


            link.remove();


            window.URL.revokeObjectURL(url);


            toast.success(
                `${period} ${format.toUpperCase()} report downloaded!`
            );


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to export report"
            );

        }

    };


    return (

        <DashboardLayout>

            <div className="space-y-8">


                {/* ------------------------------------------------ */}
                {/* PAGE HEADER */}
                {/* ------------------------------------------------ */}

                <div>

                    <h1 className="text-4xl font-bold text-slate-800">
                        Transactions
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track and manage your income and expenses.
                    </p>

                </div>


                {/* ------------------------------------------------ */}
                {/* TRANSACTION FORM */}
                {/* ------------------------------------------------ */}

                <div className="max-w-3xl">

                    <TransactionForm
                        onTransactionAdded={
                            addTransaction
                        }
                    />

                </div>


                {/* ------------------------------------------------ */}
                {/* FILTER SECTION */}
                {/* ------------------------------------------------ */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                    <h2 className="text-xl font-bold text-slate-800 mb-5">
                        Search & Filter Transactions
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


                        {/* Search */}

                        <div>

                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Search
                            </label>

                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={
                                    handleSearchChange
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Type */}

                        <div>

                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Type
                            </label>

                            <select
                                value={type}
                                onChange={
                                    handleTypeChange
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    All Types
                                </option>

                                <option value="income">
                                    Income
                                </option>

                                <option value="expense">
                                    Expense
                                </option>

                            </select>

                        </div>


                        {/* Status */}

                        <div>

                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="Success">
                                    Success
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Failed">
                                    Failed
                                </option>

                                <option value="Refunded">
                                    Refunded
                                </option>

                            </select>

                        </div>


                        {/* Date */}

                        <div>

                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={
                                    handleDateChange
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>


                    {/* Clear Filters */}

                    <div className="mt-5">

                        <button
                            onClick={clearFilters}
                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>


                {/* ------------------------------------------------ */}
                {/* FINANCIAL REPORTS */}
                {/* ------------------------------------------------ */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                        Financial Reports
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Download your financial reports in CSV or PDF format.
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                        {/* DAILY */}

                        <div className="border border-slate-200 rounded-2xl p-5">

                            <h3 className="text-lg font-bold text-slate-800 mb-4">
                                Daily Report
                            </h3>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    onClick={() =>
                                        exportReport(
                                            "csv",
                                            "daily"
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                                >
                                    Download CSV
                                </button>

                                <button
                                    onClick={() =>
                                        exportReport(
                                            "pdf",
                                            "daily"
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition"
                                >
                                    Download PDF
                                </button>

                            </div>

                        </div>


                        {/* WEEKLY */}

                        <div className="border border-slate-200 rounded-2xl p-5">

                            <h3 className="text-lg font-bold text-slate-800 mb-4">
                                Weekly Report
                            </h3>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    onClick={() =>
                                        exportReport(
                                            "csv",
                                            "weekly"
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                                >
                                    Download CSV
                                </button>

                                <button
                                    onClick={() =>
                                        exportReport(
                                            "pdf",
                                            "weekly"
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition"
                                >
                                    Download PDF
                                </button>

                            </div>

                        </div>


                        {/* MONTHLY */}

                        <div className="border border-slate-200 rounded-2xl p-5">

                            <h3 className="text-lg font-bold text-slate-800 mb-4">
                                Monthly Report
                            </h3>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    onClick={() =>
                                        exportReport(
                                            "csv",
                                            "monthly"
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                                >
                                    Download CSV
                                </button>

                                <button
                                    onClick={() =>
                                        exportReport(
                                            "pdf",
                                            "monthly"
                                        )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition"
                                >
                                    Download PDF
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ------------------------------------------------ */}
                {/* TRANSACTION TABLE */}
                {/* ------------------------------------------------ */}

                <TransactionTable
                    transactions={transactions}
                    onDelete={deleteTransaction}
                />


                {/* ------------------------------------------------ */}
                {/* PAGINATION */}
                {/* ------------------------------------------------ */}

                {totalPages > 1 && (

                    <div className="flex items-center justify-center gap-4">

                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage(page - 1)
                            }
                            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ← Previous
                        </button>


                        <span className="px-4 py-2 font-medium text-slate-700">
                            Page {page} of {totalPages}
                        </span>


                        <button
                            disabled={
                                page === totalPages
                            }
                            onClick={() =>
                                setPage(page + 1)
                            }
                            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next →
                        </button>

                    </div>

                )}

            </div>

        </DashboardLayout>

    );

}