import { useState } from "react";

import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function DashboardLayout({ children }) {

    const [collapsed, setCollapsed] = useState(false);

    return (

        <div className="bg-slate-100 min-h-screen">

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`
                    fixed
                    top-0
                    right-0
                    h-screen
                    overflow-y-auto
                    transition-all
                    duration-300
                    ${collapsed ? "left-20" : "left-64"}
                `}
            >

                <div className="p-8">

                    <Header />

                    <main className="mt-8">

                        {children}

                    </main>

                </div>

            </div>

        </div>

    );

}