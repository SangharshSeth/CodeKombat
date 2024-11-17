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

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {FaCode, FaCuttlefish, FaJava, FaJsSquare, FaPython, FaRust, FaServer, FaSitemap} from "react-icons/fa"
import {cn} from "@/lib/utils"
import {FaGolang} from "react-icons/fa6";
import {SiKotlin} from "react-icons/si";
import {Database, Search} from "lucide-react";
import MatchFoundScreen from "@/components/MatchFound.tsx";
import {motion} from 'framer-motion'
import {useToast} from "@/hooks/use-toast.ts";
import {io} from "socket.io-client";

const steps = [
    {id: 'username', title: 'Username'},
    {id: 'language', title: 'Language'},
    {id: 'category', title: 'Category'},
    {id: 'difficulty', title: 'Difficulty'},
]

const languages = [
    {
        name: 'Python',
        icon: <FaPython className="text-3xl"/>,
        color: 'text-yellow-400',
        bgGradient: 'from-yellow-400/20 to-yellow-400/10',
        borderColor: 'border-yellow-400/50',
        hoverBg: 'hover:bg-yellow-400/20'
    },
    {
        name: 'C++',
        icon: <FaCuttlefish className="text-3xl"/>,
        color: 'text-blue-500',
        bgGradient: 'from-blue-500/20 to-blue-500/10',
        borderColor: 'border-blue-500/50',
        hoverBg: 'hover:bg-blue-500/20'
    },
    {
        name: 'JavaScript',
        icon: <FaJsSquare className="text-3xl"/>,
        color: 'text-yellow-300',
        bgGradient: 'from-yellow-300/20 to-yellow-300/10',
        borderColor: 'border-yellow-300/50',
        hoverBg: 'hover:bg-yellow-300/20'
    },
    {
        name: 'Java',
        icon: <FaJava className="text-3xl"/>,
        color: 'text-red-500',
        bgGradient: 'from-red-500/20 to-red-500/10',
        borderColor: 'border-red-500/50',
        hoverBg: 'hover:bg-red-500/20'
    },
    {
        name: 'Rust',
        icon: <FaRust className="text-3xl"/>,
        color: 'text-orange-600',
        bgGradient: 'from-orange-600/20 to-orange-600/10',
        borderColor: 'border-orange-600/50',
        hoverBg: 'hover:bg-orange-600/20'
    },
    {
        name: 'Golang',
        icon: <FaGolang className="text-3xl"/>,
        color: 'text-cyan-400',
        bgGradient: 'from-cyan-400/20 to-cyan-400/10',
        borderColor: 'border-cyan-400/50',
        hoverBg: 'hover:bg-cyan-400/20'
    },
    {
        name: 'Kotlin',
        icon: <SiKotlin className="text-3xl"/>,
        color: 'text-purple-400',
        bgGradient: 'from-purple-400/20 to-purple-400/10',
        borderColor: 'border-purple-400/50',
        hoverBg: 'hover:bg-purple-400/20'
    }
]

const categories = [
    {
        name: 'DSA',
        icon: <FaCode className="text-3xl"/>,
        color: 'text-emerald-400',
        bgGradient: 'from-emerald-400/20 to-emerald-400/10',
        borderColor: 'border-emerald-400/50',
        hoverBg: 'hover:bg-emerald-400/20'
    },
    {
        name: 'Web Dev',
        icon: <FaSitemap className="text-3xl"/>,
        color: 'text-pink-400',
        bgGradient: 'from-pink-400/20 to-pink-400/10',
        borderColor: 'border-pink-400/50',
        hoverBg: 'hover:bg-pink-400/20'
    },
    {
        name: 'System Design',
        icon: <FaServer className="text-3xl"/>,
        color: 'text-indigo-400',
        bgGradient: 'from-indigo-400/20 to-indigo-400/10',
        borderColor: 'border-indigo-400/50',
        hoverBg: 'hover:bg-indigo-400/20'
    },
    {
        name: 'Database',
        icon: <Database className="text-3xl"/>,
        color: 'text-amber-400',
        bgGradient: 'from-amber-400/20 to-amber-400/10',
        borderColor: 'border-amber-400/50',
        hoverBg: 'hover:bg-amber-400/20'
    }
]

const difficulties = [
    {name: 'Easy', color: 'bg-green-500 text-white'},
    {name: 'Medium', color: 'bg-orange-500 text-white'},
    {name: 'Hard', color: 'bg-red-500 text-white'},
]

