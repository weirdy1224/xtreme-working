import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Adjust the endpoint to match your backend route
        const res = await axiosInstance.get('/leaderboard');
        setLeaderboard(res.data.data || []);
      } catch (error) {
        toast.error('Failed to fetch leaderboard');
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboard.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner text-primary"></span> Loading leaderboard...
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
        <p className="text-base-content/70">No data available yet. Start solving problems!</p>
        <Link to="/problems" className="btn btn-primary mt-4">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-base-200"
    >
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Leaderboard</h1>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-100">
                <th className="text-lg">Rank</th>
                <th className="text-lg">Username</th>
                <th className="text-lg">Points</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={user.username} className="hover:bg-base-300 transition-colors">
                  <td className="font-medium">{user.rank || index + 1 + indexOfFirstItem}</td>
                  <td className="font-semibold">{user.username}</td>
                  <td className="text-success font-bold">{user.points}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          <button
            className="btn btn-outline"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              className={`btn btn-sm ${currentPage === number ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
          <button
            className="btn btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </div>

        <Link to="/problems" className="btn btn-primary mt-6 flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Problems
        </Link>
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;