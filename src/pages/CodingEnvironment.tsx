import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Ban,
    Eye,
    KeyboardOff,
    Loader2,
    Moon,
    Sun,
    Download,
    Send,
    MessageCircle,
    CheckCircle2,
    XCircle,
    Battery,
    Shield,
    Play,
    Trash2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { Languages } from "@/constants.ts";
import { PISTON_CODE_EXECUTOR } from "@/api.ts";
import { Toaster } from "@/components/ui/toaster.tsx";
import { AnimatePresence, motion } from "framer-motion";
// @ts-expect-error: Some-Error-Idonttknow
import "@fontsource-variable/jetbrains-mono";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";
import { Socket } from "socket.io-client";
import useStore from "@/websocketStore.ts";
import { DefaultValues } from "@/comments.ts";
import { Input } from "@/components/ui/input";
import "monaco-themes/themes/Monokai Bright.json";

interface CodeExecutionResult {
    run: {
        code: number;
        output?: string;
    };
    message?: string;
}
interface PowerUp {
    id: number;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const powerups: PowerUp[] = [
    {
        icon: <Ban className="w-4 h-4" />,
        label: "Disable code compilation for 2 minutes",
        id: 1,
        color: "text-yellow-400",
    },
    {
        icon: <Eye className="w-4 h-4" />,
        label: "See opponent's code for 15 seconds",
        id: 2,
        color: "text-blue-400",
    },
    {
        icon: <KeyboardOff className="w-4 h-4" />,
        label: "Disable opponent's keyboard for 1 minute",
        id: 3,
        color: "text-red-400",
    },
];

export interface PowerUpsProps {
    webSocket: Socket;
}

export const CodingEnvironment = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = sessionStorage.getItem("timeLeft");
        return saved ? parseInt(saved, 10) : 0;
    });
    const [editorTheme, setEditorTheme] = useState("vs-dark");

    const location = useLocation();
    const data = location.state || {};
    const [codeError, setCodeError] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const socket = useStore((state) => state.webSocket);
    const [powerDownActive, setPowerDownActive] = useState(false);
    const [disableCodeCompilation, setDisableCodeCompilation] = useState(false);
    const [defaultCode, setDefaultCode] = useState(() =>
        DefaultValues("python", data?.matchData?.question?.description)
    );

    function executePowerDown(id: number) {
        if (id === 1) {
            setDisableCodeCompilation(true);
            setTimeout(() => {
                setDisableCodeCompilation(false);
            }, 120000);
        }
        return;
    }

    useEffect(() => {
        socket?.on("power-level-down", (data) => {
            console.log(`Power down data received ${data}`);
            setPowerDownActive(true);
            executePowerDown(data.id);
        });
    }, [socket]);
    const handlePowerUpClick = async (id: number) => {
        socket?.emit("power-up-activate", id);
    };

    useEffect(() => {
        const difficulty = data.matchData?.question?.difficulty;
        if (!difficulty || sessionStorage.getItem("timeLeft")) return;

        let timerValue = 0;
        console.log("Difficulty", difficulty);
        switch (difficulty) {
            case "Easy":
                timerValue = 30 * 60;
                break;
            case "Medium":
                timerValue = 60 * 60;
                break;
            case "Hard":
                timerValue = 90 * 60;
                break;
            default:
                console.error("Unknown difficulty");
                return;
        }

        setTimeLeft(timerValue);
        sessionStorage.setItem("timeLeft", timerValue.toString());
    }, [data.matchData?.question?.difficulty]);

    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            import('monaco-themes/themes/Github Dark.json')
                .then(data => {
                    monaco.editor.defineTheme('github-dark', data as never);
                })
                .then(_ => monaco.editor.setTheme('github-dark'))
        }
    }, [monaco]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => {
                const newTime = prevTime - 1;
                if (newTime <= 0) {
                    clearInterval(timerInterval);
                    sessionStorage.removeItem("timeLeft");
                    return 0;
                }
                sessionStorage.setItem("timeLeft", newTime.toString());
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timeLeft]);

    useEffect(() => {
        const newDefaultCode = DefaultValues(
            language,
            data?.matchData?.question?.description
        );
        setDefaultCode(newDefaultCode);
        setCode(newDefaultCode); // Optionally reset the editor's code
    }, [language, data?.matchData?.question?.description]);


    const formatTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }, [timeLeft]);

    const executeCode = async () => {
        setIsExecuting(true);
        setOutput("Executing...");

        const selectedLang = Languages.find((lang) => lang.value === language);
        console.log("Executing", code);
        try {
            const response = await fetch(PISTON_CODE_EXECUTOR, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: language,
                    version: selectedLang?.version,
                    files: [
                        {
                            content: code,
                        },
                    ],
                }),
            });

            const data: CodeExecutionResult = await response.json();
            console.log("Output data", data);
            if (data.run.code === 1) {
                setCodeError(true);
            } else if (data.run.code === 0) {
                setCodeError(false);
            }
            setOutput(data.run?.output || data.message || "No output");
        } catch (error) {
            setOutput(`Error: ${error}`);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <Toaster />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-[95%] mx-auto flex gap-4"
            >
                <div className="w-[70%]">
                    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                        <div className="flex flex-wrap items-center p-4 bg-gray-900 border-b border-gray-800">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                                    {Languages.map((lang) => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                            className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-100"
                                            onClick={() => setLanguage(lang.label)}
                                        >
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2 ml-auto text-gray-100">
                                <FaClock className="w-4 h-4 animate-pulse" />
                                <p className="font-mono">{formatTime}</p>
                            </div>
                            <div className="flex space-x-2 ml-auto mt-2 sm:mt-0">
                                <div className="max-w-2xl mx-auto">
                                    <TooltipProvider>
                                        <div className="flex justify-center space-x-3">
                                            {powerups.map((powerup, index) => (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger>
                                                        <motion.div
                                                            className="relative cursor-pointer"
                                                            onHoverStart={() => setHoveredIndex(index)}
                                                            onHoverEnd={() => setHoveredIndex(null)}
                                                            onClick={() => handlePowerUpClick(powerup.id)} // Trigger API call
                                                        >
                                                            <motion.div
                                                                className={cn(
                                                                    "w-10 h-8 rounded-md  flex items-center justify-center",
                                                                    "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600",
                                                                    powerup.color
                                                                )}
                                                                whileHover={{
                                                                    scale: 1.05,
                                                                }}
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 400,
                                                                    damping: 10,
                                                                }}
                                                            >
                                                                {powerup.icon}
                                                            </motion.div>
                                                            {hoveredIndex === index && (
                                                                <motion.div
                                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                                                                    initial={{
                                                                        scale: 0,
                                                                    }}
                                                                    animate={{
                                                                        scale: 1,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                    }}
                                                                />
                                                            )}
                                                        </motion.div>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="bottom"
                                                        className="bg-gray-800/90 text-white border border-gray-700 p-2 rounded-md"
                                                    >
                                                        <p>{powerup.label}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                    onClick={() => setEditorTheme((theme) => theme === "vs-dark" ? "light" : "vs-dark")}
                                >
                                    {editorTheme === "vs-dark" ? (
                                        <>
                                            <Sun className="w-4 h-4 mr-2" />
                                            Light Mode
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-4 h-4 mr-2" />
                                            Dark Mode
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={executeCode}
                                    disabled={isExecuting || (disableCodeCompilation && powerDownActive)}
                                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                >
                                    {isExecuting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Running
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Code
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                    onClick={() => setCode("")}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear Code
                                </Button>
                            </div>
                        </div>
                        <div className="h-[53vh]">
                            <Editor
                                height="100%"
                                theme={editorTheme}
                                language={language}
                                value={code}
                                defaultValue={defaultCode}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 16,
                                    fontFamily: "'Fira Code', monospace",
                                    padding: { top: 20, bottom: 20 },
                                    minimap: { enabled: false },
                                    scrollbar: {
                                        vertical: "hidden",
                                        horizontal: "visible",
                                    },
                                    wordWrap: "on",
                                    tabSize: 2,
                                    autoIndent: "full",
                                }}
                                className="w-full"
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="border-t border-gray-800 bg-gray-900 rounded-b-xl h-[25vh]"
                        >
                            <div className="h-[calc(25vh-48px)] overflow-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={output}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-4"
                                    >
                                        <pre
                                            className={`${codeError ? "text-red-500" : "text-green-500"} 
                                                font-mono text-sm whitespace-pre-wrap overflow-auto text-left m-0`}
                                            style={{ fontFamily: "JetBrains Mono Variable" }}
                                        >
                                            {output && output.split("\n").map((line, index) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="block"
                                                >
                                                    {index === 0 ? "-> " : "   "}
                                                    {line}
                                                </motion.span>
                                            ))}
                                        </pre>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            
                            <div className="flex justify-end space-x-2 p-2 border-t border-gray-800 bg-gray-800">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Test Cases
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Solution
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="w-[30%] space-y-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 h-[35vh]">
                        <h3 className="text-gray-100 font-semibold mb-4 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Battle Status
                        </h3>
                        
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300">You</span>
                                <div className="flex items-center space-x-2">
                                    <Battery className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-400">3/3 Power-ups</span>
                                </div>
                            </div>
                            <div className="flex space-x-2 mb-2">
                                {[1, 2, 3, 4, 5].map((attempt) => (
                                    <motion.div
                                        key={attempt}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: attempt * 0.1 }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300">Opponent</span>
                                <div className="flex items-center space-x-2">
                                    <Battery className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-400">2/3 Power-ups</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {[1, 2, 3].map((attempt) => (
                                    <motion.div
                                        key={attempt}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: attempt * 0.1 }}
                                    >
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 h-[calc(56vh-3rem)]">
                        <h3 className="text-gray-100 font-semibold mb-2 flex items-center">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Battle Chat
                        </h3>
                        
                        <div className="h-[calc(100%-5rem)] overflow-y-auto mb-2 space-y-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800/50 rounded-lg p-3"
                            >
                                <div className="flex items-center mb-1">
                                    <span className="text-blue-400 text-sm font-medium">You</span>
                                    <span className="text-gray-500 text-xs ml-2">12:34 PM</span>
                                </div>
                                <p className="text-gray-300 text-sm">Good luck!</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800/50 rounded-lg p-3"
                            >
                                <div className="flex items-center mb-1">
                                    <span className="text-green-400 text-sm font-medium">Opponent</span>
                                    <span className="text-gray-500 text-xs ml-2">12:35 PM</span>
                                </div>
                                <p className="text-gray-300 text-sm">Thanks, you too!</p>
                            </motion.div>
                        </div>

                        <div className="flex space-x-2">
                            <Input
                                className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                                placeholder="Type your message..."
                            />
                            <Button
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CodingEnvironment;
