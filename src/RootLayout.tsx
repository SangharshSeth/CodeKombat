import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";
import {Footer} from "@/components/Footer.tsx";

export const RootLayout = () => {
    return <>
        <TopNavBar />
        <Outlet />
        <Footer />
    </>
}