import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProblemStore } from '../store/useProblemStore';
import { Loader, Code, Target, TrendingUp, Users, Zap, BookOpen } from 'lucide-react';
import ProblemTable from '../components/ProblemTable';

const Dashboard = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
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
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-codeflow-purple border-t-transparent rounded-full mb-4"
            />
            <p className="text-base-content/70 text-lg">Loading dashboard...</p>
          </div>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-codeflow-dark via-base-300 to-base-200 px-4 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-codeflow-purple/20 to-codeflow-blue/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-gradient-to-bl from-codeflow-blue/15 to-codeflow-purple/15 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* <div className="p-3 bg-gradient-to-r from-codeflow-purple to-codeflow-blue rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div> */}
              <h1 className="text-5xl font-bold">
                Welcome to
                <span
                    className="bg-gradient-to-r from-codeflow-purple to-codeflow-blue bg-clip-text text-transparent mr-0.5 pl-3"
                    style={{
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    CodeFlow
                  </span>
              </h1>
            </div>

            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Master coding interviews with our comprehensive platform. Practice problems,
              track your progress, and elevate your programming skills.
            </p>

            {/* Small stats indicators */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Code className="w-4 h-4 text-codeflow-purple" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-base-content">{problems?.length || 0}</p>
                  <p className="text-xs text-base-content/60">Total Problems</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Users className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-base-content">1.2k</p>
                  <p className="text-xs text-base-content/60">Active Users</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Problems Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {problems.length > 0 ? (
              <ProblemTable problems={problems} />
            ) : (
              <div className="card bg-base-100/30 backdrop-blur-sm shadow-xl border border-white/10 p-12">
                <div className="text-center">
                  <div className="p-4 bg-base-200/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Code className="w-10 h-10 text-base-content/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Problems Found</h3>
                  <p className="text-base-content/60 mb-6">
                    It looks like there are no problems available at the moment.
                  </p>
                  <button className="btn bg-gradient-to-r from-codeflow-purple to-codeflow-blue hover:from-codeflow-purple/90 hover:to-codeflow-blue/90 text-white border-0">
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
