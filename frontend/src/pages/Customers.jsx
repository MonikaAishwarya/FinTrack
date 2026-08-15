import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Customers() {

    const [customers, setCustomers] = useState([]);

    const [analytics, setAnalytics] = useState({
        total_customers: 0,
        new_customers: 0,
        active_customers: 0,
        top_customers: []
    });

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);

    const [form, setForm] = useState({
        customer_name: "",
        phone: "",
        email: ""
    });


    // --------------------------------------------------
    // FETCH CUSTOMERS
    // --------------------------------------------------

    const fetchCustomers = async () => {

        try {

            const response = await api.get("/customers/");

            setCustomers(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch customers"
            );

        }

    };


    // --------------------------------------------------
    // FETCH CUSTOMER ANALYTICS
    // --------------------------------------------------

    const fetchAnalytics = async () => {

        try {

            const response = await api.get(
                "/customers/analytics"
            );

            setAnalytics(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch customer analytics"
            );

        }

    };


    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchCustomers(),
                fetchAnalytics()
            ]);

            setLoading(false);

        };

        loadData();

    }, []);


    // --------------------------------------------------
    // FORM CHANGE
    // --------------------------------------------------

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // --------------------------------------------------
    // ADD CUSTOMER
    // --------------------------------------------------

    const handleAddCustomer = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/customers/",
                form
            );

            toast.success(
                "Customer Added Successfully!"
            );

            setForm({
                customer_name: "",
                phone: "",
                email: ""
            });

            setShowForm(false);

            await fetchCustomers();
            await fetchAnalytics();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to add customer"
            );

        }

    };


    // --------------------------------------------------
    // START EDIT
    // --------------------------------------------------

    const handleEdit = (customer) => {

        setEditingCustomer(customer);

        setForm({
            customer_name:
                customer.customer_name || "",
            phone:
                customer.phone || "",
            email:
                customer.email || ""
        });

        setShowForm(true);

    };


    // --------------------------------------------------
    // UPDATE CUSTOMER
    // --------------------------------------------------

    const handleUpdateCustomer = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                `/customers/${editingCustomer.id}`,
                form
            );

            toast.success(
                "Customer Updated Successfully!"
            );

            setEditingCustomer(null);

            setForm({
                customer_name: "",
                phone: "",
                email: ""
            });

            setShowForm(false);

            await fetchCustomers();
            await fetchAnalytics();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update customer"
            );

        }

    };


    // --------------------------------------------------
    // DELETE CUSTOMER
    // --------------------------------------------------

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/customers/${id}`
            );

            toast.success(
                "Customer Deleted Successfully!"
            );

            await fetchCustomers();
            await fetchAnalytics();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete customer"
            );

        }

    };


    // --------------------------------------------------
    // CANCEL FORM
    // --------------------------------------------------

    const handleCancel = () => {

        setShowForm(false);

        setEditingCustomer(null);

        setForm({
            customer_name: "",
            phone: "",
            email: ""
        });

    };


    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">
                            Customers
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage customers and monitor customer activity.
                        </p>

                    </div>

                    <button
                        onClick={() => {

                            setEditingCustomer(null);

                            setForm({
                                customer_name: "",
                                phone: "",
                                email: ""
                            });

                            setShowForm(true);

                        }}
                        className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        + Add Customer
                    </button>

                </div>


                {/* ==================================================
                    ANALYTICS CARDS
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Total Customers */}

                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Total Customers
                        </p>

                        <h2 className="text-3xl font-bold text-slate-800 mt-2">
                            {analytics.total_customers}
                        </h2>

                        <p className="text-sm text-slate-400 mt-2">
                            All registered customers
                        </p>

                    </div>


                    {/* New Customers */}

                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                        <p className="text-sm font-medium text-slate-500">
                            New Customers
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {analytics.new_customers}
                        </h2>

                        <p className="text-sm text-slate-400 mt-2">
                            Added this month
                        </p>

                    </div>


                    {/* Active Customers */}

                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Active Customers
                        </p>

                        <h2 className="text-3xl font-bold text-blue-600 mt-2">
                            {analytics.active_customers}
                        </h2>

                        <p className="text-sm text-slate-400 mt-2">
                            Customers with successful transactions
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    ADD / EDIT CUSTOMER FORM
                ================================================== */}

                {showForm && (

                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h2 className="text-xl font-bold text-slate-800">

                                    {editingCustomer
                                        ? "Edit Customer"
                                        : "Add Customer"}

                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Enter customer information below.
                                </p>

                            </div>

                            <button
                                onClick={handleCancel}
                                className="text-2xl text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                editingCustomer
                                    ? handleUpdateCustomer
                                    : handleAddCustomer
                            }
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >

                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    name="customer_name"
                                    value={
                                        form.customer_name
                                    }
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter customer name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        form.phone
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        form.email
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            <div className="md:col-span-3 flex gap-3 pt-2">

                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                >
                                    {editingCustomer
                                        ? "Update Customer"
                                        : "Add Customer"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* ==================================================
                    TOP CUSTOMERS
                ================================================== */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

                    <div className="p-6 border-b border-slate-200">

                        <h2 className="text-xl font-bold text-slate-800">
                            Top Customers
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Customers ranked by successful transaction value.
                        </p>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Rank
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Total Transaction Value
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {analytics.top_customers.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="px-6 py-10 text-center text-slate-500"
                                        >
                                            No customer transaction data available.
                                        </td>

                                    </tr>

                                ) : (

                                    analytics.top_customers.map(
                                        (customer, index) => (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                                className="hover:bg-slate-50 transition"
                                            >

                                                <td className="px-6 py-4 font-semibold text-slate-700">
                                                    #{index + 1}
                                                </td>

                                                <td className="px-6 py-4 font-medium text-slate-800">
                                                    {
                                                        customer.customer_name
                                                    }
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-green-600">

                                                    ₹
                                                    {Number(
                                                        customer.total_amount
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* ==================================================
                    CUSTOMER LIST
                ================================================== */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

                    <div className="p-6 border-b border-slate-200">

                        <h2 className="text-xl font-bold text-slate-800">
                            Customer List
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            View and manage all your customers.
                        </p>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center text-slate-500">
                            Loading customers...
                        </div>

                    ) : customers.length === 0 ? (

                        <div className="p-10 text-center text-slate-500">
                            No customers found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            ID
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Phone
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Created At
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {customers.map(
                                        (customer) => (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                                className="hover:bg-slate-50 transition"
                                            >

                                                <td className="px-6 py-4 text-slate-600">
                                                    #{customer.id}
                                                </td>

                                                <td className="px-6 py-4 font-medium text-slate-800">
                                                    {
                                                        customer.customer_name
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-slate-600">
                                                    {
                                                        customer.phone ||
                                                        "Not provided"
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-slate-600">
                                                    {
                                                        customer.email ||
                                                        "Not provided"
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-slate-600">
                                                    {customer.created_at
                                                        ? new Date(
                                                              customer.created_at
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    customer
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    customer.id
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>

    );

}