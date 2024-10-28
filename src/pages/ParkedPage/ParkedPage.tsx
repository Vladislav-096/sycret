import { Link } from "react-router-dom";
import styles from "./parkedPage.module.scss";

export const ParkedPage = () => {
  return (
    <div className="container">
      <p className={styles.warning}>
        <span>Страница не доступна,</span>{" "}
        <span>
          <Link className={styles.link} to={"/"}>
            перейти на главную
          </Link>
        </span>
      </p>
    </div>
  );
};
