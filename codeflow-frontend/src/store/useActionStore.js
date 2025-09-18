import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useProblemStore } from './useProblemStore';

export const useActionStore = create((set) => ({
  isDeletingProblem: false,

  onDeleteProblem: async (problemId) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/deleteProblem/${problemId}`);
      const { problems } = useProblemStore.getState();
      const updatedProblems = problems.filter(p => p.id !== problemId);
      useProblemStore.setState({ problems: updatedProblems });

      toast.success(res.data.message);
    } catch (error) {
      console.log('Error deleting problem', error);
      toast.error('Error deleting problem');
    } finally {
      set({ isDeletingProblem: false });
    }
  },
}));
