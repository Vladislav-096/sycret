import "./styles/fonts.scss";
import "./styles/_variables.scss";
import "./styles/common.scss";

import { Layout } from "./Components/Layout/Layout";
import { useState } from "react";
import { PriceContext, usePrice } from "./context/PriceContext";
import { CheckFormDataContext } from "./context/CheckFormDataContext";

export function App() {
  const [prices, setPrices] = useState<usePrice | null>(null);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);

  const updataIsFormFilled = (value: boolean) => {
    setIsFormFilled(value);
  };

  const updatePrices = (newPricesData: usePrice | null) => {
    setPrices(newPricesData);
  };

  return (
    <CheckFormDataContext.Provider
      value={{ isFormFilled, setIsFormFilled: updataIsFormFilled }}
    >
      <PriceContext.Provider value={{ prices, setPrices: updatePrices }}>
        <Layout />
      </PriceContext.Provider>
    </CheckFormDataContext.Provider>
  );
}
