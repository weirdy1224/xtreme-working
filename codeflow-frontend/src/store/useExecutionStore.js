import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  isRunning: false,
  submission: null,
  execution: null,

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({ isExecuting: true });

      const res = await axiosInstance.post('/executeCode/submit', {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({ submission: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error executing code', error);
      toast.error('Error executing code');
    } finally {
      set({ isExecuting: false });
    }
  },

  runCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({ isRunning: true });

      const res = await axiosInstance.post('/executeCode/run', {
        source_code,
        language_id,
        problemId,
      });

      set({ execution: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      console.log('Error executing code', error);
      toast.error('Error executing code');
    } finally {
      set({ isRunning: false });
    }
  },
}));
