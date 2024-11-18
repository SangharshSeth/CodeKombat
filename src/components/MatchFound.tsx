import { motion } from "framer-motion";
import { CheckCircle, User, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import  { useState, useEffect } from "react";
import {IMatchData} from "@/pages/PreMatch.tsx";

interface MatchFoundScreenProps {
  matchData: IMatchData | undefined;
  onCancel: () => void;
}

const MatchFoundScreen = ({ matchData, onCancel }: MatchFoundScreenProps) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(10);  // Start the timer at 10 seconds

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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center space-y-8"
      >
        {/* Match Found Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
          <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="w-24 h-24 mx-auto mb-8"
          >
            <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>

          <h2 className="text-3xl font-bold mb-4 text-green-400">Match Found!</h2>
          <p className="text-gray-400 mb-6">You're ready to duel!</p>

          {/* Match Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-blue-500" />
                <span className="font-medium">Opponent:</span>
              </div>
              <span className="text-lg text-gray-200">{matchData?.opponentName || "Unknown"}</span>
            </div>

            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Code2 className="w-8 h-8 text-purple-500" />
                <span className="font-medium">Language:</span>
              </div>
              <span className="text-lg text-gray-200">{matchData?.programmingLanguage}</span>
            </div>

            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-yellow-400">⚡</span>
                <span className="font-medium">Category:</span>
              </div>
              <span className="text-lg text-gray-200">{matchData?.category}</span>
            </div>

            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-red-400">🔥</span>
                <span className="font-medium">Difficulty:</span>
              </div>
              <span className="text-lg text-gray-200">{matchData?.difficulty}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="text-2xl font-semibold">
            Starting in: {timer}s
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {/* The Start Match button is removed and replaced with the timer */}
          </div>
        </div>
      </motion.div>
  );
};

export default MatchFoundScreen;