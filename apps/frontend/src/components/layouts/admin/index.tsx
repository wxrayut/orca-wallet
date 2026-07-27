import { UserProfile } from "~/components/UserProfile";
import { SidebarProvider } from "~/components/ui/sidebar";

import Header from "./components/Header";
import Search from "./components/Search";
import Sidebar from "./components/Sidebar";

export function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div className="flex w-full">
                <Sidebar />

                <main className="h-screen flex-1 overflow-y-auto">
                    <Header>
                        <div className="container flex items-center justify-between gap-4">
                            <Search />
                            <UserProfile />
                        </div>
                    </Header>

                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
