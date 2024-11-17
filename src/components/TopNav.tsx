import { SquareTerminalIcon} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export const TopNavBar = () => {
    return <div className="bg-gray-900 text-white border-b border-gray-800 shadow-md">
        <nav
            className="container mx-auto px-6 py-4 flex justify-between items-center  text-white">
            <div className="flex items-center space-x-2">
                <SquareTerminalIcon className="w-8 h-8 text-blue-400"/>
                <Link to='/'><span className="text-xl font-bold" style={{fontFamily: "SF Mono"}}>C0d3Kombat</span></Link>
            </div>
            <div className="flex items-center space-x-6">
                <Link
                    to="#"
                    className="hover:text-blue-400 transition-colors"
                >
                    How It Works
                </Link>
                <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                    Get Started
                </Button>
            </div>
        </nav>

    </div>
}
