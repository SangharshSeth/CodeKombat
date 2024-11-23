import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface TimeUpModalProps {
    code: string;
}

export const TimeUpModal = ({ code }: TimeUpModalProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-800"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">Time's Up!</h2>
                    <p className="text-gray-400 mb-6">Your code has been automatically submitted.</p>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => navigate('/app/results', { state: { submittedCode: code } })}
                        >
                            View Results
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}; 