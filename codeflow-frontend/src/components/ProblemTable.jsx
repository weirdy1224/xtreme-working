import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Loader2,
  PencilIcon,
  Plus,
  Trash,
  TrashIcon,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  Star,
} from 'lucide-react';
import { useActionStore } from '../store/useActionStore';

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { isDeletingProblem, onDeleteProblem } = useActionStore();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);


  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();

    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === 'ALL' ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === 'ALL' ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, allTags, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };


  const difficulties = ['EASY', 'MEDIUM', 'HARD'];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'HARD': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const solvedCount = problems?.filter(problem => 
    problem.solvedBy.some(user => user.userId === authUser?.id)
  ).length || 0;

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100/50 backdrop-blur-sm shadow-xl border border-white/10 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-codeflow-purple to-codeflow-blue rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-base-content">Problems</h2>
            </div>
            <p className="text-base-content/70">
              Solve {problems?.length || 0} problems • {solvedCount} completed • {Math.round((solvedCount / (problems?.length || 1)) * 100)}% progress
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card bg-base-100/30 backdrop-blur-sm shadow-xl border border-white/10 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search problems by title..."
              className="input input-bordered w-full pl-10 bg-base-200/50 border-white/20 focus:border-codeflow-purple/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <select
              className="select select-bordered bg-base-200/50 border-white/20 pl-10 min-w-48"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="ALL">All Difficulties</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <select
            className="select select-bordered bg-base-200/50 border-white/20 min-w-48"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="ALL">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        {(search || difficulty !== 'ALL' || selectedTag !== 'ALL') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-base-content/60">Active filters:</span>
            {search && (
              <span className="badge bg-codeflow-purple/20 text-codeflow-purple border-codeflow-purple/30">
                Search: "{search}"
              </span>
            )}
            {difficulty !== 'ALL' && (
              <span className="badge bg-codeflow-blue/20 text-codeflow-blue border-codeflow-blue/30">
                {difficulty.toLowerCase()}
              </span>
            )}
            {selectedTag !== 'ALL' && (
              <span className="badge bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {selectedTag}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-base-100/30 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table table-lg">
            <thead className="bg-base-200/50">
              <tr className="border-white/10">
                <th className="text-base-content/80 font-semibold">Status</th>
                <th className="text-base-content/80 font-semibold">Title</th>
                <th className="text-base-content/80 font-semibold">Tags</th>
                <th className="text-base-content/80 font-semibold">Difficulty</th>
                <th className="text-base-content/80 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem, index) => {
                  const isSolved = problem.solvedBy.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <motion.tr 
                      key={problem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-white/10 hover:bg-base-200/30 transition-colors"
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          {isSolved ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-base-content/40" />
                          )}
                          <span className={`text-sm font-medium ${isSolved ? 'text-green-400' : 'text-base-content/60'}`}>
                            {isSolved ? 'Solved' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-semibold text-base-content hover:text-codeflow-purple transition-colors hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {(problem.tags || []).slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {(problem.tags || []).length > 3 && (
                            <span className="badge bg-base-200/50 text-base-content/60 text-xs">
                              +{(problem.tags || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge border font-semibold text-xs ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {authUser?.role === 'ADMIN' && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this problem?')) {
                                    handleDelete(problem.id);
                                  }
                                }}
                                className="btn btn-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                              >
                                {isDeletingProblem ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  <TrashIcon className="w-4 h-4" />
                                )}
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled 
                                className="btn btn-sm bg-yellow-500/20 text-yellow-400 border-yellow-500/30 opacity-50"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-base-200/50 rounded-full mb-4">
                        <Search className="w-8 h-8 text-base-content/40" />
                      </div>
                      <h3 className="text-lg font-semibold text-base-content/70 mb-2">No problems found</h3>
                      <p className="text-base-content/50">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-6 border-t border-white/10 bg-base-200/30">
            <div className="text-sm text-base-content/60">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of {filteredProblems.length} problems
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm bg-base-200/50 border-white/20"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </motion.button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page 
                        ? 'bg-gradient-to-r from-codeflow-purple to-codeflow-blue text-white border-0' 
                        : 'bg-base-200/50 border-white/20'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-base-content/40">...</span>
                    <button
                      className={`btn btn-sm ${currentPage === totalPages 
                        ? 'bg-gradient-to-r from-codeflow-purple to-codeflow-blue text-white border-0' 
                        : 'bg-base-200/50 border-white/20'
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm bg-base-200/50 border-white/20"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProblemTable;
