import MatchSetupScreen from "./PreMatch"
import {TopNavBar} from "@/components/TopNav.tsx";

export const DashboardPage = () => {
    return <>
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
        <TopNavBar />
        <MatchSetupScreen />
    </div>
    </>
}