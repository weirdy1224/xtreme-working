import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from 'lucide-react';

const ExecutionResults = ({ execution }) => {
  const { allPassed, status, testResults, totalTestCases, passedTestCases } = execution;

  const memoryArr = testResults.some((r) => r.memory)
    ? testResults.map((r) => r.memory)
    : [];
  const timeArr = testResults.some((r) => r.time)
    ? testResults.map((r) => r.time)
    : [];
  
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a, b) => a + b, 0) / timeArr.length;
  
  const successRate = (passedTestCases / totalTestCases) * 100;
  

  return (
      <div className="space-y-3 p-4">
        {/* Overall Status - Compact Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-base-200/50 p-2 rounded-lg border border-white/10">
            <div className="text-xs text-base-content/60">Status</div>
            <div
              className={`text-sm font-semibold ${
                status === 'ACCEPTED' ? 'text-success' : 'text-error'
              }`}
            >
              {status}
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
                {testResults.map((result) => (
                  <tr key={result.id} className="hover:bg-base-200/20">
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
                    <td className="font-mono text-xs max-w-24 truncate" title={result.expected}>
                      {result.expected}
                    </td>
                    <td className="font-mono text-xs max-w-24 truncate" title={result.stdout || 'null'}>
                      {result.stdout || 'null'}
                    </td>
                    <td className="text-xs">{result.memory}</td>
                    <td className="text-xs">{result.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
};

export default ExecutionResults;
