import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { X, Code, Copy, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeViewModal = ({ isOpen, onClose, submission }) => {
  if (!submission) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(submission.sourceCode);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const getLanguageForEditor = (language) => {
    const languageMap = {
      'JavaScript': 'javascript',
      'Python': 'python',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'Go': 'go',
      'Rust': 'rust',
      'TypeScript': 'typescript',
    };
    return languageMap[language] || 'javascript';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container - Full screen on mobile, constrained on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full h-full sm:w-[90vw] sm:h-auto sm:max-w-7xl sm:max-h-[90vh] lg:w-[85vw] xl:w-[80vw]"
          >
            <div className="card bg-base-100/95 backdrop-blur-sm shadow-2xl border border-white/20 h-full sm:h-auto flex flex-col">
              {/* Simplified Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-codeflow-purple" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-base-content">Submitted Code</h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/70">
                      <span className={submission.status === 'ACCEPTED' ? 'text-success' : 'text-error'}>
                        {submission.status === 'ACCEPTED' ? 'Accepted' : 'Wrong Answer'}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="badge badge-neutral badge-xs sm:badge-sm">
                        {submission.language}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="btn btn-xs sm:btn-sm bg-codeflow-purple/20 hover:bg-codeflow-purple/30 text-codeflow-purple border-codeflow-purple/30"
                    title="Copy code"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={onClose}
                    className="btn btn-ghost btn-circle btn-xs sm:btn-sm"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Code Editor - Full height on mobile, fixed height on desktop */}
              <div className="flex-1 p-2 sm:p-4 min-h-0 sm:min-h-[70vh]">
                <div className="w-full h-full sm:h-[70vh] border border-white/10 rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    language={getLanguageForEditor(submission.language)}
                    theme="vs-dark"
                    value={submission.sourceCode || '// No code available'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 12,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                      lineHeight: 18,
                      contextmenu: false,
                      selectOnLineNumbers: true,
                      selectionHighlight: true,
                      occurrencesHighlight: true,
                      scrollbar: {
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8
                      }
                    }}
                  />
                </div>
              </div>

              {/* Simplified Footer */}
              <div className="flex items-center justify-center p-3 border-t border-white/10 bg-base-200/30 shrink-0">
                <button
                  onClick={onClose}
                  className="btn btn-sm bg-base-200/50 border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CodeViewModal;
