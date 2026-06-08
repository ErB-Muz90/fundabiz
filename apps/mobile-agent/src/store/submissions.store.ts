import { create } from 'zustand';
import { KYCSubmission, SubmitKYCData } from '../services/kyc.service';
import { offlineQueue } from '../services/offline-sync';

interface SubmissionState {
  submissions: KYCSubmission[];
  currentSubmission: Partial<SubmitKYCData> | null;
  isSubmitting: boolean;
  syncQueueSize: number;
  error: string | null;

  setCurrentSubmission: (data: Partial<SubmitKYCData> | null) => void;
  updateSubmission: (data: Partial<SubmitKYCData>) => void;
  submitKYC: (data: SubmitKYCData) => Promise<void>;
  fetchMySubmissions: () => Promise<void>;
  refreshQueueSize: () => void;
}

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  submissions: [],
  currentSubmission: null,
  isSubmitting: false,
  syncQueueSize: 0,
  error: null,

  setCurrentSubmission: (data) => {
    set({ currentSubmission: data });
  },

  updateSubmission: (data) => {
    const current = get().currentSubmission || {};
    set({ currentSubmission: { ...current, ...data } });
  },

  submitKYC: async (data: SubmitKYCData) => {
    set({ isSubmitting: true, error: null });
    try {
      const { default: NetInfo } = await import('@react-native-community/netinfo');
      const netState = await NetInfo.fetch();

      if (!netState.isConnected) {
        await offlineQueue.addToQueue({
          type: 'SUBMIT_KYC',
          payload: data,
        });
        set({ isSubmitting: false, syncQueueSize: offlineQueue.getQueueSize() });
        return;
      }

      const { submitKYC: apiSubmit } = await import('../services/kyc.service');
      const submission = await apiSubmit(data);
      set((state) => ({
        submissions: [submission, ...state.submissions],
        isSubmitting: false,
        currentSubmission: null,
      }));
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Submission failed';
      set({ isSubmitting: false, error: message });
      throw new Error(message);
    }
  },

  fetchMySubmissions: async () => {
    try {
      const { getMySubmissions } = await import('../services/kyc.service');
      const submissions = await getMySubmissions();
      set({ submissions });
    } catch {
      // silent fail - data stays stale
    }
  },

  refreshQueueSize: () => {
    set({ syncQueueSize: offlineQueue.getQueueSize() });
  },
}));
