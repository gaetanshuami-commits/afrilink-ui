import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type AuthState = {
  token: string | null;
  isReady: boolean;
  load: () => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
};

const KEY = "afrilink_token_v1";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isReady: false,

  load: async () => {
    const t = await SecureStore.getItemAsync(KEY);
    set({ token: t ?? null, isReady: true });
  },

  loginDemo: async () => {
    const t = "demo-token-" + Date.now();
    await SecureStore.setItemAsync(KEY, t);
    set({ token: t });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(KEY);
    set({ token: null });
  },
}));