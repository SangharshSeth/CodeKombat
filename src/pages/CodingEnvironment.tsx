import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Clock,
  Download,
  Eye,
  Loader2,
  MessageCircle,
  Moon,
  Play,
  Send,
  Sun,
  Swords,
  Trash2,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Languages } from "@/constants.ts";
import { PISTON_CODE_EXECUTOR } from "@/api.ts";
import { Toaster } from "@/components/ui/toaster.tsx";
import { AnimatePresence, motion } from "framer-motion";
// @ts-expect-error: some error
import '@fontsource-variable/jetbrains-mono';
import { cn } from "@/lib/utils.ts";
import useStore from "@/store/websocketStore.ts";
import { DefaultValues } from "@/comments.ts";
import { Input } from "@/components/ui/input";
import "monaco-themes/themes/Monokai Bright.json";
import { IMatchData } from "@/pages/PreMatch.tsx";
import { TimeUpModal } from "@/components/TimeUpModal.tsx";
import OpponentCodeModal from "../components/OpponentCodeModal";
import {getCurrentTime, getInitials} from "@/utils/misc.ts";

interface CodeExecutionResult {
  run: {
    code: number;
    output?: string;
  };
  message?: string;
}

export interface Message {
  content: string;
  timeStamp: string;
  sender: string;
  isFromMe?: boolean;
  roomId: string;
}

 const CodingEnvironment: React.FC<object> = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [codeError, setCodeError] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [isViewingOpponentCode, setIsViewingOpponentCode] = useState(false);
  const [showOpponentCode, setShowOpponentCode] = useState(false);
  const [opponentCode, setOpponentCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem("timeLeft");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [chatMessagesContainer, setChatMessagesContainer] = useState<Message[]>(
    []
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const monaco = useMonaco();
  const location = useLocation();
  const data: IMatchData = location.state.matchData || {};
  const [defaultCode, setDefaultCode] = useState(() =>
    DefaultValues("python", data?.question?.description)
  );

  //Get websocket instance from zustand state
  const socket = useStore((state) => state.webSocket);
  const setUpTimer = () => {
    const difficulty = data?.question?.difficulty;
    console.log("Difficulty", difficulty)
    if (!difficulty || sessionStorage.getItem("timeLeft")) return;

    let timerValue = 0;

    switch (difficulty) {
      case "easy":
        timerValue = 30 * 60;
        break;
      case "medium" :
        timerValue = 60 * 60;
        break;
      case "hard":
        timerValue = 90 * 60;
        break;
      default:
        console.error("Unknown difficulty");
        return;
    }
    setTimeLeft(timerValue);
    sessionStorage.setItem("timeLeft", timerValue.toString());
  };
  //Timer based on difficulty
  useEffect(() => {

    setUpTimer();
    if (timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timerInterval);
          sessionStorage.removeItem("timeLeft");
          setShowTimeUpModal(true);
          audioRef.current
            ?.play()
            .catch((e) => console.log("Audio play error:", e));
          return 0;
        }
        sessionStorage.setItem("timeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [data?.question?.difficulty, timeLeft]);

  // Calculate the maximum time based on the difficulty
  useMemo(() => {
    const difficulty = data?.question?.difficulty;
    switch (difficulty) {
      case "easy":
        return 30 * 60; // 30 minutes
      case "medium":
        return 60 * 60; // 60 minutes
      case "hard":
        return 90 * 60; // 90 minutes
      default:
        return 90 * 60; // Default to 90 minutes if unknown
    }
  }, [data?.question?.difficulty]);
//Custom themes
  useEffect(() => {
    if (monaco) {
      import("monaco-themes/themes/GitHub Dark.json")
        .then((data) => {
          monaco.editor.defineTheme("github-dark", data as never);
        })
        .then(() => monaco.editor.setTheme("github-dark"));
    }
    const newDefaultCode = DefaultValues(language, data?.question?.description);
    setDefaultCode(newDefaultCode);
    setCode(newDefaultCode); // Optionally reset the editor's code
  }, [monaco, language, data?.question?.description]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessagesContainer]);

  const formatTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [timeLeft]);

  const executeCode = async () => {
    setIsExecuting(true);
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


  const handleSendMessage = () => {
    if (!newChatMessage.trim()) return;

    const messageObject: Message = {
      roomId: data.roomId,
      sender: data.userName,
      content: newChatMessage,
      timeStamp: getCurrentTime(),
    };
    setChatMessagesContainer((prev) => [...prev, messageObject]);
    console.log(data);
    socket?.emit("chat-message", messageObject);
    setNewChatMessage("");
  };



  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: { content: string; sender: string }) => {
      console.log("Chat Message Received", message);
      const receivedMessage: Message = {
        sender: message.sender,
        content: message.content,
        timeStamp: getCurrentTime(),
        roomId: data.roomId,
      };
      setChatMessagesContainer((prev) => [...prev, receivedMessage]);
      audioRef.current
        ?.play()
        .catch((e) => console.log("Audio play error:", e));
    };
    const handleShowCode = () => {
      // console.log("Received request from server to show code");
      // console.log(`Sending code to websocket ${code}`);
      socket.emit("showing-code", code);
    };

    socket.on("new-chat-message", handleNewMessage);
    socket.on("show-code", handleShowCode);
    socket?.on("take-code", (code) => {
      setOpponentCode(code);
      setShowOpponentCode(true);

      // Set a timeout to close the modal after 15 seconds
      const timer = setTimeout(() => {
        setShowOpponentCode(false);
      }, 15000);

      // Clear the timeout if the component unmounts or if the modal is closed
      return () => clearTimeout(timer);
    });

    return () => {
      socket.off("new-chat-message", handleNewMessage);
      socket.off("show-code", handleShowCode);
      socket?.off("take-code");
    };
  }, [socket, data.roomId, code]);

  const handleViewOpponentCode = () => {
    setIsViewingOpponentCode(true);
    socket?.emit("view-code");
    setTimeout(() => {
      setIsViewingOpponentCode(false);
    }, 15000);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 flex flex-col">
      <audio ref={audioRef} src="/notification.mp3" />
      <Toaster />
      <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className="max-w-[95%] mx-auto flex gap-4"
      >
        <div className="w-[30%] h-[calc(100vh-6rem)] flex flex-col space-y-4 overflow-hidden">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 h-2/3 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-100 font-semibold flex items-center">
                <Swords className="w-4 h-4 mr-2 text-purple-400"/>
                Battle Status
              </h3>
            </div>

            <div className="mb-6">
              <motion.div
                  className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2"
                  whileHover={{scale: 1.02}}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                  >
                    <Clock
                        className={cn(
                            "w-4 h-4",
                            timeLeft <= 300 ? "text-red-400" : "text-purple-400"
                        )}
                    />
                  </motion.div>
                  <span
                      className={cn(
                          "text-sm",
                          timeLeft <= 300 ? "text-red-400" : "text-purple-400"
                      )}
                  >
                {formatTime}
              </span>
                </div>
                <motion.div
                    animate={{
                      scale: timeLeft <= 300 ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: timeLeft <= 300 ? Infinity : 0,
                    }}
                    className={cn(
                        "h-1.5 rounded-full bg-gray-700 w-24",
                        "overflow-hidden"
                    )}
                >
                  <motion.div
                      className={cn(
                          "h-full rounded-full",
                          timeLeft <= 300 ? "bg-red-500" : "bg-purple-500"
                      )}
                      initial={{width: "100%"}}
                      animate={{width: `${(timeLeft / (90 * 60)) * 100}%`}}
                      transition={{duration: 1}}
                  />
                </motion.div>
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* Problem Title and Difficulty */}
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-100">
                  {data?.question?.title}
                </h4>
                <span
                    className={cn(
                        "px-3 py-1 text-xs font-medium rounded-full",
                        {
                          "bg-green-500/10 text-green-500": data?.question?.difficulty === "easy",
                          "bg-orange-500/10 text-orange-500": data?.question?.difficulty === "medium",
                          "bg-red-500/10 text-red-500": data?.question?.difficulty === "hard",
                        }
                    )}
                >
              {data?.question?.difficulty || "No difficulty specified."}
            </span>
              </div>

              {/* Problem Description */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data?.question?.description || "No problem description available."}
                </p>
              </div>

              {/* Example Test Cases */}
              <div>
                <h4 className="text-gray-100 font-semibold mb-3 text-sm">Example</h4>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <ul className="space-y-4">
                    {data?.question?.testCases.slice(0, 1).map((testCase, index) => (
                        <li key={index}>
                          <div className="space-y-2">
                            <div>
                              <span className="text-gray-400 text-sm">Input: </span>
                              <code className="text-sm text-gray-200">
                                {JSON.stringify(testCase.input)}
                              </code>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Output: </span>
                              <code className="text-sm text-gray-200">
                                {JSON.stringify(testCase.output)}
                              </code>
                            </div>
                            {testCase.explanation && (
                                <div style={{fontFamily: "Inter Variable"}}>
                                  <span className="text-gray-400 text-sm">Explanation: </span>
                                  <code className="text-sm text-gray-200">
                                    {testCase.explanation}
                                  </code>
                                </div>
                            )}
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h4 className="text-gray-100 font-semibold mb-3 text-sm">Constraints:</h4>
                <div className="bg-gray-800/30 rounded-lg p-4">
              <pre className="text-sm text-gray-200 whitespace-pre-wrap" style={{fontFamily: "Inter Variable"}}>
                {data?.question?.constraints}
              </pre>
                </div>
              </div>
            </div>
          </div >

          <div className="bg-gray-900 rounded-xl border border-gray-800 h-1/3 p-4">
            <h3 className="text-gray-100 font-semibold mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2"/>
              Battle Chat
            </h3>

            <div
                ref={chatContainerRef}
                className="h-[calc(100%-5rem)] overflow-y-auto mb-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
            >
              {chatMessagesContainer.map((message, index) => {
                const isMyMessage = message.sender === data.userName;
                return (
                    <motion.div
                        key={index}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className={`flex items-start gap-3 ${
                            isMyMessage ? "flex-row" : "flex-row-reverse"
                        }`}
                    >
                      <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isMyMessage ? "bg-blue-500/20" : "bg-purple-500/20"
                          }`}
                      >
                  <span
                      className={`text-sm font-medium ${
                          isMyMessage ? "text-blue-400" : "text-purple-400"
                      }`}
                  >
                    {getInitials(message.sender)}
                  </span>
                      </div>
                      <div
                          className={`flex flex-col ${
                              isMyMessage ? "items-start" : "items-end"
                          } max-w-[70%]`}
                      >
                        <div
                            className={`rounded-lg p-3 ${
                                isMyMessage
                                    ? "bg-blue-500/20 text-blue-100"
                                    : "bg-purple-500/20 text-purple-100"
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-gray-500 text-xs mt-1">
                    {message.timeStamp}
                  </span>
                      </div>
                    </motion.div>
                );
              })}
            </div>

            <div className="flex space-x-2">
              <Input
                  className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                  placeholder="Type your message..."
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
              />
              <Button
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSendMessage}
              >
                <Send className="w-4 h-4"/>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[70%] h-[calc(100vh - 6rem)] flex flex-col">
          {/* Action Bar */}
          <div className="bg-gray-900 p-4 border-b rounded-md shadow-md border-gray-800">
            <div className="flex flex-wrap items-center">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="Language"/>
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
              <div className="flex space-x-2 ml-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                    onClick={() =>
                        setEditorTheme((theme) =>
                            theme === "vs-dark" ? "light" : "vs-dark"
                        )
                    }
                >
                  {editorTheme === "vs-dark" ? (
                      <>
                        <Sun className="w-4 h-4 mr-2 text-amber-400"/>
                        Light Mode
                      </>
                  ) : (
                      <>
                        <Moon className="w-4 h-4 mr-2 text-indigo-400"/>
                        Dark Mode
                      </>
                  )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={executeCode}
                    disabled={isExecuting}
                    className={cn(
                        "bg-gray-800 border-gray-700",
                        "hover:bg-gray-700 hover:border-gray-600",
                        "text-gray-100",
                        isExecuting ? "opacity-70" : ""
                    )}
                >
                  {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 text-blue-400 animate-spin"/>
                        Running
                      </>
                  ) : (
                      <>
                        <Play className="w-4 h-4 mr-2 text-emerald-400"/>
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
                  <Trash2 className="w-4 h-4 mr-2 text-red-400"/>
                  Clear Code
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                >
                  <Download className="w-4 h-4 mr-2 text-purple-400"/>
                  Test Cases
                </Button>
                <div className="relative group">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewOpponentCode}
                      disabled={isViewingOpponentCode}
                      className={cn(
                          "bg-gray-800 border-gray-700",
                          "hover:bg-gray-700 hover:border-gray-600",
                          "text-gray-100",
                          isViewingOpponentCode ? "opacity-70" : ""
                      )}
                  >
                    <Eye
                        className={cn(
                            "w-4 h-4 mr-2",
                            isViewingOpponentCode
                                ? "text-gray-400"
                                : "text-orange-400"
                        )}
                    />
                    {isViewingOpponentCode ? "Viewing..." : "View Code"}
                  </Button>
                  <div
                      className={cn(
                          "absolute top-full left-1/2 -translate-x-1/2 mt-2",
                          "px-3 py-2 rounded-lg",
                          "bg-gray-900 border border-gray-700",
                          "text-xs text-gray-300",
                          "whitespace-nowrap shadow-lg",
                          "opacity-0 group-hover:opacity-100",
                          "transition-opacity duration-200",
                          "pointer-events-none z-50"
                      )}
                  >
                    <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2
                              w-2 h-2 bg-gray-900 rotate-45 border-t border-l border-gray-700"
                    />
                    Power-up: See opponent's code for 15 seconds
                  </div>
                </div>
                <Button
                    size="sm"
                    className={cn(
                        "bg-blue-600 hover:bg-blue-700 text-white",
                        "border border-blue-500",
                        "shadow-sm shadow-blue-500/20"
                    )}
                >
                  <Send className="w-4 h-4 mr-2 text-blue-100"/>
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Editor and Output Container */}
          <div className="flex-grow flex flex-col">
            {/* Code Editor */}
            <div className="flex-grow" style={{height: "60%"}}>
              <Editor
                  height="100%"
                  theme={editorTheme}
                  language={language}
                  value={code}
                  defaultValue={defaultCode}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    fontSize: 16,
                    fontFamily: "Fira Code",
                    padding: {top: 20, bottom: 20},
                    minimap: {enabled: false},
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

            {/* Output Section */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
                className="border-t border-gray-800 bg-gray-900 rounded-b-xl"
                style={{height: "30%"}}
            >
              <div className="h-full overflow-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                      key={output}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: -20}}
                      transition={{duration: 0.3}}
                      className="p-4"
                  >
                    {output && (
                        <div className="space-y-2">
                          {output
                              .split("\n")
                              .filter((line) => line.trim() !== "")
                              .slice(0, 4)
                              .map((line, index) => (
                                  <motion.div
                                      key={index}
                                      initial={{opacity: 0, x: -20}}
                                      animate={{opacity: 1, x: 0}}
                                      transition={{duration: 0.3, delay: index * 0.1}}
                                      className={cn(
                                          "rounded-lg p-2",
                                          codeError ? "bg-red-500/10" : "bg-green-500/10",
                                          "border",
                                          codeError
                                              ? "border-red-500/20"
                                              : "border-green-500/20"
                                      )}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div
                                          className={cn(
                                              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                                              codeError
                                                  ? "bg-red-500/20"
                                                  : "bg-green-500/20"
                                          )}
                                      >
                                        {codeError ? (
                                            <X className="w-3 h-3 text-red-400"/>
                                        ) : (
                                            <Check className="w-3 h-3 text-green-400"/>
                                        )}
                                      </div>
                                      <pre
                                          className={cn(
                                              "text-sm whitespace-pre-wrap overflow-auto text-left m-0 flex-1",
                                              codeError
                                                  ? "text-red-400"
                                                  : "text-green-400"
                                          )}
                                          style={{
                                            fontFamily: "JetBrains Mono Variable",
                                          }}
                                      >
                                  {line}
                                </pre>
                                    </div>
                                  </motion.div>
                              ))}
                        </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      {showTimeUpModal && <TimeUpModal code={code}/>}
      <OpponentCodeModal
          code={opponentCode}
          isOpen={showOpponentCode}
          onClose={() => setShowOpponentCode(false)}
      />
    </div>
  );
};
export default CodingEnvironment;
