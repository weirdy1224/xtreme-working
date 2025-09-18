import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useProblemStore = create((set, get) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isCreatingProblem: false,
  isProblemByUserLoading: false,

  createProblem: async (problemData) => {
    set({ isCreatingProblem: true });
    try {
      const res = await axiosInstance.post(
        '/problems/createProblem',
        problemData
      );
      toast.success(res.data.message || 'Problem Created successfully⚡');
      return { success: true, data: res.data.data };
    } catch (error) {
      console.log('Error creating problem:', error);
      toast.error(error.response?.data?.message || 'Error creating problem');
      return { success: false, error };
    } finally {
      set({ isCreatingProblem: false });
    }
  },

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get('/problems/getAllProblems');

      set({ problems: res.data.data });
    } catch (error) {
      console.log('Error getting all problems:', error);
      toast.error(
        error.response?.data?.message || 'Error getting all problems'
      );
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/getProblem/${id}`);

      set({ problem: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error getting problem:', error);
      toast.error(error.response?.data?.message || 'Error getting problem');
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      set({ isProblemByUserLoading: true });

      const res = await axiosInstance.get('/problems/getSolvedProblems');

      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log('Error getting problem:', error);
      toast.error(error.response?.data?.message || 'Error getting problem');
    } finally {
      set({ isProblemByUserLoading: false });
    }
  },
}));
