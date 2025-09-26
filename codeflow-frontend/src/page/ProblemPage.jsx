import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Timer,
  Zap,
  AlignLeft,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useProblemStore } from '../store/useProblemStore';
import { getLanguageId } from '../lib/lang';
import { useExecutionStore } from '../store/useExecutionStore';
import { useSubmissionStore } from '../store/useSubmissionStore';
import Submission from '../components/Submission';
import SubmissionsList from '@/components/SubmissionList';
import ExecutionResults from '../components/ExecutionResults';

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedLanguage, setSelectedLanguage] = useState('PYTHON');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);
  const [testTab, setTestTab] = useState('testCases');
  const [isTestPanelExpanded, setIsTestPanelExpanded] = useState(false);

  const editorRef = useRef(null);

  const {
    executeCode,
    runCode,
    submission,
    execution,
    isExecuting,
    isRunning,
  } = useExecutionStore();

  // Default starter templates
  const defaultCodeSnippets = {
    PYTHON: `# Write your Python code here
def solution():
    # Your solution logic here
    pass
`,
    JAVA: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Your solution logic here
        scanner.close();
    }
    static int solution() {
        // Your solution logic here
        return 0;
    }
}`,
    C: `#include <stdio.h>
int solution() {
    // Your solution logic here
    return 0;
}
int main() {
    // Your solution logic here
    return 0;
}`,
    CPP: `#include <iostream>
