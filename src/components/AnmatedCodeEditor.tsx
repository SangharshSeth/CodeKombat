import {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
// @ts-expect-error: some-error
import '@fontsource-variable/jetbrains-mono';

const codeSnippet = `function challengeAccepted() {
  const skills = ['coding', 'problem-solving', 'creativity'];
  const determination = 100;
  
  while (determination > 0) {
    skills.forEach(skill => improve(skill));
    const result = solveChallenge(challenge);
    
    if (result.success) {
      celebrate();
    } else {
      learnFromMistakes();
    }
  }
}

challengeAccepted();`

const syntaxHighlight = (code: string) => {
    return code.replace(
        /(\b(function|const|let|var|if|else|while|for|return)\b)|\b(\d+)\b|(['"`].*?['"`])|(\b(true|false)\b)/g,
        (match, keyword, _, number, string, boolean) => {
            if (keyword) return `<span class="text-purple-400">${match}</span>`
            if (number) return `<span class="text-yellow-400">${match}</span>`
            if (string) return `<span class="text-green-400">${match}</span>`
            if (boolean) return `<span class="text-blue-400">${match}</span>`
            return match
        }
    )
}

export default function AnimatedCodeEditor() {
    const [displayedCode, setDisplayedCode] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < codeSnippet.length) {
            const timer = setTimeout(() => {
                setDisplayedCode(prevCode => prevCode + codeSnippet[currentIndex])
                setCurrentIndex(prevIndex => prevIndex + 1)
            }, 20) // Adjust typing speed here

            return () => clearTimeout(timer)
        }
    }, [currentIndex])

    return (
        <motion.div className="w-full max-w-3xl mx-auto bg-gray-800 rounded-md shadow-md overflow-hidden"
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}>
            {/* Window Decoration with Animation */}
            <motion.div
                className="flex items-center justify-start p-3 bg-gray-900"
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{duration: 0.5}}
            >
                <div className="flex space-x-2">
                    <motion.div
                        className="w-3 h-3 rounded-full bg-red-500"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.2}}
                        aria-hidden="true"
                    />
                    <motion.div
                        className="w-3 h-3 rounded-full bg-yellow-500"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4}}
                        aria-hidden="true"
                    />
                    <motion.div
                        className="w-3 h-3 rounded-full bg-green-500"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6}}
                        aria-hidden="true"
                    />
                </div>
            </motion.div>

            {/* Animated Code Block */}
            <motion.div
                className="p-6 font-mono text-sm text-gray-300 h-[400px] overflow-hidden"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
            >
                <pre className="whitespace-pre-wrap">
                    <code
                        style={{fontFamily: "JetBrains Mono Variable"}}
                        dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(displayedCode)
                        }}
                    />
                </pre>
            </motion.div>
        </motion.div>
    )
}
