type StorageOption = 'localStorage' | 'sessionStorage';

export class CustomStorage {
  private storage: Storage;

  constructor(type: StorageOption = 'localStorage') {
    this.storage =
      type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  get<T>(key: string): T | null {
    try {
      const raw = this.storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const LStorage = new CustomStorage('localStorage');
