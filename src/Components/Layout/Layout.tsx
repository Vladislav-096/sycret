import { BrowserRouter } from "react-router-dom";
import { Main } from "../Main/Main";
import styles from "./layout.module.scss";

export const Layout = () => {
  return (
    <BrowserRouter>
      <div className={styles.page}>
        <Main />
      </div>
    </BrowserRouter>
  );
};
