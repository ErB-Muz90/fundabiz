import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface QueuedAction {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
  retryCount: number;
}

const QUEUE_KEY = '@fundabiz/offline_queue';

class OfflineQueue {
  private queue: QueuedAction[] = [];
  private processing = false;

  async init(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      this.queue = [];
    }

    NetInfo.addEventListener((state) => {
      if (state.isConnected && !state.isInternetReachable === false) {
        this.processQueue();
      }
    });
  }

  async addToQueue(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retryCount'>): Promise<void> {
    const entry: QueuedAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    this.queue.push(entry);
    await this._persist();
  }

  async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    this.processing = true;

    const remaining: QueuedAction[] = [];

    for (const action of this.queue) {
      try {
        await this._executeAction(action);
      } catch {
        if (action.retryCount < 3) {
          remaining.push({ ...action, retryCount: action.retryCount + 1 });
        }
      }
    }

    this.queue = remaining;
    await this._persist();
    this.processing = false;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  async clearQueue(): Promise<void> {
    this.queue = [];
    await this._persist();
  }

  private async _executeAction(action: QueuedAction): Promise<void> {
    const { default: api } = await import('./kyc.service');
    switch (action.type) {
      case 'SUBMIT_KYC':
        await api.post('/kyc/submit', action.payload);
        break;
      case 'UPLOAD_DOCUMENT':
        await api.post('/upload/document', action.payload);
        break;
      default:
        break;
    }
  }

  private async _persist(): Promise<void> {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
  }
}

export const offlineQueue = new OfflineQueue();
