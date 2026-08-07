import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCards from "../components/dashboard/SummaryCards";
import MonthlyChart from "../components/dashboard/MonthlyChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

export default function Dashboard() {

    const [summary, setSummary] = useState({
        balance: 0,
        total_income: 0,
        total_expense: 0,
        total_transactions: 0
    });

    const [monthlyData, setMonthlyData] = useState([]);

    const [recentTransactions, setRecentTransactions] = useState([]);

    const { user } = useAuth();

    useEffect(() => {

        const fetchSummary = async () => {
            try {
                const response = await api.get("/dashboard/summary");
                console.log("Summary:", response.data);
                setSummary(response.data);

                const monthly = await api.get("/dashboard/monthly-summary");
                console.log("Monthly:", monthly.data);
                setMonthlyData(monthly.data);

                const recent = await api.get("/dashboard/recent-transactions");

                setRecentTransactions(recent.data);

            } catch (error) {
                console.log("ERROR:", error);

                if (error.response) {
                    console.log("Status:", error.response.status);
                    console.log("Data:", error.response.data);
                }
            }
        };

        fetchSummary();

    }, []);

    console.log(monthlyData);

    return (

        <DashboardLayout>


            <SummaryCards
                balance={summary.balance}
                income={summary.total_income}
                expense={summary.total_expense}
                transactions={summary.total_transactions}
            />

            <MonthlyChart data={monthlyData} />

            <RecentTransactions
                transactions={recentTransactions}
            />

        </DashboardLayout>

    );
}