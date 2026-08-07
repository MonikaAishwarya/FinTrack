import Card from "../ui/Card";

export default function RecentTransactions({ transactions }) {

    return (

        <Card>

            <h2 className="text-2xl font-bold mb-6">
                Recent Transactions
            </h2>

            {

                transactions.length === 0 ?

                (

                    <div className="text-center text-gray-400 py-10">

                        No recent transactions.

                    </div>

                )

                :

                (

                    <table className="w-full">

                        <thead>

                            <tr className="text-left text-gray-500 border-b">

                                <th className="py-4">Title</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th className="text-right">Amount</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                transactions.map((t) => (

                                    <tr
                                        key={t.id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >

                                        <td className="py-5 font-medium">

                                            {t.title}

                                        </td>

                                        <td>

                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-sm">

                                                {t.category}

                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    t.type === "income"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >

                                                {t.type}

                                            </span>

                                        </td>

                                        <td
                                            className={`text-right font-bold ${
                                                t.type === "income"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >

                                            ₹{t.amount.toLocaleString()}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </Card>

    );

}