import {TopNavBar} from "@/components/TopNav.tsx";
import {Outlet} from "react-router-dom";

export const DashBoardLayout = () => {
    return <>
        <TopNavBar />
        <Outlet />
    </>
}