import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../services/api";

export default function TransactionForm({ onTransactionAdded }) {

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("income");
    const [status, setStatus] = useState("Success");

    // Customer
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");

    const [loadingCustomers, setLoadingCustomers] = useState(true);


    // --------------------------------------------------
    // FETCH CUSTOMERS
    // --------------------------------------------------

    useEffect(() => {

        const fetchCustomers = async () => {

            try {

                setLoadingCustomers(true);

                const response = await api.get(
                    "/customers/"
                );

                setCustomers(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch customers:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load customers"
                );

            } finally {

                setLoadingCustomers(false);

            }

        };

        fetchCustomers();

    }, []);


    // --------------------------------------------------
    // HANDLE SUBMIT
    // --------------------------------------------------

    const handleSubmit = (e) => {

        e.preventDefault();

        // Customer is optional because your backend
        // currently allows customer_id to be null.

        const transactionData = {

            title,

            amount: Number(amount),

            category,

            type,

            status,

            customer_id: customerId
                ? Number(customerId)
                : null

        };

        onTransactionAdded(
            transactionData
        );

        // Reset form

        setTitle("");
        setAmount("");
        setCategory("");
        setType("income");
        setStatus("Success");
        setCustomerId("");

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


                {/* ------------------------------------------------ */}
                {/* TITLE */}
                {/* ------------------------------------------------ */}

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        placeholder="Coffee, Salary..."
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                </div>


                {/* ------------------------------------------------ */}
                {/* AMOUNT */}
                {/* ------------------------------------------------ */}

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Amount
                    </label>

                    <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        required
                        min="0"
                        step="0.01"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                </div>


                {/* ------------------------------------------------ */}
                {/* CATEGORY */}
                {/* ------------------------------------------------ */}

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Category
                    </label>

                    <input
                        type="text"
                        placeholder="Food, Bills..."
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                </div>


                {/* ------------------------------------------------ */}
                {/* TYPE */}
                {/* ------------------------------------------------ */}

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
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


                {/* ------------------------------------------------ */}
                {/* CUSTOMER */}
                {/* ------------------------------------------------ */}

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Customer
                    </label>

                    <select
                        value={customerId}
                        onChange={(e) =>
                            setCustomerId(e.target.value)
                        }
                        disabled={loadingCustomers}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-100"
                    >

                        <option value="">
                            {loadingCustomers
                                ? "Loading customers..."
                                : customers.length === 0
                                    ? "No customers available"
                                    : "Select Customer (Optional)"
                            }
                        </option>


                        {customers.map((customer) => (

                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.customer_name}
                            </option>

                        ))}

                    </select>


                    {!loadingCustomers &&
                        customers.length === 0 && (

                            <p className="text-xs text-slate-500 mt-2">
                                Add a customer from the Customers page
                                to link this transaction.
                            </p>

                        )
                    }

                </div>


                {/* ------------------------------------------------ */}
                {/* STATUS */}
                {/* ------------------------------------------------ */}

                <div>

                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
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


                {/* ------------------------------------------------ */}
                {/* SUBMIT */}
                {/* ------------------------------------------------ */}

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