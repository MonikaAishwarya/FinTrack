import { useEffect, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

import TransactionHeatmap from "../components/analytics/TransactionHeatmap";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";


// ==========================================================
// REGISTER CHART.JS COMPONENTS
// ==========================================================

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);


// ==========================================================
// COMMON CHART OPTIONS
// ==========================================================

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: true,
            position: "bottom",

            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12
                }
            }
        },

        tooltip: {
            enabled: true,

            backgroundColor: "rgba(15, 23, 42, 0.95)",

            titleColor: "#ffffff",
            bodyColor: "#ffffff",

            padding: 12,

            cornerRadius: 10,

            displayColors: true
        }
    },

    scales: {
        x: {
            grid: {
                display: false
            },

            ticks: {
                color: "#64748b"
            }
        },

        y: {
            beginAtZero: true,

            grid: {
                color: "rgba(148, 163, 184, 0.15)"
            },

            ticks: {
                color: "#64748b"
            }
        }
    }
};


// ==========================================================
// COMPONENT
// ==========================================================

export default function Analytics() {

    const [revenueTrend, setRevenueTrend] = useState([]);

    const [dailyTransactions, setDailyTransactions] = useState([]);

    const [monthlyTransactions, setMonthlyTransactions] = useState([]);

    const [expenseAnalysis, setExpenseAnalysis] = useState([]);

    const [customerGrowth, setCustomerGrowth] = useState([]);

    const [paymentMethods, setPaymentMethods] = useState([]);


    // ======================================================
    // FETCH ANALYTICS DATA
    // ======================================================

    useEffect(() => {

        const loadAnalytics = async () => {

            try {

                const [
                    revenueResponse,
                    dailyResponse,
                    monthlyResponse,
                    expenseResponse,
                    customerGrowthResponse,
                    paymentMethodResponse
                ] = await Promise.all([

                    api.get("/analytics/revenue-trend"),

                    api.get("/analytics/daily-transactions"),

                    api.get("/analytics/monthly-transactions"),

                    api.get("/analytics/expense-analysis"),

                    api.get("/analytics/customer-growth"),

                    api.get(
                        "/analytics/payment-method-distribution"
                    )

                ]);


                setRevenueTrend(
                    revenueResponse.data
                );

                setDailyTransactions(
                    dailyResponse.data
                );

                setMonthlyTransactions(
                    monthlyResponse.data
                );

                setExpenseAnalysis(
                    expenseResponse.data
                );

                setCustomerGrowth(
                    customerGrowthResponse.data
                );

                setPaymentMethods(
                    paymentMethodResponse.data
                );

            } catch (error) {

                console.error(
                    "Failed to load analytics:",
                    error
                );

            }

        };


        loadAnalytics();

    }, []);


    // ======================================================
    // REVENUE TREND CHART
    // ======================================================

    const revenueChartData = {

        labels: revenueTrend.map(
            item => item.date
        ),

        datasets: [

            {
                label: "Income",

                data: revenueTrend.map(
                    item => item.income || 0
                ),

                borderColor: "#2563eb",

                backgroundColor:
                    "rgba(37, 99, 235, 0.15)",

                pointBackgroundColor: "#2563eb",

                pointBorderColor: "#ffffff",

                pointBorderWidth: 2,

                pointRadius: 4,

                pointHoverRadius: 6,

                borderWidth: 3,

                tension: 0.4,

                fill: true
            },

            {
                label: "Expense",

                data: revenueTrend.map(
                    item => item.expense || 0
                ),

                borderColor: "#ef4444",

                backgroundColor:
                    "rgba(239, 68, 68, 0.10)",

                pointBackgroundColor: "#ef4444",

                pointBorderColor: "#ffffff",

                pointBorderWidth: 2,

                pointRadius: 4,

                pointHoverRadius: 6,

                borderWidth: 3,

                tension: 0.4,

                fill: true
            }

        ]

    };


    // ======================================================
    // DAILY TRANSACTIONS CHART
    // ======================================================

    const dailyTransactionsChartData = {

        labels: dailyTransactions.map(
            item => item.date
        ),

        datasets: [

            {
                label: "Transactions",

                data: dailyTransactions.map(
                    item => item.count
                ),

                backgroundColor:
                    "rgba(16, 185, 129, 0.75)",

                borderColor: "#10b981",

                borderWidth: 1,

                borderRadius: 8,

                hoverBackgroundColor: "#059669"
            }

        ]

    };


    // ======================================================
    // MONTHLY TRANSACTIONS CHART
    // ======================================================

    const monthlyTransactionsChartData = {

        labels: monthlyTransactions.map(
            item => item.label
        ),

        datasets: [

            {
                label: "Transactions",

                data: monthlyTransactions.map(
                    item => item.count
                ),

                backgroundColor:
                    "rgba(139, 92, 246, 0.75)",

                borderColor: "#8b5cf6",

                borderWidth: 1,

                borderRadius: 8,

                hoverBackgroundColor: "#7c3aed"
            }

        ]

    };


    // ======================================================
    // EXPENSE ANALYSIS CHART
    // ======================================================

    const expenseChartData = {

        labels: expenseAnalysis.map(
            item => item.category
        ),

        datasets: [

            {
                label: "Expenses",

                data: expenseAnalysis.map(
                    item => item.amount
                ),

                backgroundColor: [

                    "#ef4444",

                    "#f97316",

                    "#eab308",

                    "#22c55e",

                    "#06b6d4",

                    "#3b82f6",

                    "#8b5cf6",

                    "#ec4899"

                ],

                borderColor: "#ffffff",

                borderWidth: 2,

                hoverOffset: 8

            }

        ]

    };


    // ======================================================
    // CUSTOMER GROWTH CHART
    // ======================================================

    const customerGrowthChartData = {

        labels: customerGrowth.map(
            item => item.label
        ),

        datasets: [

            {
                label: "New Customers",

                data: customerGrowth.map(
                    item => item.count
                ),

                backgroundColor:
                    "rgba(14, 165, 233, 0.75)",

                borderColor: "#0ea5e9",

                borderWidth: 1,

                borderRadius: 8,

                hoverBackgroundColor: "#0284c7"
            }

        ]

    };


    // ======================================================
    // PAYMENT METHOD CHART
    // ======================================================

    const paymentMethodChartData = {

        labels: paymentMethods.map(
            item => item.payment_method
        ),

        datasets: [

            {
                label: "Transactions",

                data: paymentMethods.map(
                    item => item.count
                ),

                backgroundColor: [

                    "#2563eb",

                    "#10b981",

                    "#f59e0b",

                    "#ef4444",

                    "#8b5cf6",

                    "#06b6d4",

                    "#ec4899",

                    "#64748b"

                ],

                borderColor: "#ffffff",

                borderWidth: 2,

                hoverOffset: 8

            }

        ]

    };


    // ======================================================
    // CHART OPTIONS
    // ======================================================

    const lineOptions = {

        ...commonOptions,

        interaction: {
            mode: "index",
            intersect: false
        },

        scales: {

            ...commonOptions.scales,

            y: {
                ...commonOptions.scales.y,

                beginAtZero: true,

                ticks: {
                    color: "#64748b"
                }
            }

        }

    };


    const barOptions = {

        ...commonOptions,

        plugins: {

            ...commonOptions.plugins,

            legend: {
                ...commonOptions.plugins.legend,

                display: false
            }

        }

    };


    const doughnutOptions = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "65%",

        plugins: {

            legend: {
                display: true,
                position: "bottom",

                labels: {
                    usePointStyle: true,
                    padding: 18,

                    font: {
                        size: 12
                    }
                }
            },

            tooltip: {

                enabled: true,

                backgroundColor:
                    "rgba(15, 23, 42, 0.95)",

                titleColor: "#ffffff",

                bodyColor: "#ffffff",

                padding: 12,

                cornerRadius: 10
            }

        }

    };


    // ======================================================
    // CHART CARD
    // ======================================================

    const ChartCard = ({
        title,
        description,
        children
    }) => {

        return (

            <div className="
                bg-white
                rounded-3xl
                shadow-lg
                border
                border-slate-200
                p-6
            ">

                <div className="mb-5">

                    <h2 className="
                        text-xl
                        font-bold
                        text-slate-800
                    ">
                        {title}
                    </h2>

                    {description && (

                        <p className="
                            text-sm
                            text-slate-500
                            mt-1
                        ">
                            {description}
                        </p>

                    )}

                </div>


                <div className="h-[320px]">

                    {children}

                </div>

            </div>

        );

    };


    // ======================================================
    // RETURN UI
    // ======================================================

    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div>

                    <h1 className="
                        text-4xl
                        font-bold
                        text-slate-800
                    ">
                        Financial Analytics
                    </h1>

                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        Analyze financial performance,
                        transactions, customers and
                        payment methods.
                    </p>

                </div>


                {/* ================================================== */}
                {/* REVENUE TREND */}
                {/* ================================================== */}

                <ChartCard
                    title="Revenue Trend"
                    description="Income and expense movement over time."
                >

                    {revenueTrend.length > 0 ? (

                        <Line
                            data={revenueChartData}
                            options={lineOptions}
                        />

                    ) : (

                        <div className="
                            h-full
                            flex
                            items-center
                            justify-center
                            text-slate-400
                        ">
                            No revenue data available.
                        </div>

                    )}

                </ChartCard>


                {/* ================================================== */}
                {/* DAILY + MONTHLY TRANSACTIONS */}
                {/* ================================================== */}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                ">

                    <ChartCard
                        title="Daily Transactions"
                        description="Number of transactions recorded each day."
                    >

                        {dailyTransactions.length > 0 ? (

                            <Bar
                                data={dailyTransactionsChartData}
                                options={barOptions}
                            />

                        ) : (

                            <div className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-slate-400
                            ">
                                No transaction data available.
                            </div>

                        )}

                    </ChartCard>


                    <ChartCard
                        title="Monthly Transactions"
                        description="Transaction volume by month."
                    >

                        {monthlyTransactions.length > 0 ? (

                            <Bar
                                data={monthlyTransactionsChartData}
                                options={barOptions}
                            />

                        ) : (

                            <div className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-slate-400
                            ">
                                No monthly data available.
                            </div>

                        )}

                    </ChartCard>

                </div>


                {/* ================================================== */}
                {/* EXPENSE + PAYMENT METHOD */}
                {/* ================================================== */}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                ">

                    <ChartCard
                        title="Expense Analysis"
                        description="Distribution of expenses across categories."
                    >

                        {expenseAnalysis.length > 0 ? (

                            <Doughnut
                                data={expenseChartData}
                                options={doughnutOptions}
                            />

                        ) : (

                            <div className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-slate-400
                            ">
                                No expense data available.
                            </div>

                        )}

                    </ChartCard>


                    <ChartCard
                        title="Payment Method Distribution"
                        description="Successful transactions by payment method."
                    >

                        {paymentMethods.length > 0 ? (

                            <Doughnut
                                data={paymentMethodChartData}
                                options={doughnutOptions}
                            />

                        ) : (

                            <div className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-slate-400
                            ">
                                No payment method data available.
                            </div>

                        )}

                    </ChartCard>

                </div>


                {/* ================================================== */}
                {/* CUSTOMER GROWTH */}
                {/* ================================================== */}

                <ChartCard
                    title="Customer Growth"
                    description="New customers registered over time."
                >

                    {customerGrowth.length > 0 ? (

                        <Bar
                            data={customerGrowthChartData}
                            options={barOptions}
                        />

                    ) : (

                        <div className="
                            h-full
                            flex
                            items-center
                            justify-center
                            text-slate-400
                        ">
                            No customer growth data available.
                        </div>

                    )}

                </ChartCard>


                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                    <h2 className="text-xl font-bold text-slate-800">
                        Transaction Activity
                    </h2>

                    <p className="text-sm text-slate-500 mt-1 mb-6">
                        Daily transaction activity over time.
                    </p>

                    <TransactionHeatmap
                        data={dailyTransactions}
                    />

                </div>

            </div>

        </DashboardLayout>

    );

}