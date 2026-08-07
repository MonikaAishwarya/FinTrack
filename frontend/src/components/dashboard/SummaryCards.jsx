import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Receipt
} from "lucide-react";

export default function SummaryCards({
    balance,
    income,
    expense,
    transactions
}) {

    const cards = [
        {
            title: "Total Balance",
            value: `₹${balance.toLocaleString()}`,
            icon: Wallet,
            bg: "bg-blue-100",
            color: "text-blue-600"
        },
        {
            title: "Income",
            value: `₹${income.toLocaleString()}`,
            icon: TrendingUp,
            bg: "bg-green-100",
            color: "text-green-600"
        },
        {
            title: "Expenses",
            value: `₹${expense.toLocaleString()}`,
            icon: TrendingDown,
            bg: "bg-red-100",
            color: "text-red-600"
        },
        {
            title: "Transactions",
            value: transactions,
            icon: Receipt,
            bg: "bg-purple-100",
            color: "text-purple-600"
        }
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    {card.title}
                                </p>

                                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                                    {card.value}
                                </h2>

                            </div>

                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}
                            >

                                <Icon
                                    size={28}
                                    className={card.color}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}