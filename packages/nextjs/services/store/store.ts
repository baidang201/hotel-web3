import { create } from "zustand";

/**
 * Zustand Store
 */
type TGlobalState = {
  nativeCurrency: {
    price: number;
    symbol: string;
    name: string;
    decimals: number;
  };
  setNativeCurrencyPrice: (newPrice: number) => void;
};

export const useGlobalState = create<TGlobalState>(set => ({
  nativeCurrency: {
    price: 1,
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
  },
  setNativeCurrencyPrice: (newPrice: number): void =>
    set(state => ({
      nativeCurrency: {
        ...state.nativeCurrency,
        price: newPrice,
      },
    })),
}));
