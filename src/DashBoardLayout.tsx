import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";

export const DashBoardLayout = () => {
    return <>
        <TopNavBar />
        <Outlet />
        <footer className="bg-gray-900">
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-8">
                    <p className="text-center text-gray-400 text-sm">
                        © 2024 CodeKombat. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    </>
}