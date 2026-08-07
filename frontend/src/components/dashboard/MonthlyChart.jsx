import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

export default function MonthlyChart({ data }) {

    return (

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mt-8">

            <div className="mb-8">

                <h2 className="text-2xl font-bold text-slate-800">
                    Monthly Overview
                </h2>

                <p className="text-gray-500 mt-1">
                    Income vs Expenses by Month
                </p>

            </div>

            <ResponsiveContainer
                width="100%"
                height={380}
            >

                <BarChart
                    data={data}
                    barGap={10}
                    barCategoryGap="25%"
                >

                    <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#e5e7eb"
                    />

                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#64748b", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        tick={{ fill: "#64748b", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                            borderRadius: "14px",
                            border: "none",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
                        }}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{
                            paddingBottom: "20px"
                        }}
                    />

                    <Bar
                        dataKey="income"
                        fill="#2563eb"
                        radius={[10, 10, 0, 0]}
                    />

                    <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[10, 10, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}