import { Check, Zap, Clock, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function CodeSnippet() {
  return (
    <div className="relative mx-auto max-w-xl">
      {/* Test Status - Realistic IDE-style */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
        className="absolute -right-6 top-3 z-10"
      >
        <div className="relative">
          {/* Main test status card */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-green-400/30 bg-gradient-to-r from-green-900/80 to-green-800/80 p-2 shadow-xl backdrop-blur-sm">
            {/* Header with icon and title */}
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, duration: 0.3, type: "spring", stiffness: 300 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500"
              >
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </motion.div>
              <span className="text-sm font-medium text-green-100">All tests passed</span>
            </div>
            
            {/* Test details */}
            <div className="flex items-center gap-3 text-xs text-green-200/80">
              <div className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                <span>3/3 tests</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>12ms</span>
              </div>
            </div>
            
            {/* Success indicator line */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
              className="h-0.5 rounded-full bg-green-400"
            />
          </div>
          
          {/* Subtle glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="absolute inset-0 rounded-lg bg-green-500/20 blur-md -z-10"
          />
          
          {/* Pulsing dot indicator */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400"
          />
        </div>
      </motion.div>

      {/* Code Window with Glassmorphism */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
        {/* Window Header */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <span className="ml-2 text-sm text-white/70">two_sum.py</span>
        </div>

        {/* Code Content */}
        <div className="p-4 font-mono text-sm">
          <div className="space-y-1">
            <div>
              <span className="text-codeflow-blue">def</span>{" "}
              <span className="text-codeflow-yellow">two_sum</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">nums</span>
              <span className="text-white">, </span>
              <span className="text-orange-400">target</span>
              <span className="text-white">):</span>
            </div>
            
            <div className="pl-4">
              <span className="text-orange-400">hash_map</span>
              <span className="text-white"> = {}</span>
            </div>
            
            <div className="pl-4">
              <span className="text-codeflow-blue">for</span>
              <span className="text-white"> </span>
              <span className="text-orange-400">i</span>
              <span className="text-white">, </span>
              <span className="text-orange-400">num</span>
              <span className="text-white"> </span>
              <span className="text-codeflow-blue">in</span>
              <span className="text-white"> </span>
              <span className="text-codeflow-purple">enumerate</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">nums</span>
              <span className="text-white">):</span>
            </div>
            
            <div className="pl-8">
              <span className="text-orange-400">complement</span>
              <span className="text-white"> = </span>
              <span className="text-orange-400">target</span>
              <span className="text-white"> - </span>
              <span className="text-orange-400">num</span>
            </div>
            
            <div className="pl-8">
              <span className="text-codeflow-blue">if</span>
              <span className="text-white"> </span>
              <span className="text-orange-400">complement</span>
              <span className="text-white"> </span>
              <span className="text-codeflow-blue">in</span>
              <span className="text-white"> </span>
              <span className="text-orange-400">hash_map</span>
              <span className="text-white">:</span>
            </div>
            
            <div className="pl-12">
              <span className="text-codeflow-blue">return</span>
              <span className="text-white"> [</span>
              <span className="text-orange-400">hash_map</span>
              <span className="text-white">[</span>
              <span className="text-orange-400">complement</span>
              <span className="text-white">], </span>
              <span className="text-orange-400">i</span>
              <span className="text-white">]</span>
            </div>
            
            <div className="pl-8">
              <span className="text-orange-400">hash_map</span>
              <span className="text-white">[</span>
              <span className="text-orange-400">num</span>
              <span className="text-white">] = </span>
              <span className="text-orange-400">i</span>
            </div>
          </div>
        </div>

        {/* Runtime Badge */}
        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 backdrop-blur-sm">
              <Zap className="h-3 w-3 text-codeflow-yellow" />
              <span className="text-white/80">O(n)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
