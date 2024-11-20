import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaCode,
  FaServer,
  FaSitemap,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";
import MatchFoundScreen from "@/components/MatchFound.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { io } from "socket.io-client";
import { WEBSOCKET_API_URL } from "@/api.ts";
import useStore from "../websocketStore.ts";
import {IsSearching} from "@/components/IsSearching.tsx";

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

export interface IMatchDataFromServer {
  player1: string;
  player2: string;
  question: object;
  roomId: string;
}

export interface IMatchData {
  opponentName: string;
  difficulty: string;
  category: string;
  question: object;
  players: string[];
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
        setMatchData({
          opponentName: opponent,
          difficulty: selectedDifficulty,
          category: selectedCategory,
          question: data.question,
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
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-gray-900 text-white border-gray-700 focus:border-blue-500"
                />
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
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={!selectedDifficulty || !selectedCategory || !username}
              className="bg-slate-500 hover:bg-blue-700 text-white px-8 py-2"
            >
              Find Match
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
