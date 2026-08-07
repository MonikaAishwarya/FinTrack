import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import api from "../services/api";

import DashboardLayout from "../layouts/DashboardLayout";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionTable from "../components/transactions/TransactionTable";

export default function Transactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        fetchTransactions();

    }, []);

    const fetchTransactions = async () => {

        try {

            const response = await api.get("/transactions/");

            setTransactions(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const addTransaction = async (transaction) => {

        try {

            await api.post("/transactions/", transaction);

            toast.success("Transaction Added Successfully!");

            fetchTransactions();

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Failed to add transaction"
            );

        }

    };

    const deleteTransaction = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/transactions/${id}`);

            toast.success("Transaction Deleted!");

            fetchTransactions();

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Delete Failed"
            );

        }

    };

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <div>

                    <h1 className="text-4xl font-bold text-slate-800">
                        Transactions
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track and manage your income and expenses.
                    </p>

                </div>

                <div className="space-y-20">

                    <TransactionForm
                        onTransactionAdded={addTransaction}
                    />

                    <TransactionTable
                        transactions={transactions}
                        onDelete={deleteTransaction}
                    />

                </div>

            </div>

        </DashboardLayout>

    );

}