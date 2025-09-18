import { motion } from 'framer-motion';
import { Code, Terminal, FileCode, Braces } from 'lucide-react';
import { useEffect, useState } from 'react';

const CodeBackground = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const codeSnippets = [
    `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
    `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    let prev = null;
    let current = head;
    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}`,
    `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-slate-900 text-white p-12 relative overflow-hidden">
      {/* Animated code symbols in background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[10%] left-[15%] animate-pulse">
          <Braces size={40} />
        </div>
        <div className="absolute top-[30%] left-[80%] animate-pulse delay-300">
          <FileCode size={50} />
        </div>
        <div className="absolute top-[70%] left-[20%] animate-pulse delay-700">
          <Terminal size={45} />
        </div>
        <div className="absolute top-[60%] left-[75%] animate-pulse delay-500">
          <Code size={55} />
        </div>
        <div className="absolute top-[85%] left-[45%] animate-pulse delay-200">
          <Braces size={35} />
        </div>
        <div className="absolute top-[15%] left-[60%] animate-pulse delay-100">
          <Terminal size={30} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 max-w-md flex flex-col items-center"
      >
        {/* Code editor mockup */}
        <div className="w-full bg-slate-800 rounded-lg shadow-xl mb-8 overflow-hidden">
          {/* Editor header */}
          <div className="bg-slate-700 px-4 py-2 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <motion.span
              key="problem.js"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-2 text-sm text-white/70 font-mono"
            >
              problem.js
            </motion.span>
          </div>

          {/* Code content */}
          <div className="p-4 font-mono text-xs sm:text-sm overflow-hidden relative h-[405px]">
            <pre className="whitespace-pre-wrap text-green-400 transition-opacity duration-1000">
              {codeSnippets[activeIndex]}
            </pre>

            {/* Blinking cursor */}
            <div className="absolute bottom-4 right-4 w-2 h-4 bg-white animate-blink"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10  flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
          <div className="mb-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl font-bold mb-4 text-center"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-slate-300 text-center"
            >
              {subtitle}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CodeBackground;
