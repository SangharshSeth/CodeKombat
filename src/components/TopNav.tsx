
import {Link} from "react-router-dom";

export const TopNavBar = () => {
    return <div className="bg-gray-900 text-white border-b border-gray-800 shadow-md">
        <nav
            className="container mx-auto px-6 py-3 flex justify-between items-center  text-white">
            <div className="flex items-center space-x-3">
                <Link to='/'>
                    <div className="relative group">
                        <div className="text-xl font-bold relative z-10 overflow-hidden">
                            <span className="relative inline-block px-4 py-2">
                                <span className="font-mono text-gray-100">C</span>
                                <span className="font-mono text-blue-400 tracking-wider">0</span>
                                <span className="font-mono text-gray-100">de</span>
                                <span className="ml-1 font-sans bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                    Kombat
                                </span>

                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg -z-10" />

                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </nav>

    </div>
}
