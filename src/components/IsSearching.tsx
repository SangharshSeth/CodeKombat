import {motion} from "framer-motion";
import {Search} from "lucide-react";


interface SearchingData {
    selectedCategory: string
    selectedDifficulty: string
}

interface IsSearchingProps {
    searchingProps: SearchingData;
    onCancel: () => void
}

export const IsSearching = ({searchingProps, onCancel}: IsSearchingProps) => {
    return (
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
            <p className="text-gray-400 mb-6">
                Matching you with a worthy challenger...
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-3 py-1 bg-purple-500/10 rounded-full text-sm text-purple-300">
                {searchingProps.selectedCategory}
              </span>
                <span className="px-3 py-1 bg-green-500/10 rounded-full text-sm text-green-300">
                {searchingProps.selectedDifficulty}
              </span>
            </div>

            <motion.div
                initial={{width: "0%"}}
                animate={{width: "100%"}}
                transition={{duration: 2, repeat: Infinity}}
                className="h-1 bg-blue-500 rounded-full"
            />

            <button
                onClick={onCancel}
                className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
                Cancel
            </button>
        </div>
    </motion.div>)
}