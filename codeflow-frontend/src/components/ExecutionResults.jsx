import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from 'lucide-react';

const ExecutionResults = ({ execution }) => {
  if (!execution) {
    return (
      <div className="p-4 text-center text-base-content/70">
        No execution results available
      </div>
    );
  }

  // ✅ Normalize structure (supports both runCode + submitCode DB results)
  const {
    allPassed,
    status,
    testResults = [],
    totalTestCases = testResults.length || 0,
    passedTestCases = testResults.filter((r) => r.passed).length,
  } = execution;

  // Collect available values
  const memoryArr = testResults
    .filter((r) => r.memory)
    .map((r) => parseFloat(r.memory));
  const timeArr = testResults
    .filter((r) => r.time)
    .map((r) => parseFloat(r.time));

  // Safe averages
  const avgMemory =
    memoryArr.length > 0
      ? memoryArr.reduce((a, b) => a + b, 0) / memoryArr.length
      : null;
  const avgTime =
    timeArr.length > 0
      ? timeArr.reduce((a, b) => a + b, 0) / timeArr.length
      : null;

  // Success rate
  const successRate =
    totalTestCases > 0 ? (passedTestCases / totalTestCases) * 100 : 0;

  return (
    <div className="space-y-3 p-4">
      {/* Overall Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60">Status</div>
          <div
            className={`text-sm font-semibold ${
              status?.toUpperCase() === 'ACCEPTED'
                ? 'text-success'
                : 'text-error'
            }`}
          >
            {status || 'N/A'}
          </div>
        </div>

        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60">Success Rate</div>
          <div className="text-sm font-semibold">
            {successRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Runtime
          </div>
          <div className="text-sm font-semibold">
            {avgTime !== null ? `${avgTime.toFixed(3)} s` : '--'}
          </div>
        </div>

        <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
          <div className="text-xs text-base-content/60 flex items-center gap-1">
            <Memory className="w-3 h-3" />
            Memory
          </div>
          <div className="text-sm font-semibold">
            {avgMemory !== null ? `${avgMemory.toFixed(0)} KB` : '--'}
          </div>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-base-100/30 rounded-lg border border-white/10">
        <div className="p-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-base-content">
            Test Results ({testResults.length})
          </h3>
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
              {testResults.length > 0 ? (
                testResults.map((result, idx) => (
                  <tr key={result.id || idx} className="hover:bg-base-200/20">
                    <td className="py-1">
                      {result.passed ? (
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
                    <td
                      className="font-mono text-xs max-w-24 truncate"
                      title={result.expected}
                    >
                      {result.expected}
                    </td>
                    <td
                      className="font-mono text-xs max-w-24 truncate"
                      title={result.stdout || 'null'}
                    >
                      {result.stdout || 'null'}
                    </td>
                    <td className="text-xs">{result.memory || '--'}</td>
                    <td className="text-xs">{result.time || '--'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-xs text-base-content/60"
                  >
                    No test results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExecutionResults;
