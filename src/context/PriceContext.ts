import { createContext } from "react";

export interface usePrice {
  price: string;
  itemName: string;
}

interface priceContext {
  prices: usePrice | null;
  setPrices: (prices: usePrice | null) => void;
}

export const PriceContext = createContext<priceContext>({
  prices: null,
  setPrices: () => {},
});
