import { createContext } from "react";

interface formDataContext {
  isFormFilled: boolean;
  setIsFormFilled: (isFormFilled: boolean) => void;
}

export const CheckFormDataContext = createContext<formDataContext>({
  isFormFilled: false,
  setIsFormFilled: () => {},
});
