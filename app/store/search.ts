import { create } from 'zustand';

type CacheStore = {
    cache: Map<string, any>;
    getFromCache: (key: string) => any;
    hasInCache: (key: string) => boolean;
    setInCache: (key: string, value: any) => void;
  };

export const useCacheStore = create<CacheStore>((set, get) => ({
  cache: new Map(),

  getFromCache: (key: string) => get().cache.get(key),
  hasInCache: (key: string) => get().cache.has(key),
  setInCache: (key: string, value: any) => {
    const cache = get().cache;
    cache.set(key, value);
    set({ cache }); // trigger update if needed
  },
}));

export default useCacheStore;
