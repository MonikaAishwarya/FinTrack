import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function TransactionTable({ transactions, onDelete }) {

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const getStatusStyle = (status) => {

        switch (status) {

            case "Success":
                return "bg-green-100 text-green-700";

            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            case "Failed":
                return "bg-red-100 text-red-700";

            case "Refunded":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-slate-100 text-slate-700";

        }

    };


    const viewDetails = async (id) => {

        try {

            setLoadingDetails(true);

            const response = await api.get(
                `/transactions/${id}`
            );

            setSelectedTransaction(response.data);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load transaction details"
            );

        } finally {

            setLoadingDetails(false);

        }

    };


    const closeDetails = () => {

        setSelectedTransaction(null);

    };


    if (!transactions || transactions.length === 0) {

        return (

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 text-center">

                <h2 className="text-2xl font-bold text-slate-800">
                    Transactions
                </h2>

                <p className="text-gray-500 mt-4">
                    No transactions available.
                </p>

            </div>

        );

    }


    return (

        <>

            {/* Transaction Table */}

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

                <div className="px-8 py-6 border-b">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Transaction History
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Your recent income and expenses
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                    Title
                                </th>

                                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                    Category
                                </th>

                                <th className="text-center px-6 py-4 font-semibold text-slate-600">
                                    Type
                                </th>

                                <th className="text-center px-6 py-4 font-semibold text-slate-600">
                                    Status
                                </th>

                                <th className="text-right px-6 py-4 font-semibold text-slate-600">
                                    Amount
                                </th>

                                <th className="text-center px-6 py-4 font-semibold text-slate-600">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {transactions.map((transaction) => (

                                <tr
                                    key={transaction.id}
                                    className="border-b last:border-none hover:bg-slate-50 transition"
                                >

                                    {/* Title */}

                                    <td className="px-6 py-5 font-medium text-slate-800">
                                        {transaction.title}
                                    </td>


                                    {/* Category */}

                                    <td className="px-6 py-5">

                                        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700">
                                            {transaction.category}
                                        </span>

                                    </td>


                                    {/* Type */}

                                    <td className="px-6 py-5 text-center">

                                        {transaction.type === "income" ? (

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                Income
                                            </span>

                                        ) : (

                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                Expense
                                            </span>

                                        )}

                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-5 text-center">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                                                transaction.status
                                            )}`}
                                        >
                                            {transaction.status || "Success"}
                                        </span>

                                    </td>


                                    {/* Amount */}

                                    <td
                                        className={`px-6 py-5 text-right font-bold text-lg ${
                                            transaction.type === "income"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >

                                        {transaction.type === "income"
                                            ? "+"
                                            : "-"}

                                        ₹
                                        {Number(
                                            transaction.amount
                                        ).toLocaleString()}

                                    </td>


                                    {/* Actions */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                onClick={() =>
                                                    viewDetails(
                                                        transaction.id
                                                    )
                                                }
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl transition font-medium"
                                            >
                                                View
                                            </button>


                                            <button
                                                onClick={() =>
                                                    onDelete(
                                                        transaction.id
                                                    )
                                                }
                                                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl transition font-medium"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Transaction Details Modal */}

            {selectedTransaction && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl">

                        {/* Modal Header */}

                        <div className="flex items-center justify-between px-8 py-6 border-b">

                            <div>

                                <h2 className="text-2xl font-bold text-slate-800">
                                    Transaction Details
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Transaction #{selectedTransaction.id}
                                </p>

                            </div>


                            <button
                                onClick={closeDetails}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xl transition"
                            >
                                ×
                            </button>

                        </div>


                        {/* Details */}

                        <div className="p-8 space-y-5">

                            <div className="flex justify-between items-center">

                                <span className="text-gray-500">
                                    Title
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {selectedTransaction.title}
                                </span>

                            </div>


                            <div className="flex justify-between items-center">

                                <span className="text-gray-500">
                                    Amount
                                </span>

                                <span
                                    className={`font-bold text-xl ${
                                        selectedTransaction.type === "income"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >

                                    {selectedTransaction.type === "income"
                                        ? "+"
                                        : "-"}

                                    ₹
                                    {Number(
                                        selectedTransaction.amount
                                    ).toLocaleString()}

                                </span>

                            </div>


                            <div className="flex justify-between items-center">

                                <span className="text-gray-500">
                                    Category
                                </span>

                                <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-700">
                                    {selectedTransaction.category}
                                </span>

                            </div>


                            <div className="flex justify-between items-center">

                                <span className="text-gray-500">
                                    Type
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        selectedTransaction.type === "income"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {selectedTransaction.type === "income"
                                        ? "Income"
                                        : "Expense"}
                                </span>

                            </div>


                            <div className="flex justify-between items-center">

                                <span className="text-gray-500">
                                    Status
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                                        selectedTransaction.status
                                    )}`}
                                >
                                    {selectedTransaction.status || "Success"}
                                </span>

                            </div>


                            <div className="flex justify-between items-center">

                                <span className="text-gray-500">
                                    Date
                                </span>

                                <span className="font-medium text-slate-700">
                                    {selectedTransaction.created_at
                                        ? new Date(
                                              selectedTransaction.created_at
                                          ).toLocaleString("en-IN")
                                        : "N/A"}
                                </span>

                            </div>

                        </div>


                        {/* Footer */}

                        <div className="px-8 py-5 border-t flex justify-end">

                            <button
                                onClick={closeDetails}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {loadingDetails && (

                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30">

                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg">
                        Loading transaction details...
                    </div>

                </div>

            )}

        </>

    );

}