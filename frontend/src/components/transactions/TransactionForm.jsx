import { useState } from "react";

export default function TransactionForm({ onTransactionAdded }) {

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("income");

    const handleSubmit = (e) => {

        e.preventDefault();

        onTransactionAdded({
            title,
            amount: Number(amount),
            category,
            type
        });

        setTitle("");
        setAmount("");
        setCategory("");
        setType("income");

    };

    return (

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">

            <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Add Transaction
            </h2>

            <p className="text-gray-500 text-sm mb-8">
                Record your income or expenses.
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        placeholder="Coffee, Salary..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Amount
                    </label>

                    <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Category
                    </label>

                    <input
                        type="text"
                        placeholder="Food, Bills..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                </div>

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="income">
                            Income
                        </option>

                        <option value="expense">
                            Expense
                        </option>

                    </select>

                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                >
                    + Add Transaction
                </button>

            </form>

        </div>

    );

}