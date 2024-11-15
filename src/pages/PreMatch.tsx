import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Search, X } from 'lucide-react';
import MatchFoundScreen from '../components/MatchFound';

const MatchSetupScreen = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [matchFound, setMatchFound] = useState(false);
  const [matchData, setMatchData] = useState('');

  const languages = ['Python', 'JavaScript', 'Java', 'C++', 'Ruby'];
  const categories = ['DSA', 'Web Dev', 'System Design', 'Database'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSearch = () => {
    if (selectedLanguage && selectedCategory && selectedDifficulty) {
      setIsSearching(true);
      fetch('http://localhost:3000/api/find-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programmingLanguage: selectedLanguage,
          topic: selectedCategory,
        }),
      }).then((res) => res.json())
        .then((data) => {
          console.log(data);
          setIsSearching(false);
          setMatchFound(true);
          console.log(matchFound)
          setMatchData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">CodeDuel</span>
          </div>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {matchFound ? (
            <MatchFoundScreen matchData={matchData} onCancel={() => setMatchFound(false)} />
          ) : isSearching ? (
            /* Searching Screen */
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto mb-8"
                >
                  <Search className="w-24 h-24 text-blue-500" />
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
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1 bg-blue-500 rounded-full"
                />

                <button
                  onClick={() => setIsSearching(false)}
                  className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            /* Setup Screen */
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Choose Your Battle</h2>
                <p className="text-gray-400">Select your preferences to find the perfect opponent</p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Language Selection */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Programming Language</h3>
                  <div className="flex flex-wrap gap-3">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedLanguage === lang
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700/50 hover:bg-gray-600/50'
                        }`}
                      >
                        {lang}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category Selection */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Challenge Category</h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700/50 hover:bg-gray-600/50'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-3">
                    {difficulties.map((difficulty) => (
                      <motion.button
                        key={difficulty}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700/50 hover:bg-gray-600/50'
                        }`}
                      >
                        {difficulty}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Find Match Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                disabled={!selectedLanguage || !selectedCategory || !selectedDifficulty}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
                  selectedLanguage && selectedCategory && selectedDifficulty
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                Find Match
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MatchSetupScreen;