int solution() {
    // Your solution logic here
    return 0;
}
int main() {
    // Your solution logic here
    return 0;
}`,
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      let parsedCodeSnippets = defaultCodeSnippets;
      try {
        if (problem.codeSnippets) {
          parsedCodeSnippets = typeof problem.codeSnippets === 'string' ? JSON.parse(problem.codeSnippets) : problem.codeSnippets;
        }
      } catch (e) {
        console.error('Failed to parse codeSnippets:', e);
      }
      let lang = selectedLanguage;
      if (!Object.keys(parsedCodeSnippets).includes(lang)) {
        lang = 'PYTHON';
        setSelectedLanguage(lang);
      }
      setCode(parsedCodeSnippets[lang] || defaultCodeSnippets[lang] || '');

      let parsedTestcases = [];
      try {
        parsedTestcases = typeof problem.publicTestcases === 'string' ? JSON.parse(problem.publicTestcases) : problem.publicTestcases || [];
      } catch (e) {
        console.error('Failed to parse publicTestcases:', e);
      }
      setTestCases(parsedTestcases.slice(0, 3).map((tc) => ({
        input: tc.input,
        output: tc.output,
      })) || []);
    }
  }, [problem, selectedLanguage, submission]);


  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    let parsedCodeSnippets = defaultCodeSnippets;
    try {
      if (problem.codeSnippets) {
        parsedCodeSnippets = typeof problem.codeSnippets === 'string' ? JSON.parse(problem.codeSnippets) : problem.codeSnippets;
      }
    } catch (e) {
      console.error('Failed to parse codeSnippets:', e);
    }
    setCode(parsedCodeSnippets[lang] || defaultCodeSnippets[lang] || '');
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = testcases.map((tc) => tc.input);
      const expected_outputs = testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
      setTestTab('testResults');
      setIsTestPanelExpanded(true);
    } catch (error) {
      console.log('Error submitting code', error);
    }
  };

  const handleRunCodeOnly = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = testcases.map((tc) => tc.input);
      const expected_outputs = testcases.map((tc) => tc.output);
      runCode(code, language_id, stdin, expected_outputs, id);
      setTestTab('testResults');
      setIsTestPanelExpanded(true);
    } catch (error) {
      console.log('Error executing code', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'hard':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-codeflow-dark via-base-300 to-base-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-base-100/50 backdrop-blur-sm p-8 shadow-2xl border border-white/10"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-codeflow-purple border-t-transparent rounded-full mb-4"
            />
            <p className="text-base-content/70 text-lg">Loading problem...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderTestTabContent = () => {
    switch (testTab) {
      case 'testResults':
        if (submission) {
          return (
            <div className="h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-3 px-4 pt-4">
                <Award className="w-4 h-4 text-green-500" />
                <h4 className="font-semibold text-base-content">Submission Results</h4>
              </div>
              <Submission submission={submission} />
            </div>
          );
        }
        if (execution) {
          return (
            <div className="h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-3 px-4 pt-4">
                <Timer className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-base-content">Run Results</h4>
              </div>
              <ExecutionResults execution={execution} />
            </div>
          );
        }
        return (
          <div className="p-6 text-center text-base-content/70">
            <div className="flex items-center justify-center gap-4 mb-3">
              <Timer className="w-8 h-8 text-base-content/30" />
              <Award className="w-8 h-8 text-base-content/30" />
            </div>
            <p className="text-lg mb-2">No results yet</p>
            <p className="text-sm">Run or submit your code to see results here</p>
          </div>
        );
      default: // testCases
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 px-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-codeflow-purple to-codeflow-blue rounded-lg">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Test Cases</h3>
              </div>
              <span className="text-xs text-base-content/60">
                3 test cases
              </span>
            </div>
            <div className="overflow-x-auto px-4 pb-4">
              <table className="table w-full">
                <thead>
                  <tr className="border-white/10">
                    <th className="text-codeflow-purple font-semibold text-xs">Input</th>
                    <th className="text-codeflow-purple font-semibold text-xs">Expected Output</th>
                    <th className="text-codeflow-purple font-semibold text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testcases.map((testCase, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-white/10 hover:bg-base-200/30"
                    >
                      <td className="font-mono text-xs bg-black/30 rounded p-2 max-w-[120px] truncate">
                        {testCase.input}
                      </td>
                      <td className="font-mono text-xs bg-black/30 rounded p-2 max-w-[120px] truncate">
                        {testCase.output}
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-base-content/60">
                          <Timer className="w-3 h-3" />
                          <span className="text-xs">Pending</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose max-w-none text-base-content"
          >
            <div className="mb-6">
              <p className="text-base leading-relaxed text-base-content/90">
                {problem.description}
              </p>
            </div>
            {problem.examples && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-codeflow-purple">Examples:</h3>
                <div className="space-y-6">
                  {(Array.isArray(problem.examples) ? problem.examples : []).slice(0, 3).map((example, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-base-200/50 to-base-300/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
                    >
                      <div className="mb-4">
                        <div className="text-codeflow-blue mb-2 text-sm font-semibold flex items-center gap-2">
                          <Terminal className="w-4 h-4" />
                          Input:
                        </div>
                        <code className="bg-black/50 px-4 py-2 rounded-lg font-mono text-green-400 block">
                          {example.input}
                        </code>
                      </div>
                      <div className="mb-4">
                        <div className="text-codeflow-blue mb-2 text-sm font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Output:
                        </div>
                        <code className="bg-black/50 px-4 py-2 rounded-lg font-mono text-green-400 block">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-yellow-400 mb-2 text-sm font-semibold flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Explanation:
                          </div>
                          <p className="text-base-content/80 text-sm leading-relaxed bg-black/30 p-3 rounded-lg">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {problem.constraints && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-codeflow-purple">Constraints:</h3>
                <div className="bg-gradient-to-r from-base-200/50 to-base-300/30 p-6 rounded-xl border border-white/10">
                  <pre className="text-base-content/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {problem.constraints}
                  </pre>
                </div>
              </div>
            )}
            {problem.tags && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-codeflow-purple">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-codeflow-purple/20 to-codeflow-blue/20 text-codeflow-purple rounded-full text-sm font-medium border border-codeflow-purple/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {problem.editorial && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-codeflow-purple">Editorial:</h3>
                <div className="bg-gradient-to-r from-base-200/50 to-base-300/30 p-6 rounded-xl border border-white/10">
                  <p className="text-base-content/80 text-sm leading-relaxed">
                    {problem.editorial}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'hints':
        return (
          <div className="p-4">
            {problem?.editorial ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 rounded-xl border border-yellow-500/20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-yellow-400">Editorial</h4>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  {problem.editorial}
                </p>
              </motion.div>
            ) : (
              <div className="text-center text-base-content/70 p-8">
                <Lightbulb className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <p className="text-lg">No editorial available</p>
                <p className="text-sm mt-2 text-base-content/50">
                  Try to solve it on your own first!
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-codeflow-dark via-base-300 to-base-200 w-full">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100/80 backdrop-blur-sm shadow-2xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-base-content/70 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-base-content truncate max-w-full">
                    {problem.title}
                  </h1>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty || 'Easy'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="whitespace-nowrap text-xs">
                      Updated{' '}
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`btn btn-ghost btn-circle btn-sm sm:btn-md ${
                  isBookmarked ? 'text-yellow-400' : 'text-base-content/60'
                }`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                />
              </motion.button>

              <select
                className="px-3 py-1 rounded-lg bg-base-200/90 hover:bg-base-200 border border-base-300/60 hover:border-codeflow-purple/50 text-base-content text-xs transition-colors duration-200 focus:border-codeflow-purple focus:ring-1 focus:ring-codeflow-purple/20 focus:outline-none backdrop-blur-sm min-w-[80px]"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {['PYTHON', 'JAVA', 'C', 'CPP'].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="w-full mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card bg-base-100/50 backdrop-blur-sm shadow-2xl border border-white/10 h-fit"
          >
            <div className="card-body p-0">
              <div className="tabs tabs-boxed bg-transparent px-3 py-2 border-b border-white/10">
                {[
                  { key: 'description', icon: FileText, label: 'Description' },
                  { key: 'hints', icon: Lightbulb, label: 'Editorial' },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    className={`tab gap-1 text-sm transition-all duration-200 ${
                      activeTab === key
                        ? 'tab-active bg-gradient-to-r from-codeflow-purple to-codeflow-blue text-white'
                        : 'hover:bg-base-200/50'
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="min-h-[500px] max-h-[700px] overflow-y-auto p-6">
                {renderTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card bg-base-100/50 backdrop-blur-sm shadow-2xl border border-white/10 h-fit"
          >
            <div className="card-body p-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2 border-b border-white/10 bg-base-200/30 gap-2 sm:gap-0">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-codeflow-purple" />
                  <span className="font-semibold text-sm text-base-content">
                    Code Editor
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-base-content/60">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Auto-save enabled</span>
                    <span className="sm:hidden">Auto-save</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFormatCode}
                    className="btn btn-xs sm:btn-sm bg-codeflow-purple/20 hover:bg-codeflow-purple/30 border-codeflow-purple/40 text-codeflow-purple gap-1 sm:gap-1.5 transition-all duration-200"
                    title="Format Code (Ctrl+Shift+F)"
                  >
                    <AlignLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTestPanelExpanded(!isTestPanelExpanded)}
                    className="btn btn-xs sm:btn-sm bg-codeflow-blue/20 hover:bg-codeflow-blue/30 border-codeflow-blue/40 text-codeflow-blue gap-1 sm:gap-1.5 transition-all duration-200"
                    title={isTestPanelExpanded ? 'Collapse Test Panel' : 'Expand Test Panel'}
                  >
                    {isTestPanelExpanded ? (
                      <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div
                className={`w-full relative transition-all duration-300 ${
                  isTestPanelExpanded
                    ? 'h-[200px] sm:h-[250px] lg:h-[300px]'
                    : 'h-[400px] sm:h-[500px] lg:h-[650px]'
                }`}
              >
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    lineHeight: 18,
                    contextmenu: false,
                    selectOnLineNumbers: false,
                    selectionHighlight: false,
                    occurrencesHighlight: false,
                  }}
                />
              </div>

              <div className="px-3 py-2 bg-base-200/30 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        testTab === 'testCases'
                          ? 'text-codeflow-purple bg-codeflow-purple/10 border border-codeflow-purple/20'
                          : 'text-base-content/70 hover:text-base-content hover:bg-base-300/20'
                      }`}
                      onClick={() => setTestTab('testCases')}
                    >
                      Test Cases
                    </button>
                    <button
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        testTab === 'testResults'
                          ? 'text-codeflow-purple bg-codeflow-purple/10 border border-codeflow-purple/20'
                          : 'text-base-content/70 hover:text-base-content hover:bg-base-300/20'
                      }`}
                      onClick={() => setTestTab('testResults')}
                    >
                      Test Results
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`btn btn-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 gap-1 ${
                        isRunning ? 'opacity-80' : ''
                      }`}
                      onClick={handleRunCodeOnly}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      <span className="text-xs">Run</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`btn btn-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 gap-1 ${
                        isExecuting ? 'opacity-80' : ''
                      }`}
                      onClick={handleSubmitCode}
                      disabled={isExecuting}
                    >
                      {isExecuting ? (
                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Award className="w-3 h-3" />
                      )}
                      <span className="text-xs">Submit</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: isTestPanelExpanded ? '350px' : '0px',
                  opacity: isTestPanelExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="border-t border-white/10 bg-base-100/30 overflow-hidden"
              >
                <div className="h-full overflow-y-auto">
                  {renderTestTabContent()}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;