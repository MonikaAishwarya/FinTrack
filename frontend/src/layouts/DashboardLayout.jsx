import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function DashboardLayout({ children }) {

    return (

        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="flex-1 p-8">

                <Header />

                <main className="mt-8">

                    {children}

                </main>

            </div>

        </div>

    );

}