import React, { useState } from 'react';
import {
  Eye,
} from 'lucide-react';

import CodeViewModal from './CodeViewModal';

const SubmissionsList = ({ submissions, isLoading }) => {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleViewCode = (submission) => {
    setSelectedSubmission(submission);
    setIsCodeModalOpen(true);
  };
  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    if (!data || data === null || data === undefined) {
      return [];
    }
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };

  // Helper function to calculate average memory usage
  const calculateAverageMemory = (memoryData) => {
    const parsedData = safeParse(memoryData);
    if (!parsedData || parsedData.length === 0) return 0;

    const memoryArray = parsedData
      .map((m) => {
        if (!m || typeof m !== 'string') return 0;
        return parseFloat(m.split(' ')[0]) || 0;
      })
      .filter(val => !isNaN(val));

    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const parsedData = safeParse(timeData);
    if (!parsedData || parsedData.length === 0) return 0;

    const timeArray = parsedData
      .map((t) => {
        if (!t || typeof t !== 'string') return 0;
        return parseFloat(t.split(' ')[0]) || 0;
      })
      .filter(val => !isNaN(val));

    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-6 gap-4 px-4 py-3 bg-base-200/50 rounded-lg border border-white/10 text-sm font-medium text-base-content/80">
        <div>Time (IST)</div>
        <div>Status</div>
        <div>Lang</div>
        <div>Runtime</div>
        <div>Memory</div>
        <div>Code</div>
      </div>

      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <div
            key={submission.id}
            className="bg-base-200/30 hover:bg-base-200/50 transition-colors rounded-lg border border-white/10 p-4"
          >
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid md:grid-cols-6 gap-4 items-center text-sm">
              {/* Time */}
              <div className="text-base-content/70">
                {new Date(submission.createdAt).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </div>

              {/* Status */}
              <div>
                {submission.status === 'ACCEPTED' ? (
                  <span className="text-success font-medium">Correct</span>
                ) : (
                  <span className="text-error font-medium">Wrong Answer</span>
                )}
              </div>

              {/* Language */}
              <div className="text-base-content">
                {submission.language}
              </div>

              {/* Runtime */}
              <div className="text-base-content/70">
                {avgTime.toFixed(2)}ms
              </div>

              {/* Memory */}
              <div className="text-base-content/70">
                {(avgMemory / 1000).toFixed(2)}MB
              </div>

              {/* Code - View Button */}
              <div>
                <button
                  onClick={() => handleViewCode(submission)}
                  className="flex items-center gap-1 text-codeflow-purple hover:text-codeflow-blue transition-colors text-sm font-medium cursor-pointer"
                  title="View submitted code"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
              {/* Top Row: Status and Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {submission.status === 'ACCEPTED' ? (
                    <span className="text-success font-medium text-sm">Correct</span>
                  ) : (
                    <span className="text-error font-medium text-sm">Wrong Answer</span>
                  )}
                  <span className="badge badge-neutral badge-sm">
                    {submission.language}
                  </span>
                </div>
                <button
                  onClick={() => handleViewCode(submission)}
                  className="flex items-center gap-1 text-codeflow-purple hover:text-codeflow-blue transition-colors text-sm font-medium cursor-pointer"
                  title="View submitted code"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>

              {/* Bottom Row: Time, Runtime, Memory */}
              <div className="text-xs text-base-content/60 space-y-1">
                <div>
                  {new Date(submission.createdAt).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
                <div className="flex gap-4">
                  <span>Runtime: {avgTime.toFixed(2)}ms</span>
                  <span>Memory: {(avgMemory / 1000).toFixed(2)}MB</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Code View Modal */}
      <CodeViewModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        submission={selectedSubmission}
      />
    </div>
  );
};

export default SubmissionsList;
