import { useState } from "react";
import toast from "react-hot-toast";

import api from "../../services/api";

export default function TransactionTable({
    transactions,
    onDelete,
    onTransactionUpdated
}) {

    const [editingTransaction, setEditingTransaction] = useState(null);

    const [viewingTransaction, setViewingTransaction] = useState(null);

    const [loading, setLoading] = useState(false);


    // --------------------------------------------------
    // VIEW TRANSACTION DETAILS
    // --------------------------------------------------

    const handleView = async (id) => {

        try {

            setLoading(true);

            const response = await api.get(
                `/transactions/${id}`
            );

            setViewingTransaction(
                response.data
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load transaction"
            );

        } finally {

            setLoading(false);

        }

    };


    // --------------------------------------------------
    // EDIT TRANSACTION
    // --------------------------------------------------

    const handleEdit = (transaction) => {

        setEditingTransaction({
            ...transaction
        });

    };


    // --------------------------------------------------
    // UPDATE TRANSACTION
    // --------------------------------------------------

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.put(
                `/transactions/${editingTransaction.id}`,
                {
                    title: editingTransaction.title,
                    amount: Number(
                        editingTransaction.amount
                    ),
                    type: editingTransaction.type,
                    category: editingTransaction.category,
                    status: editingTransaction.status,
                    customer_id:
                        editingTransaction.customer_id,
                    payment_method:
                        editingTransaction.payment_method
                }
            );

            toast.success(
                "Transaction Updated Successfully!"
            );

            setEditingTransaction(null);

            if (onTransactionUpdated) {
                onTransactionUpdated();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update transaction"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <>

            {/* ================================================== */}
            {/* TRANSACTION TABLE */}
            {/* ================================================== */}

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-xl font-bold text-slate-800">
                        Transaction History
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        View and manage your transactions.
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Title
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Category
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Type
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Amount
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {transactions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-slate-500"
                                    >
                                        No transactions found.
                                    </td>

                                </tr>

                            ) : (

                                transactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction.id
                                            }
                                            className="hover:bg-slate-50 transition"
                                        >

                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {
                                                    transaction.title
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {
                                                    transaction.category
                                                }
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        transaction.type ===
                                                        "income"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {
                                                        transaction.type
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2
                                                    }
                                                )}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        transaction.status ===
                                                        "Success"
                                                            ? "bg-green-100 text-green-700"
                                                            : transaction.status ===
                                                              "Failed"
                                                            ? "bg-red-100 text-red-700"
                                                            : transaction.status ===
                                                              "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-purple-100 text-purple-700"
                                                    }`}
                                                >
                                                    {
                                                        transaction.status
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleView(
                                                                transaction.id
                                                            )
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                                                    >
                                                        View
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                transaction
                                                            )
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            onDelete(
                                                                transaction.id
                                                            )
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================================================== */}
            {/* VIEW DETAILS MODAL */}
            {/* ================================================== */}

            {viewingTransaction && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold text-slate-800">
                                Transaction Details
                            </h2>

                            <button
                                onClick={() =>
                                    setViewingTransaction(
                                        null
                                    )
                                }
                                className="text-slate-400 hover:text-slate-700 text-2xl"
                            >
                                ×
                            </button>

                        </div>


                        <div className="space-y-4">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Transaction ID
                                </p>

                                <p className="font-semibold">
                                    #{viewingTransaction.id}
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Title
                                </p>

                                <p className="font-semibold">
                                    {
                                        viewingTransaction.title
                                    }
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Amount
                                </p>

                                <p className="font-semibold text-lg">
                                    ₹
                                    {Number(
                                        viewingTransaction.amount
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Type
                                </p>

                                <p className="font-semibold">
                                    {
                                        viewingTransaction.type
                                    }
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Category
                                </p>

                                <p className="font-semibold">
                                    {
                                        viewingTransaction.category
                                    }
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Payment Method
                                </p>

                                <p className="font-semibold">
                                    {
                                        viewingTransaction.payment_method ||
                                        "Not specified"
                                    }
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Status
                                </p>

                                <p className="font-semibold">
                                    {
                                        viewingTransaction.status
                                    }
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-slate-500">
                                    Created At
                                </p>

                                <p className="font-semibold">
                                    {
                                        viewingTransaction.created_at
                                            ? new Date(
                                                  viewingTransaction.created_at
                                              ).toLocaleString()
                                            : "Not available"
                                    }
                                </p>
                            </div>

                        </div>


                        <button
                            onClick={() =>
                                setViewingTransaction(
                                    null
                                )
                            }
                            className="mt-6 w-full py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}


            {/* ================================================== */}
            {/* EDIT TRANSACTION MODAL */}
            {/* ================================================== */}

            {editingTransaction && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold text-slate-800">
                                Edit Transaction
                            </h2>

                            <button
                                onClick={() =>
                                    setEditingTransaction(
                                        null
                                    )
                                }
                                className="text-slate-400 hover:text-slate-700 text-2xl"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleUpdate}
                            className="space-y-4"
                        >

                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editingTransaction.title
                                    }
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            title: e.target.value
                                        })
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        editingTransaction.amount
                                    }
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            amount: e.target.value
                                        })
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Type
                                </label>

                                <select
                                    value={
                                        editingTransaction.type
                                    }
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            type: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                                >

                                    <option value="income">
                                        Income
                                    </option>

                                    <option value="expense">
                                        Expense
                                    </option>

                                </select>

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editingTransaction.category
                                    }
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            category: e.target.value
                                        })
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Payment Method
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editingTransaction.payment_method ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            payment_method:
                                                e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Status
                                </label>

                                <select
                                    value={
                                        editingTransaction.status
                                    }
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            status: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                                >

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


                            <div className="flex gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingTransaction(
                                            null
                                        )
                                    }
                                    className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Updating..."
                                        : "Update Transaction"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>

    );

}