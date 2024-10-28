import { Route, Routes } from "react-router-dom";
import { MainPage } from "../../pages/MainPage/MainPage";
import { FormPage } from "../../pages/FormPage/FormPage";
import { PaymentPage } from "../../pages/PaymentPage/PaymentPage";
import { useContext } from "react";

import { ParkedPage } from "../../pages/ParkedPage/ParkedPage";
import { PriceContext } from "../../context/PriceContext";
import { CheckFormDataContext } from "../../context/CheckFormDataContext";

export const Main = () => {
  const { prices } = useContext(PriceContext);
  const { isFormFilled } = useContext(CheckFormDataContext);

  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {prices ? (
          <Route path="/form" element={<FormPage />} />
        ) : (
          <Route path="/form" element={<ParkedPage />} />
        )}
        {isFormFilled ? (
          <Route path="/payment" element={<PaymentPage />} />
        ) : (
          <Route path="/payment" element={<ParkedPage />} />
        )}
      </Routes>
    </main>
  );
};
