import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaCode,
  FaSitemap,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import MatchFoundScreen from "@/components/MatchFound.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { io } from "socket.io-client";
import { WEBSOCKET_API_URL } from "@/api.ts";
import useStore from "../websocketStore.ts";
import {IsSearching} from "@/components/IsSearching.tsx";
import { CircleDot, Swords, Wand2 } from "lucide-react"

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
];

const difficulties = [
  { 
    name: "Easy", 
    color: "text-green-500",
    ringColor: "focus-visible:ring-green-500",
    bgColor: "bg-green-500",
  },
  { 
    name: "Medium", 
    color: "text-orange-500",
    ringColor: "focus-visible:ring-orange-500",
    bgColor: "bg-orange-500",
  },
  { 
    name: "Hard", 
    color: "text-red-500",
    ringColor: "focus-visible:ring-red-500",
    bgColor: "bg-red-500",
  },
];

const usernameWords = {
  adjectives: ['Epic', 'Mystic', 'Cosmic', 'Shadow', 'Crystal', 'Thunder', 'Neon', 'Pixel', 'Cyber', 'Nova'],
  nouns: ['Coder', 'Ninja', 'Phoenix', 'Dragon', 'Knight', 'Wizard', 'Hunter', 'Sage', 'Ghost', 'Wolf']
}

const generateUsername = () => {
  const adjective = usernameWords.adjectives[Math.floor(Math.random() * usernameWords.adjectives.length)]
  const noun = usernameWords.nouns[Math.floor(Math.random() * usernameWords.nouns.length)]
  const number = Math.floor(Math.random() * 999)
  return `${adjective}${noun}${number}`
}

export interface IMatchDataFromServer {
  player1: string;
  player2: string;
  question: {
    description: string;
    difficulty: string;
  };
  roomId: string;
}

export interface IMatchData {
  opponentName: string;
  userName: string;
  difficulty: string;
  category: string;
  question: {
    description: string;
    difficulty: string
  };
  players: string[];
  roomId: string;
}

export default function MatchSetupStepper() {

  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchData, setMatchData] = useState<IMatchData | undefined>();
  const { toast } = useToast();

  const handleSearch = () => {
    if (selectedCategory && selectedDifficulty) {
      setIsSearching(true);
      const socket = io(WEBSOCKET_API_URL, {
        // Add reconnection options if needed
        reconnection: true,
        reconnectionDelay: 1000,
      });
      useStore.getState().setWebSocket(socket);
      const gameDataToSocket = {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        userName: username,
      };

      socket.emit("join-matchmaking", gameDataToSocket);

      socket.on("match-update", (data) => {
        console.log("Match Update", data);
      });

      socket.on("match-data", (data: IMatchDataFromServer) => {
        setIsSearching(false);
        setMatchFound(true);
        const opponent =
          data.player1 === username ? data.player2 : data.player1;
        console.log("DATA FROM SERVER", data);
        console.log("Current Username", username)
        setMatchData({
          opponentName: opponent,
          userName: username,
          difficulty: selectedDifficulty,
          category: selectedCategory,
          question: data.question,
          roomId: data.roomId,
          players: [data.player1, data.player2],
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

  const searchingData = {
      selectedCategory: selectedCategory,
      selectedDifficulty: selectedDifficulty,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      {matchFound ? (
        <MatchFoundScreen
          matchData={matchData}
          onCancel={() => setMatchFound(false)}
        />
      ) : isSearching ? (
          <IsSearching searchingProps={searchingData} onCancel={() => setIsSearching(false)}  />
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Choose Your Battle</h2>
            <p className="text-gray-400">
              Select your preferences to find the perfect opponent
            </p>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={cn(
                      "pr-10",
                      "text-gray-100 placeholder:text-gray-500",
                      "bg-gray-900/50",
                      "border-gray-700",
                      "focus:border-blue-500 focus:ring-blue-500/20"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setUsername(generateUsername())}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2",
                      "p-1.5 rounded-md",
                      "text-gray-400 hover:text-blue-500",
                      "bg-transparent hover:bg-blue-500/10",
                      "transition-all duration-300"
                    )}
                    title="Generate username"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

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

              <div className="space-y-4">
                <Label className="text-white">Difficulty Level</Label>
                <div className="flex flex-col space-y-3">
                  {difficulties.map(({ name, color, ringColor }) => (
                    <div key={name} className="relative">
                      <input
                        type="radio"
                        name="difficulty"
                        id={name}
                        value={name}
                        checked={selectedDifficulty === name}
                        onChange={() => setSelectedDifficulty(name)}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={name}
                        className={cn(
                          "flex items-center gap-4",
                          "p-2 cursor-pointer transition-all duration-300",
                          "hover:bg-gray-800/50 rounded-md",
                          "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black",
                          ringColor
                        )}
                      >
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <div className={cn(
                            "h-5 w-5 rounded-full border-2 border-gray-600",
                            selectedDifficulty === name && "border-gray-400",
                            "flex items-center justify-center",
                            "transition-all duration-300"
                          )}>
                            <CircleDot 
                              className={cn(
                                "w-4 h-4",
                                color,
                                selectedDifficulty === name ? "opacity-100 scale-100" : "opacity-0 scale-0",
                                "transition-all duration-300"
                              )}
                            />
                          </div>
                        </div>
                        <span className={cn(
                          "font-medium",
                          selectedDifficulty === name ? color : "text-gray-300"
                        )}>
                          {name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={handleSearch}
              disabled={!selectedCategory || !selectedDifficulty}
              className={cn(
                "w-full py-6 text-lg font-semibold",
                "bg-gradient-to-r from-blue-500/90 to-indigo-600/90",
                "hover:from-blue-500 hover:to-indigo-600",
                "disabled:from-gray-600/50 disabled:to-gray-700/50",
                "transition-all duration-300",
                "flex items-center justify-center gap-2",
                "shadow-lg shadow-blue-500/20"
              )}
            >
              <Swords className="w-5 h-5" />
              Find Match
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
