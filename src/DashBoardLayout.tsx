import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";
// @ts-expect-error: some error
import '@fontsource-variable/inter';

export const DashBoardLayout = () => {
    return <div style={{fontFamily: "Inter Variable"}}>
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
    </div>
}