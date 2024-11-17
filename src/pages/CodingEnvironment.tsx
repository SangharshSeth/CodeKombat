import {Editor} from '@monaco-editor/react';
import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Loader2, Moon, Sun} from 'lucide-react';
import {useLocation} from "react-router-dom";
import {FaClock} from 'react-icons/fa'
import {Languages} from "@/constants.ts";
import {PISTON_CODE_EXECUTOR} from "@/api.ts";

export const CodingEnvironment = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [timer, setTimer] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [editorTheme, setEditorTheme] = useState("vs-dark")

    const location = useLocation();
    const data = location.state || {};
    console.log("MATCH DATA", data);

    useEffect(() => {
        // Ensure matchData and difficulty exist
        const savedTimer = localStorage.getItem('timer');
        const savedTimeLeft = localStorage.getItem('timeLeft');
        if (savedTimer && savedTimeLeft) {
            setTimer(parseInt(savedTimer, 10));
            setTimeLeft(parseInt(savedTimeLeft, 10));
        } else if (data.matchData?.difficulty) {
            let timerValue = 0;
            switch (data.matchData.difficulty) {
                case "Easy":
                    timerValue = 30;
                    break;
                case "Medium":
                    timerValue = 60;
                    break;
                case "Hard":
                    timerValue = 90;
                    break;
                default:
                    console.error("Unknown difficulty");
            }
            setTimer(timerValue);
            localStorage.setItem("timer", JSON.stringify(timerValue));
            setTimeLeft(timer * 60)
        }
    }, [data.matchData?.difficulty]);


    const formatTime = useCallback(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, [timeLeft])


    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerInterval = setInterval(() => {
            setTimeLeft((prevState) => {
                if (prevState <= 0) {
                    clearInterval(timerInterval);
                    return 0;
                }
                localStorage.setItem('timeLeft', JSON.stringify(prevState));
                return prevState - 1;
            });
        }, 1000)
        return () => {
            clearInterval(timerInterval)
        }
    }, [timeLeft]);

    const executeCode = async () => {
        setIsExecuting(true);
        setOutput("Executing...");

        const selectedLang = Languages.find(lang => lang.value === language);

        try {
            const response = await fetch(PISTON_CODE_EXECUTOR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: language,
                    version: selectedLang?.version,
                    files: [{
                        content: code
                    }]
                })
            });

            const data = await response.json();
            setOutput(data.run?.output || data.message || 'No output');
        } catch (error) {
            setOutput(`Error: ${error}`);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-[90%] mx-auto">
                <div className="w-3/4">
                    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                        <div className="flex items-center p-4 bg-gray-900 border-b border-gray-800">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                                    <SelectValue placeholder="Language"/>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                                    {Languages.map(lang => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                            className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700 focus:text-gray-100"
                                        >
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2 ml-auto text-gray-100">
                                {/* Clock Icon and Timer */}
                                <FaClock className="w-6 h-46animate-pulse"/>
                                <p className="font-mono">{formatTime()}</p>
                            </div>
                            {/* Buttons Group */}
                            <div className="flex space-x-2 ml-auto">
                                <Button variant="outline"
                                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                        onClick={() => setEditorTheme(() => {
                                            if (editorTheme === "vs-dark") return "light";
                                            else return "vs-dark";
                                        })}>
                                    {editorTheme === "vs-dark" ? <Sun className="h-4 w-4"/> : <Moon />}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={executeCode}
                                    disabled={isExecuting}
                                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                >
                                    {isExecuting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                            Running
                                        </>
                                    ) : (
                                        'Run'
                                    )}
                                </Button>
                                <Button
                                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                                    onClick={() => {
                                        setCode("");
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                        {/* Editor Container */}
                        <div className="h-[60vh]">
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language={language}
                                value={code}
                                defaultValue={'printf("Hello World")'}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 16,
                                    fontFamily: "'Fira Code', monospace",
                                    padding: {top: 20, bottom: 20},
                                    minimap: {enabled: false},
                                    theme: editorTheme,
                                    scrollbar: {
                                        vertical: "hidden",
                                        horizontal: "visible",
                                    },
                                    wordWrap: "on",
                                    tabSize: 2,
                                }}
                                className="w-full"
                            />
                        </div>

                        {/* Output Section */}
                        <div
                            className="border-t border-gray-800 pt-4 pl-2 pb-16 bg-gray-900 rounded-lg max-h-[20vh] overflow-auto">
                            <pre
                                className="text-gray-100 font-mono text-sm whitespace-pre-wrap overflow-auto text-left m-0">
                                {`->\t`}{output || 'Run your code to see the output here...'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingEnvironment;