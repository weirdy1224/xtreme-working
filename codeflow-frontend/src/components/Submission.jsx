import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from 'lucide-react';

const SubmissionResults = ({ submission }) => {
  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || '[]');
  const timeArr = JSON.parse(submission.time || '[]');

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-3 p-4">
      {/* Overall Status - Compact Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60">Status</div>
          <div
            className={`text-sm font-semibold ${
              submission.status === 'ACCEPTED' ? 'text-success' : 'text-error'
            }`}
          >
            {submission.status}
          </div>
        </div>

        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60">Success Rate</div>
          <div className="text-sm font-semibold">{successRate.toFixed(1)}%</div>
        </div>

        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Runtime
          </div>
          <div className="text-sm font-semibold">{avgTime.toFixed(3)} s</div>
        </div>

        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60 flex items-center gap-1">
            <Memory className="w-3 h-3" />
            Memory
          </div>
          <div className="text-sm font-semibold">{avgMemory.toFixed(0)} KB</div>
        </div>
      </div>

      {/* Test Cases Results - Compact Table */}
      <div className="bg-base-100/30 rounded-lg border border-white/10">
        <div className="p-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-base-content">Test Results</h3>
        </div>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="table table-sm w-full">
            <thead className="sticky top-0 bg-base-200/80 backdrop-blur-sm">
              <tr className="text-xs">
                <th className="py-2">Status</th>
                <th className="py-2">Expected</th>
                <th className="py-2">Output</th>
                <th className="py-2">Memory</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {submission.testCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-base-200/20">
                  <td className="py-1">
                    {testCase.passed ? (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-xs">Pass</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-error">
                        <XCircle className="w-3 h-3" />
                        <span className="text-xs">Fail</span>
                      </div>
                    )}
                  </td>
                  <td className="font-mono text-xs max-w-24 truncate" title={testCase.expected}>
                    {testCase.expected}
                  </td>
                  <td className="font-mono text-xs max-w-24 truncate" title={testCase.stdout || 'null'}>
                    {testCase.stdout || 'null'}
                  </td>
                  <td className="text-xs">{testCase.memory}</td>
                  <td className="text-xs">{testCase.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
