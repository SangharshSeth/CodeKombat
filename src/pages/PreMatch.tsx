import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaCode,
  FaCuttlefish,
  FaJava,
  FaJsSquare,
  FaPython,
  FaRust,
  FaServer,
  FaSitemap,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import { FaGolang } from "react-icons/fa6";
import { SiKotlin } from "react-icons/si";
import { Database, Search } from "lucide-react";
import MatchFoundScreen from "@/components/MatchFound.tsx";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast.ts";
import { io } from "socket.io-client";

const steps = [
  { id: "username", title: "Username" },
  { id: "language", title: "Language" },
  { id: "category", title: "Category" },
  { id: "difficulty", title: "Difficulty" },
];

const languages = [
  {
    name: "Python",
    icon: <FaPython className="text-3xl" />,
    color: "text-yellow-400",
    bgGradient: "from-yellow-400/20 to-yellow-400/10",
    borderColor: "border-yellow-400/50",
    hoverBg: "hover:bg-yellow-400/20",
  },
  {
    name: "C++",
    icon: <FaCuttlefish className="text-3xl" />,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-blue-500/10",
    borderColor: "border-blue-500/50",
    hoverBg: "hover:bg-blue-500/20",
  },
  {
    name: "JavaScript",
    icon: <FaJsSquare className="text-3xl" />,
    color: "text-yellow-300",
    bgGradient: "from-yellow-300/20 to-yellow-300/10",
    borderColor: "border-yellow-300/50",
    hoverBg: "hover:bg-yellow-300/20",
  },
  {
    name: "Java",
    icon: <FaJava className="text-3xl" />,
    color: "text-red-500",
    bgGradient: "from-red-500/20 to-red-500/10",
    borderColor: "border-red-500/50",
    hoverBg: "hover:bg-red-500/20",
  },
  {
    name: "Rust",
    icon: <FaRust className="text-3xl" />,
    color: "text-orange-600",
    bgGradient: "from-orange-600/20 to-orange-600/10",
    borderColor: "border-orange-600/50",
    hoverBg: "hover:bg-orange-600/20",
  },
  {
    name: "Golang",
    icon: <FaGolang className="text-3xl" />,
    color: "text-cyan-400",
    bgGradient: "from-cyan-400/20 to-cyan-400/10",
    borderColor: "border-cyan-400/50",
    hoverBg: "hover:bg-cyan-400/20",
  },
  {
    name: "Kotlin",
    icon: <SiKotlin className="text-3xl" />,
    color: "text-purple-400",
    bgGradient: "from-purple-400/20 to-purple-400/10",
    borderColor: "border-purple-400/50",
    hoverBg: "hover:bg-purple-400/20",
  },
];

const categories = [
  {
    name: "DSA",
    icon: <FaCode className="text-3xl" />,
    color: "text-emerald-400",
    bgGradient: "from-emerald-400/20 to-emerald-400/10",
    borderColor: "border-emerald-400/50",
    hoverBg: "hover:bg-emerald-400/20",
  },
  {
    name: "Web Dev",
    icon: <FaSitemap className="text-3xl" />,
    color: "text-pink-400",
    bgGradient: "from-pink-400/20 to-pink-400/10",
    borderColor: "border-pink-400/50",
    hoverBg: "hover:bg-pink-400/20",
  },
  {
    name: "System Design",
    icon: <FaServer className="text-3xl" />,
    color: "text-indigo-400",
    bgGradient: "from-indigo-400/20 to-indigo-400/10",
    borderColor: "border-indigo-400/50",
    hoverBg: "hover:bg-indigo-400/20",
  },
  {
    name: "Database",
    icon: <Database className="text-3xl" />,
    color: "text-amber-400",
    bgGradient: "from-amber-400/20 to-amber-400/10",
    borderColor: "border-amber-400/50",
    hoverBg: "hover:bg-amber-400/20",
  },
];

const difficulties = [
  { name: "Easy", color: "bg-green-500 text-white" },
  { name: "Medium", color: "bg-orange-500 text-white" },
  { name: "Hard", color: "bg-red-500 text-white" },
];

interface IGameData {
  player1: string
  player2: string
  questions: string[]
}

export interface IMatchDataFromServer {
  gameRoomId: string
  gameData: IGameData
  players: string[]
}

export interface IMatchData {
  opponentName: string
  programmingLanguage: string
  difficulty: string
  category: string
  questions: string[]
  totalPlayers: string[]
}

