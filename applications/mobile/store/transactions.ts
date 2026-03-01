import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Currency = "XOF" | "EUR" | "USD";
export type TxStatus = "Envoyé" | "Reçu" | "En cours";

export type Tx = {
  id: string;
  label: string;      // ex: "→ Maman"
  amount: number;     // montant envoyé (sans frais)
  fee: number;        // frais
  currency: Currency;
  status: TxStatus;
  createdAt: number;
};

type WalletState = {
  walletCurrency: Currency;
  balance: number;
  txs: Tx[];

  setCurrency: (c: Currency) => void;
  topUp: (amount: number) => void;

  addTx: (tx: Omit<Tx, "id" | "createdAt">) => string;
  updateStatus: (id: string, status: TxStatus) => void;

  debit: (amount: number) => void;
  clearAll: () => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      walletCurrency: "XOF",
      balance: 50000, // solde démo
      txs: [],

      setCurrency: (c) => set({ walletCurrency: c }),

      topUp: (amount) =>
        set((s) => ({ balance: s.balance + Math.max(0, Math.round(amount)) })),

      debit: (amount) =>
        set((s) => ({ balance: Math.max(0, s.balance - Math.max(0, Math.round(amount))) })),

      addTx: (tx) => {
        const id = String(Date.now());
        set((state) => ({
          txs: [{ id, createdAt: Date.now(), ...tx }, ...state.txs],
        }));
        return id;
      },

      updateStatus: (id, status) =>
        set((state) => ({
          txs: state.txs.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      clearAll: () => set({ txs: [], balance: 50000, walletCurrency: "XOF" }),
    }),
    {
      name: "afrilink_wallet_v1",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);