export default function TransactionTable({ transactions, onDelete }) {

    if (transactions.length === 0) {

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

                                <td className="px-6 py-5 font-medium text-slate-800">
                                    {transaction.title}
                                </td>

                                <td className="px-6 py-5">

                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700">

                                        {transaction.category}

                                    </span>

                                </td>

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

                                <td
                                    className={`px-6 py-5 text-right font-bold text-lg ${
                                        transaction.type === "income"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >

                                    {transaction.type === "income" ? "+" : "-"}

                                    ₹{Number(transaction.amount).toLocaleString()}

                                </td>

                                <td className="px-6 py-5 text-center">

                                    <button
                                        onClick={() => onDelete(transaction.id)}
                                        className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl transition font-medium"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}