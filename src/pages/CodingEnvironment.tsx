import { Editor } from '@monaco-editor/react';
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

export const CodingEnvironment = () => {
    const [code, setCode] = React.useState("");
    const [language, setLanguage] = React.useState("python");
    const [output, setOutput] = React.useState("");
    const [isExecuting, setIsExecuting] = React.useState(false);

    const languages = [
        { value: "python", label: "Python", version: "3.10.0" },
        { value: "javascript", label: "JavaScript", version: "18.15.0" },
        { value: "java", label: "Java", version: "15.0.2" }
    ];

    const executeCode = async () => {
        setIsExecuting(true);
        setOutput("Executing...");

        const selectedLang = languages.find(lang => lang.value === language);

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
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
                        {/* Controls Bar */}
                        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                                    {languages.map(lang => (
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

                            <Button
                                variant="outline"
                                onClick={executeCode}
                                disabled={isExecuting}
                                className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-100"
                            >
                                {isExecuting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Running
                                    </>
                                ) : (
                                    'Run'
                                )}
                            </Button>
                        </div>

                        {/* Editor Container */}
                        <div className="h-[60vh]">
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language={language}
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 16,
                                    fontFamily: "'Fira Code', monospace",
                                    padding: { top: 20, bottom: 20 },
                                    minimap: { enabled: false },
                                    scrollbar: {
                                        vertical: "visible",
                                        horizontal: "visible",
                                    },
                                    wordWrap: "on",
                                    tabSize: 2,
                                }}
                                className="w-full"
                            />
                        </div>

                        {/* Output Section */}
                        <div className="border-t border-gray-800 p-4">
                            <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap max-h-[20vh] overflow-auto">
                                {output || 'Run your code to see the output here...'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingEnvironment;