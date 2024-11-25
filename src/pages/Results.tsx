import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

 const Results: React.FC<object> = () => {
    const location = useLocation();
    const submittedCode = location.state?.submittedCode || "";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-950 p-4"
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Results</h1>
                
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl text-white mb-4">Submitted Code</h2>
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-auto">
                        <code className="text-gray-100">
                            {submittedCode}
                        </code>
                    </pre>
                </div>
                
                {/* Add more result details as needed */}
            </div>
        </motion.div>
    );
};
 export default Results;