export default function MatchSetupStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchData, setMatchData] = useState<IMatchData | undefined>();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return username.trim() !== "";
      case 1:
        return selectedLanguage !== "";
      case 2:
        return selectedCategory !== "";
      case 3:
        return selectedDifficulty !== "";
      default:
        return false;
    }
  };

  const handleSearch = () => {
    if (selectedLanguage && selectedCategory && selectedDifficulty) {
      setIsSearching(true);
      const socket = io("http://localhost:3000", {
        // Add reconnection options if needed
        reconnection: true,
        reconnectionDelay: 1000,
      });

      const gameDataToSocket = {
        language: selectedLanguage,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        userName: username,
      };

      socket.emit("join-matchmaking", gameDataToSocket);

      socket.on("match-found", (data: IMatchDataFromServer) => {
        console.log("MATCH DATA SOCK", data)
        setIsSearching(false);
        setMatchFound(true);
        const opponent =
          data.gameData.player1 === username
            ? data.gameData.player2
            : data.gameData.player1;
        console.log("DATA FROM SERVER", data)
        setMatchData({
          opponentName: opponent,
          programmingLanguage: selectedLanguage,
          difficulty: selectedDifficulty,
          category: selectedCategory,
          questions: data.gameData.questions,
          totalPlayers: data.players
        });
        toast({
          title: "Opponent Found",
          description: opponent,
          duration: 2000,
          variant: "default",
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      {matchFound ? (
        <MatchFoundScreen
          matchData={matchData}
          onCancel={() => setMatchFound(false)}
        />
      ) : isSearching ? (
        <motion.div
          key="searching"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <Search className="w-24 h-24 text-blue-500" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4">Finding Your Opponent</h2>
            <p className="text-gray-400 mb-6">
              Matching you with a worthy challenger...
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-300">
                {selectedLanguage}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 rounded-full text-sm text-purple-300">
                {selectedCategory}
              </span>
              <span className="px-3 py-1 bg-green-500/10 rounded-full text-sm text-green-300">
                {selectedDifficulty}
              </span>
            </div>

            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1 bg-blue-500 rounded-full"
            />

            <button
              onClick={() => setIsSearching(false)}
              className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Choose Your Battle</h2>
            <p className="text-gray-400">
              Select your preferences to find the perfect opponent
            </p>
          </div>

          <div className="relative px-4">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-700">
              <div
                className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <ol className="relative z-10 flex justify-between">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                      currentStep >= index
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-700 bg-gray-800 text-gray-400"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="absolute top-10 text-xs font-medium text-gray-400 whitespace-nowrap">
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-gray-900 text-white border-gray-700 focus:border-blue-500"
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <Label className="text-white">Programming Language</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {languages.map(
                      ({
                        name,
                        icon,
                        color,
                        bgGradient,
                        borderColor,
                        hoverBg,
                      }) => (
                        <Button
                          key={name}
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-24 relative overflow-hidden transition-all duration-300 border",
                            "bg-gray-800/50 hover:bg-gray-700/50 active:bg-gray-700/50",
                            "text-white hover:text-white active:text-white",
                            selectedLanguage === name
                              ? cn(
                                  "bg-gradient-to-br",
                                  bgGradient,
                                  borderColor,
                                  "border-2",
                                  "hover:bg-gradient-to-br",
                                  color
                                )
                              : "border-gray-700 hover:border-gray-600",
                            hoverBg
                          )}
                          onClick={() => setSelectedLanguage(name)}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div
                              className={cn(
                                "transform transition-transform duration-300",
                                selectedLanguage === name
                                  ? "scale-110"
                                  : "scale-100",
                                color
                              )}
                            >
                              {icon}
                            </div>
                            <span
                              className={cn(
                                "font-medium",
                                selectedLanguage === name
                                  ? "text-white"
                                  : "text-gray-300"
                              )}
                            >
                              {name}
                            </span>
                          </div>
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label className="text-white">Challenge Category</Label>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {categories.map(
                      ({
                        name,
                        icon,
                        color,
                        bgGradient,
                        borderColor,
                        hoverBg,
                      }) => (
                        <Button
                          key={name}
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-24 relative overflow-hidden transition-all duration-300 border",
                            "bg-gray-800/50 hover:bg-gray-700/50 active:bg-gray-700/50",
                            "text-white hover:text-white active:text-white",
                            selectedCategory === name
                              ? cn(
                                  "bg-gradient-to-br",
                                  bgGradient,
                                  borderColor,
                                  "border-2",
                                  "hover:bg-gradient-to-br",
                                  color
                                )
                              : "border-gray-700 hover:border-gray-600",
                            hoverBg
                          )}
                          onClick={() => setSelectedCategory(name)}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div
                              className={cn(
                                "transform transition-transform duration-300",
                                selectedCategory === name
                                  ? "scale-110"
                                  : "scale-100",
                                color
                              )}
                            >
                              {icon}
                            </div>
                            <span
                              className={cn(
                                "font-medium",
                                selectedCategory === name
                                  ? "text-white"
                                  : "text-gray-300"
                              )}
                            >
                              {name}
                            </span>
                          </div>
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-white">Difficulty Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {difficulties.map(({ name, color }) => (
                      <Button
                        key={name}
                        variant={
                          selectedDifficulty === name ? "default" : "outline"
                        }
                        className={cn(
                          "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600",
                          selectedDifficulty === name && color
                        )}
                        onClick={() => setSelectedDifficulty(name)}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepComplete(currentStep)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSearch}
                disabled={!isStepComplete(currentStep)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Find Match
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
