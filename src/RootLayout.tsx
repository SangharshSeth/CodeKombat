import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";
import {Footer} from "@/components/Footer.tsx";

export const RootLayout = () => {
    return <div className="font-Inter">
        <TopNavBar />
        <Outlet />
        <Footer />
    </div>
}