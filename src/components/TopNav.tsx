import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/AuthSupabase.ts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut as LogOutIcon 
} from 'lucide-react';

export const TopNavBar: React.FC<object> = () => {
    const { session, signOut, signInWithGithub } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const userAvatar = session?.user?.user_metadata?.avatar_url;

    return (
        <div className="bg-gray-900 text-white border-b border-gray-800 shadow-md">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center text-white">
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
                <div className="ml-auto relative">
                    {session ? (
                        <div className="relative">
                            <motion.img
                                src={userAvatar}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                whileTap={{ scale: 0.95 }}
                            />
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
                                    >
                                        <div className="py-1">
                                            <button 
                                                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 space-x-2"
                                                onClick={() => {
                                                    // Navigate to account settings
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <UserIcon size={16} />
                                                <span>Profile</span>
                                            </button>
                                            <button 
                                                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 space-x-2"
                                                onClick={() => {
                                                    // Navigate to account settings
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <SettingsIcon size={16} />
                                                <span>Account Settings</span>
                                            </button>
                                            <button 
                                                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 space-x-2 text-red-400"
                                                onClick={() => {
                                                    signOut();
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <LogOutIcon size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={signInWithGithub}
                        >
                            Sign In
                        </motion.button>
                    )}
                </div>
            </nav>
        </div>
    );
}