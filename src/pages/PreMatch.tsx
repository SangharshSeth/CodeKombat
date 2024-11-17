// import  { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {  Search } from 'lucide-react';
// import { io } from 'socket.io-client';
// import { useToast } from "@/hooks/use-toast"
// import { Toaster } from "@/components/ui/toaster"
// import MatchFoundScreen from '../components/MatchFound';
// import {FaCuttlefish, FaGem, FaJava, FaJsSquare, FaPython} from "react-icons/fa";
// import {Footer} from "@/components/Footer.tsx";
//
// const MatchSetupScreen = () => {
//   const [isSearching, setIsSearching] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedDifficulty, setSelectedDifficulty] = useState('');
//   const [matchFound, setMatchFound] = useState(false);
//   const [matchData, setMatchData] = useState({});
//   const [currentUserName, setCurrentUserName] = useState('');
//   const { toast } = useToast()
//
//   const languages = [
//     { name: 'Python', icon: <FaPython /> },
//     { name: 'JavaScript', icon: <FaJsSquare /> },
//     { name: 'Java', icon: <FaJava /> },
//     { name: 'C++', icon: <FaCuttlefish /> },
//     { name: 'Ruby', icon: <FaGem /> },
//   ];
//   const categories = ['DSA', 'Web Dev', 'System Design', 'Database'];
//   const difficulties = [
//     { name: 'Easy', color: 'bg-green-500 text-white' },
//     { name: 'Medium', color: 'bg-orange-500 text-white' },
//     { name: 'Hard', color: 'bg-red-500 text-white' },
//   ];
//
//   const handleSearch = () => {
//     if (selectedLanguage && selectedCategory && selectedDifficulty) {
//       setIsSearching(true);
//       const socket = io('http://localhost:3000', {
//         // Add reconnection options if needed
//         reconnection: true,
//         reconnectionDelay: 1000,
//       });
//       const gameDataToSocket = {
//         language: selectedLanguage,
//         category: selectedCategory,
//         difficulty: selectedDifficulty,
//         userName: currentUserName,
//       }
//
//       socket.emit("join-matchmaking", gameDataToSocket)
//
//       socket.on("match-found", (data: any) => {
//         setIsSearching(false);
//         setMatchFound(true);
//         console.log(data);
//         console.log(data.gameData.player1, data.gameData.player2);
//         const opponent =
//             data.gameData.player1 === currentUserName
//                 ? data.gameData.player2
//                 : data.gameData.player1;
//         setMatchData({
//           opponentName: opponent,
//         });
//         toast({
//           title: 'Opponent Found',
//           description: opponent,
//           duration: 5000,
//           variant: "default"
//         })
//       })
//     }
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
//       <Toaster />
//       <div className="max-w-4xl mx-auto">
//         <AnimatePresence mode="wait">
//           {matchFound ? (
//             <MatchFoundScreen matchData={matchData} onCancel={() => setMatchFound(false)} />
//           ) : isSearching ? (
//             /* Searching Screen */
//             <motion.div
//               key="searching"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="text-center space-y-8"
//             >
//               <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-24 h-24 mx-auto mb-8"
//                 >
//                   <Search className="w-24 h-24 text-blue-500" />
//                 </motion.div>
//
//                 <h2 className="text-3xl font-bold mb-4">Finding Your Opponent</h2>
//                 <p className="text-gray-400 mb-6">Matching you with a worthy challenger...</p>
//
//                 <div className="flex flex-wrap justify-center gap-3 mb-8">
//                   <span className="px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-300">
//                     {selectedLanguage}
//                   </span>
//                   <span className="px-3 py-1 bg-purple-500/10 rounded-full text-sm text-purple-300">
//                     {selectedCategory}
//                   </span>
//                   <span className="px-3 py-1 bg-green-500/10 rounded-full text-sm text-green-300">
//                     {selectedDifficulty}
//                   </span>
//                 </div>
//
//                 <motion.div
//                   initial={{ width: "0%" }}
//                   animate={{ width: "100%" }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="h-1 bg-blue-500 rounded-full"
//                 />
//
//                 <button
//                   onClick={() => setIsSearching(false)}
//                   className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           ) : (
//             /* Setup Screen */
//             <motion.div
//               key="setup"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-8"
//             >
//               <div className="text-center">
//                 <h2 className="text-3xl font-bold mb-4">Choose Your Battle</h2>
//                 <p className="text-gray-400">Select your preferences to find the perfect opponent</p>
//               </div>
//
//               <div className="grid grid-cols-1 gap-8">
//                 {/* Language Selection */}
//                 <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//                   <h3 className="text-xl font-semibold mb-4">Your Username</h3>
//                   <input
//                       type="text"
//                       value={currentUserName}
//                       onChange={(e) => setCurrentUserName(e.target.value)}
//                       placeholder="Enter your username"
//                       className="w-full px-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//                   />
//                 </div>
//                 <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//                   <h3 className="text-xl font-semibold mb-4">Programming Language</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {languages.map(({ name, icon }) => (
//                         <motion.button
//                             key={name}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setSelectedLanguage(name)}
//                             className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors ${
//                                 selectedLanguage === name
//                                     ? 'bg-blue-500 text-white'
//                                     : 'bg-gray-700/50 hover:bg-gray-600/50'
//                             }`}
//                         >
//                           {icon} {name}
//                         </motion.button>
//                     ))}
//                   </div>
//                 </div>
//
//                 {/* Category Selection */}
//                 <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//                   <h3 className="text-xl font-semibold mb-4">Challenge Category</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {categories.map((category) => (
//                         <motion.button
//                             key={category}
//                             whileHover={{scale: 1.05}}
//                             whileTap={{scale: 0.95}}
//                             onClick={() => setSelectedCategory(category)}
//                             className={`px-4 py-2 rounded-lg transition-colors ${
//                                 selectedCategory === category
//                                     ? 'bg-purple-500 text-white'
//                                     : 'bg-gray-700/50 hover:bg-gray-600/50'
//                             }`}
//                         >
//                           {category}
//                         </motion.button>
//                     ))}
//                   </div>
//                 </div>
//
//                 {/* Difficulty Selection */}
//                 <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//                   <h3 className="text-xl font-semibold mb-4">Difficulty Level</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {difficulties.map(({ name, color }) => (
//                         <motion.button
//                             key={name}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setSelectedDifficulty(name)}
//                             className={`px-4 py-2 rounded-lg ${selectedDifficulty === name ? color : "bg-gray-700/50 hover:bg-gray-600/50"} `}
//                         >
//                           {name}
//                         </motion.button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//
//               {/* Find Match Button */}
//               <motion.button
//                   whileHover={{scale: 1.05}}
//                   whileTap={{scale: 0.95}}
//                   onClick={handleSearch}
//                   disabled={!selectedLanguage || !selectedCategory || !selectedDifficulty}
//                   className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
//                       selectedLanguage && selectedCategory && selectedDifficulty
//                           ? 'bg-blue-600 hover:bg-blue-700'
//                     : 'bg-gray-700 cursor-not-allowed'
//                 }`}
//               >
//                 Find Match
//               </motion.button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };
//
// export default MatchSetupScreen;
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaCuttlefish, FaGem, FaJava, FaJsSquare, FaPython } from "react-icons/fa"
import { cn } from "@/lib/utils"

