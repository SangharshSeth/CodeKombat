import { ArrowRight, Brain, Code2,SquareFunctionIcon,SquareTerminal,SquareTerminalIcon, Globe, Timer, Trophy } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FeatureCard } from "../components/Feature.tsx";
import { MdEmail } from "react-icons/md";
import '@fontsource-variable/jetbrains-mono';
// Supports weights 100-900
import '@fontsource-variable/inter';
// Supports weights 300-700
import '@fontsource-variable/fira-code';
import {Link, useNavigate} from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (): void => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white" style={{fontFamily: "Inter Variable"}} >
      {/*/!* Navigation *!/*/}
      {/*<nav className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm z-50 px-6 py-4 flex justify-between items-center shadow-md">*/}
      {/*  <Link to="/">*/}
      {/*    <div className="flex items-center space-x-2">*/}
      {/*      <SquareTerminalIcon className="w-8 h-8 text-blue-400"/>*/}
      {/*      <span className="text-xl font-bold" style={{fontFamily: "JetBrains Mono Variable"}}>Printf();</span>*/}
      {/*    </div>*/}
      {/*  </Link>*/}

      {/*  <div className="flex items-center space-x-6">*/}
      {/*    <a href="#features" className="hover:text-blue-400 transition-colors">*/}
      {/*      Features*/}
      {/*    </a>*/}
      {/*    <button*/}
      {/*      type="button"*/}
      {/*      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"*/}
      {/*    >*/}
      {/*      Get Started*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</nav>*/}

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Challenge. Code. Conquer.
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Join the ultimate coding battleground. Face off against developers
            worldwide in real-time coding challenges. Improve your skills, climb
            the ranks, and become a coding champion.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSubmit}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <span>Start Coding Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <FaGithub className="w-5 h-5" />

              <span>Sign in with GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Multi-Language Support"
            description="Choose from Python, JavaScript, Java, C++, and more. Code in your preferred language while battling opponents using theirs."
            languages={["Python", "JavaScript", "Java", "C++", "Ruby"]}
          />

          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Challenge Categories"
            description="Pick your battlefield: Data Structures & Algorithms, Web Development, System Design, or Database Challenges."
            categories={["DSA", "Web Dev", "System Design", "Database"]}
          />

          <FeatureCard
            icon={<Timer className="w-8 h-8" />}
            title="Real-time Battles"
            description="Watch your opponent's progress in real-time. See their coding approach and try to optimize faster."
            features={["Live Code View", "Progress Bar", "Time Tracking"]}
          />

          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Skill Rankings"
            description="Climb the global leaderboard and earn badges. Separate rankings for each programming language and category."
            rankings={["Global Rank", "Language Rank", "Category Rank"]}
          />
        </div>
      </div>

      {/* Footer */}
      {/*<footer className="border-t border-gray-800">*/}
      {/*  <div className="container mx-auto px-6 py-12">*/}
      {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">*/}
      {/*      <div className="space-y-4">*/}
      {/*        <div className="flex items-center space-x-2">*/}
      {/*          <Code2 className="w-6 h-6 text-blue-500" />*/}
      {/*          <span className="text-lg font-bold">CodeDuel</span>*/}
      {/*        </div>*/}
      {/*        <p className="text-gray-400 text-sm">*/}
      {/*          Challenge yourself and others in real-time coding battles.*/}
      {/*        </p>*/}
      {/*      </div>*/}

      {/*      <div className="space-y-4">*/}
      {/*        <h4 className="text-lg font-semibold">Features</h4>*/}
      {/*        <ul className="space-y-2 text-gray-400">*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              Challenge Categories*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              Programming Languages*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              Live Battles*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              Rankings*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*        </ul>*/}
      {/*      </div>*/}

      {/*      <div className="space-y-4">*/}
      {/*        <h4 className="text-lg font-semibold">Resources</h4>*/}
      {/*        <ul className="space-y-2 text-gray-400">*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              Documentation*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              API Access*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <a href="#" className="hover:text-blue-400 transition-colors">*/}
      {/*              Community*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*          <li>*/}
      {/*            <Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors">*/}
      {/*              Support*/}
      {/*            </Link>*/}
      {/*          </li>*/}
      {/*        </ul>*/}
      {/*      </div>*/}

      {/*      <div className="space-y-4">*/}
      {/*        <h4 className="text-lg font-semibold">Connect</h4>*/}
      {/*        <div className="flex space-x-4">*/}
      {/*          <a*/}
      {/*            href="#"*/}
      {/*            className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"*/}
      {/*          >*/}
      {/*            <FaTwitter className="w-5 h-5" />*/}
      {/*          </a>*/}
      {/*          <a*/}
      {/*            href="#"*/}
      {/*            className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"*/}
      {/*          >*/}
      {/*            <FaGithub className="w-5 h-5" />*/}
      {/*          </a>*/}
      {/*          <a*/}
      {/*            href="#"*/}
      {/*            className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"*/}
      {/*          >*/}
      {/*            <FaLinkedin className="w-5 h-5" />*/}
      {/*          </a>*/}
      {/*          <a*/}
      {/*            href="#"*/}
      {/*            className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"*/}
      {/*          >*/}
      {/*            <MdEmail className="w-5 h-5" />*/}
      {/*          </a>*/}
      {/*        </div>*/}
      {/*        <p className="text-gray-400 text-sm">*/}
      {/*          Stay updated with our latest features and challenges.*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">*/}
      {/*      <p>© 2024 CodeDuel. All rights reserved.</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </div>
  );
};