export default function MatchSetupStepper() {
    const [currentStep, setCurrentStep] = useState(0)
    const [username, setUsername] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [matchFound, setMatchFound] = useState(false)
    const [matchData, setMatchData] = useState({})
    const { toast } = useToast()

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

    // const handleSearch = () => {
    //   console.log('Searching for match with:', { username, selectedLanguage, selectedCategory, selectedDifficulty })
    // }
    const handleSearch = () => {
        if (selectedLanguage && selectedCategory && selectedDifficulty) {
            setIsSearching(true);
            const socket = io('http://localhost:3000', {
                // Add reconnection options if needed
                reconnection: true,
                reconnectionDelay: 1000,
            });
            const gameDataToSocket = {
                language: selectedLanguage,
                category: selectedCategory,
                difficulty: selectedDifficulty,
                userName: username,
            }

            socket.emit("join-matchmaking", gameDataToSocket)

            socket.on("match-found", (data: any) => {
                setIsSearching(false);
                setMatchFound(true);
                console.log(data);
                console.log(data.gameData.player1, data.gameData.player2);
                const opponent =
                    data.gameData.player1 === username
                        ? data.gameData.player2
                        : data.gameData.player1;
                setMatchData({
                    opponentName: opponent,
                    programmingLanguage: selectedLanguage,
                    difficulty: selectedDifficulty,
                    category: selectedCategory,
                });
                toast({
                    title: 'Opponent Found',
                    description: opponent,
                    duration: 5000,
                    variant: "default"
                })
            })
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
            {matchFound ? (
                <MatchFoundScreen matchData={matchData} onCancel={() => setMatchFound(false)}/>) : isSearching ? (
                <motion.div
                    key="searching"
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    className="text-center space-y-8"
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
                        <motion.div
                            animate={{rotate: 360}}
                            transition={{duration: 2, repeat: Infinity, ease: "linear"}}
                            className="w-24 h-24 mx-auto mb-8"
                        >
                            <Search className="w-24 h-24 text-blue-500"/>
                        </motion.div>

                        <h2 className="text-3xl font-bold mb-4">Finding Your Opponent</h2>
                        <p className="text-gray-400 mb-6">Matching you with a worthy challenger...</p>

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
                            initial={{width: "0%"}}
                            animate={{width: "100%"}}
                            transition={{duration: 2, repeat: Infinity}}
                            className="h-1 bg-blue-500 rounded-full"
                        />

                        <button
                            onClick={() => setIsSearching(false)}
                            className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>) : <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Choose Your Battle</h2>
                    <p className="text-gray-400">Select your preferences to find the perfect opponent</p>
                </div>

                <div className="relative px-4">
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-700">
                        <div
                            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                            style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
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

                        {/*{currentStep === 1 && (*/}
                        {/*    <div className="space-y-4">*/}
                        {/*      <Label className="text-white">Programming Language</Label>*/}
                        {/*      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">*/}
                        {/*        {languages.map(({ name, icon, color }) => (*/}
                        {/*            <Button*/}
                        {/*                key={name}*/}
                        {/*                variant={selectedLanguage === name ? "default" : "outline"}*/}
                        {/*                className={cn(*/}
                        {/*                    "h-20 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600",*/}
                        {/*                    selectedLanguage === name && "border-blue-600"*/}
                        {/*                )}*/}
                        {/*                onClick={() => setSelectedLanguage(name)}*/}
                        {/*            >*/}
                        {/*              <div className={cn("flex flex-col items-center space-y-2", color)}>*/}
                        {/*                {icon}*/}
                        {/*                <span>{name}</span>*/}
                        {/*              </div>*/}
                        {/*            </Button>*/}
                        {/*        ))}*/}
                        {/*      </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <Label className="text-white">Programming Language</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {languages.map(({name, icon, color, bgGradient, borderColor, hoverBg}) => (
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
                                                <div className={cn(
                                                    "transform transition-transform duration-300",
                                                    selectedLanguage === name ? "scale-110" : "scale-100",
                                                    color
                                                )}>
                                                    {icon}
                                                </div>
                                                <span className={cn(
                                                    "font-medium",
                                                    selectedLanguage === name ? "text-white" : "text-gray-300"
                                                )}>
                        {name}
                      </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/*{currentStep === 2 && (*/}
                        {/*    <div className="space-y-4">*/}
                        {/*      <Label className="text-white">Challenge Category</Label>*/}
                        {/*      <div className="grid grid-cols-2 gap-3">*/}
                        {/*        {categories.map((category) => (*/}
                        {/*            <Button*/}
                        {/*                key={category}*/}
                        {/*                variant={selectedCategory === category ? "default" : "outline"}*/}
                        {/*                className={cn(*/}
                        {/*                    "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600",*/}
                        {/*                    selectedCategory === category && "bg-purple-500 hover:bg-purple-600 border-purple-600"*/}
                        {/*                )}*/}
                        {/*                onClick={() => setSelectedCategory(category)}*/}
                        {/*            >*/}
                        {/*              {category}*/}
                        {/*            </Button>*/}
                        {/*        ))}*/}
                        {/*      </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <Label className="text-white">Challenge Category</Label>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {categories.map(({name, icon, color, bgGradient, borderColor, hoverBg}) => (
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
                                                <div className={cn(
                                                    "transform transition-transform duration-300",
                                                    selectedCategory === name ? "scale-110" : "scale-100",
                                                    color
                                                )}>
                                                    {icon}
                                                </div>
                                                <span className={cn(
                                                    "font-medium",
                                                    selectedCategory === name ? "text-white" : "text-gray-300"
                                                )}>
              {name}
            </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <Label className="text-white">Difficulty Level</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {difficulties.map(({name, color}) => (
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
            </div>}

        </div>
    )
}