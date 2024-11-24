import { motion } from "framer-motion";
import { Swords, Trophy, Target, Flame, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IMatchData } from "@/pages/PreMatch.tsx";

interface MatchFoundScreenProps {
  matchData: IMatchData | undefined;
  onCancel: () => void;
}

const MatchFoundScreen = ({ matchData, onCancel }: MatchFoundScreenProps) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(30);  // Start the timer at 10 seconds

  useEffect(() => {
    if (timer === 0) {
      handleStartMatch();
      return; // Stop the effect when timer reaches 0
    }

    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [timer]);

  const handleStartMatch = () => {
    console.log("Match Found Data", matchData);
    navigate("/app/start-match", {
      state: { matchData },
    });
  };

  return (
    <motion.div
      key="match-found"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center w-full"
    >
      <div className="h-screen px-4">
        <motion.div
          className=""
          animate={{
            background: [
              "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 60%)",
              "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Battle Found!
          </h2>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-yellow-400 mt-1"
          >
            <Trophy className="w-5 h-5 mx-auto" />
          </motion.div>
        </motion.div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1.1, 1.2, 1.1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5"
              >
                <Target className="w-3 h-3 text-white" />
              </motion.div>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-blue-400">You</h3>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <Swords className="w-6 h-6 text-red-400" />
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-lg font-bold text-red-400">
              VS
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1.1, 1.2, 1.1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1.5"
              >
                <Target className="w-3 h-3 text-white" />
              </motion.div>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-purple-400">
              {matchData?.opponentName || "Opponent"}
            </h3>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-700/30 p-3 rounded-lg"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            </motion.div>
            <div className="text-xs text-gray-400">Difficulty</div>
            <div className="text-sm font-semibold text-orange-400">
              {matchData?.difficulty}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-700/30 p-3 rounded-lg"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            </motion.div>
            <div className="text-xs text-gray-400">Category</div>
            <div className="text-sm font-semibold text-blue-400">
              {matchData?.category}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-gray-700"
        >
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {timer}
          </span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-700/30 hover:bg-gray-600/30 rounded-lg transition-colors text-gray-300 text-sm"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MatchFoundScreen;