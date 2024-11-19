// import { ArrowRight, Brain, Globe, Timer, Trophy } from "lucide-react";
// import { FaGithub } from "react-icons/fa";
// import { FeatureCard } from "../components/Feature.tsx";
// // @ts-ignore
// import '@fontsource-variable/jetbrains-mono';
// // @ts-ignore
// import '@fontsource-variable/inter';
// import { useNavigate} from "react-router-dom";
//
// export const LandingPage = () => {
//   const navigate = useNavigate();
//   const handleSubmit = (): void => {
//     navigate("/app");
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white" style={{fontFamily: "Inter Variable"}} >
//
//       {/* Hero Section */}
//       <div className="container mx-auto px-6 py-32">
//         <div className="text-center max-w-4xl mx-auto">
//           <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
//             Challenge. Code. Conquer.
//           </h1>
//           <p className="text-xl text-gray-300 mb-8">
//             Join the ultimate coding battleground. Face off against developers
//             worldwide in real-time coding challenges. Improve your skills, climb
//             the ranks, and become a coding champion.
//           </p>
//           <div className="flex justify-center space-x-4">
//             <button
//               onClick={handleSubmit}
//               type="button"
//               className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors"
//             >
//               <span>Start Coding Now</span>
//               <ArrowRight className="w-5 h-5" />
//             </button>
//             <button
//               type="button"
//               className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors"
//             >
//               <FaGithub className="w-5 h-5" />
//
//               <span>Sign in with GitHub</span>
//             </button>
//           </div>
//         </div>
//       </div>
//
//       {/* Features Grid Section */}
//       <div className="container mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <FeatureCard
//             icon={<Globe className="w-8 h-8" />}
//             title="Multi-Language Support"
//             description="Choose from Python, JavaScript, Java, C++, and more. Code in your preferred language while battling opponents using theirs."
//             languages={["Python", "JavaScript", "Java", "C++", "Ruby"]}
//           />
//
//           <FeatureCard
//             icon={<Brain className="w-8 h-8" />}
//             title="Challenge Categories"
//             description="Pick your battlefield: Data Structures & Algorithms, Web Development, System Design, or Database Challenges."
//             categories={["DSA", "Web Dev", "System Design", "Database"]}
//           />
//
//           <FeatureCard
//             icon={<Timer className="w-8 h-8" />}
//             title="Real-time Battles"
//             description="Watch your opponent's progress in real-time. See their coding approach and try to optimize faster."
//             features={["Live Code View", "Progress Bar", "Time Tracking"]}
//           />
//
//           <FeatureCard
//             icon={<Trophy className="w-8 h-8" />}
//             title="Skill Rankings"
//             description="Climb the global leaderboard and earn badges. Separate rankings for each programming language and category."
//             rankings={["Global Rank", "Language Rank", "Category Rank"]}
//           />
//         </div>
//       </div>
//
//     </div>
//   );
// };
import { ArrowRight, Brain, Globe, Timer, Trophy } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FeatureCard } from "../components/Feature.tsx";
import { motion } from "framer-motion";
// @ts-ignore
import '@fontsource-variable/jetbrains-mono';
// @ts-ignore
import '@fontsource-variable/inter';
import { useNavigate } from "react-router-dom";
import AnimatedCodeEditor from "@/components/AnmatedCodeEditor.tsx";

export const LandingPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (): void => {
    navigate("/app");
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white" style={{ fontFamily: "Inter Variable" }}>
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
                className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
              Challenge. Code. Conquer.
            </motion.h1>
            <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
            >
              Join the ultimate coding battleground. Face off against developers
              worldwide in real-time coding challenges. Improve your skills, climb
              the ranks, and become a coding champion.
            </motion.p>
            <div className="flex justify-center space-x-4">
              <motion.button
                  onClick={handleSubmit}
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                <span>Start Coding Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                  type="button"
                  className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="w-5 h-5" />
                <span>Sign in with GitHub</span>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatedCodeEditor />

        {/* Features Grid Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
                className="feature-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
              <FeatureCard
                  icon={<Globe className="w-8 h-8" />}
                  title="Multi-Language Support"
                  description="Choose from Python, JavaScript, Java, C++, and more. Code in your preferred language while battling opponents using theirs."
                  languages={["Python", "JavaScript", "Java", "C++", "Ruby"]}
              />
            </motion.div>

            <motion.div
                className="feature-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
              <FeatureCard
                  icon={<Brain className="w-8 h-8" />}
                  title="Challenge Categories"
                  description="Pick your battlefield: Data Structures & Algorithms, Web Development, System Design, or Database Challenges."
                  categories={["DSA", "Web Dev", "System Design", "Database"]}
              />
            </motion.div>

            <motion.div
                className="feature-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
            >
              <FeatureCard
                  icon={<Timer className="w-8 h-8" />}
                  title="Real-time Battles"
                  description="Watch your opponent's progress in real-time. See their coding approach and try to optimize faster."
                  features={["Live Code View", "Progress Bar", "Time Tracking"]}
              />
            </motion.div>

            <motion.div
                className="feature-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
            >
              <FeatureCard
                  icon={<Trophy className="w-8 h-8" />}
                  title="Skill Rankings"
                  description="Climb the global leaderboard and earn badges. Separate rankings for each programming language and category."
                  rankings={["Global Rank", "Language Rank", "Category Rank"]}
              />
            </motion.div>
          </div>
        </div>

      </div>
  );
};