const steps = [
  { id: 'username', title: 'Username' },
  { id: 'language', title: 'Language' },
  { id: 'category', title: 'Category' },
  { id: 'difficulty', title: 'Difficulty' },
]

const languages = [
  { name: 'Python', icon: <FaPython />, color: 'text-yellow-400' },
  { name: 'JavaScript', icon: <FaJsSquare />, color: 'text-yellow-300' },
  { name: 'Java', icon: <FaJava />, color: 'text-red-500' },
  { name: 'C++', icon: <FaCuttlefish />, color: 'text-blue-500' },
  { name: 'Ruby', icon: <FaGem />, color: 'text-red-600' },
]

const categories = ['DSA', 'Web Dev', 'System Design', 'Database']

const difficulties = [
  { name: 'Easy', color: 'bg-green-500 text-white' },
  { name: 'Medium', color: 'bg-orange-500 text-white' },
  { name: 'Hard', color: 'bg-red-500 text-white' },
]

export default function MatchSetupStepper() {
  const [currentStep, setCurrentStep] = useState(0)
  const [username, setUsername] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return username.trim() !== ''
      case 1:
        return selectedLanguage !== ''
      case 2:
        return selectedCategory !== ''
      case 3:
        return selectedDifficulty !== ''
      default:
        return false
    }
  }

  const handleSearch = () => {
    console.log('Searching for match with:', { username, selectedLanguage, selectedCategory, selectedDifficulty })
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Choose Your Battle</h2>
            <p className="text-gray-400">Select your preferences to find the perfect opponent</p>
          </div>

          <div className="relative px-4">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-700">
              <div
                  className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
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
                    <Label htmlFor="username" className="text-white">Username</Label>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {languages.map(({ name, icon, color }) => (
                          <Button
                              key={name}
                              variant={selectedLanguage === name ? "default" : "outline"}
                              className={cn(
                                  "h-20 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600",
                                  selectedLanguage === name && "bg-blue-500 hover:bg-blue-600 border-blue-600"
                              )}
                              onClick={() => setSelectedLanguage(name)}
                          >
                            <div className={cn("flex flex-col items-center space-y-2", color)}>
                              {icon}
                              <span>{name}</span>
                            </div>
                          </Button>
                      ))}
                    </div>
                  </div>
              )}

              {currentStep === 2 && (
                  <div className="space-y-4">
                    <Label className="text-white">Challenge Category</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                          <Button
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className={cn(
                                  "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600",
                                  selectedCategory === category && "bg-purple-500 hover:bg-purple-600 border-purple-600"
                              )}
                              onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Button>
                      ))}
                    </div>
                  </div>
              )}

              {currentStep === 3 && (
                  <div className="space-y-4">
                    <Label className="text-white">Difficulty Level</Label>
                    <div className="flex flex-col space-y-3">
                      {difficulties.map(({ name, color }) => (
                          <Button
                              key={name}
                              variant={selectedDifficulty === name ? "default" : "outline"}
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
      </div>
  )
}