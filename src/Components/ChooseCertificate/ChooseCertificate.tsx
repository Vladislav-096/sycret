import { useQuery } from "@tanstack/react-query";
import { getCertificates } from "../../api/Certificates";
import { queryClient } from "../../api/queryClient";
import { useContext, useRef, useState } from "react";
import styles from "./chosenCerteficate.module.scss";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Loader } from "../Loader/Loader";
import { Link } from "react-router-dom";
import { PriceContext } from "../../context/PriceContext";

export const ChooseCertificate = () => {
  const { prices, setPrices } = useContext(PriceContext);
  const [dropdownStatus, setDropdownStatus] = useState<boolean>(false);
  const [refetchDisabled, setRefetchDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);

  const chooseSertificate = (itemName: string, price: string) => {
    setPrices({ price, itemName });
  };

  const dropdownToggle = () => {
    setDropdownStatus((status) => !status);
  };

  const refetchDelay = async () => {
    await refetch();
    setRefetchDisabled(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setRefetchDisabled(false);
        resolve();
      }, 2000);
    });
  };

  const modifyPrice = (str: string) => {
    return str.split(".")[0];
  };

  useClickOutside([inputRef, suggestRef], () => {
    setDropdownStatus(false);
  });

  const {
    data: certificatesList,
    isError,
    isLoading,
    refetch,
  } = useQuery(
    {
      queryFn: () => getCertificates(),
      queryKey: ["certificates"],
      retry: false,
    },
    queryClient
  );

  return (
    <>
      <div className={styles["dropdown-container"]}>
        <div
          onClick={dropdownToggle}
          ref={inputRef}
          className={styles.dropdown}
        >
          <div className={styles["input-wrapper"]}>
            <div className={styles.input}>{prices?.itemName}</div>

            {!prices?.itemName && (
              <div className={styles.placeholder}>Выберете товар</div>
            )}
          </div>
          <div
            className={`${styles.toggle} ${
              dropdownStatus ? styles["toggle-upsidedown"] : ""
            }`}
          ></div>
        </div>

        <div
          ref={suggestRef}
          className={`list-reset ${styles.suggests} ${
            dropdownStatus ? styles["show-suggestions"] : ""
          }`}
        >
          {isLoading && (
            <div className={styles["loader-wrapper"]}>
              <Loader />
            </div>
          )}

          {isError && (
            <div className={styles["error-block"]}>
              (
              <div className={styles["error-block"]}>
                <div className={styles["error-message"]}>
                  Ошибка при получении данных
                </div>
                <button
                  onClick={() => refetchDelay()}
                  className={`btn-reset ${styles["refetch-button"]} ${
                    refetchDisabled ? styles["refetch-disabled"] : ""
                  }`}
                  disabled={refetchDisabled}
                >
                  Попробовать еще раз
                </button>
              </div>
              )
            </div>
          )}

          {certificatesList && certificatesList.data.length > 0 && (
            <div className={styles.options}>
              {certificatesList.data.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    chooseSertificate(
                      `Сертификат на ${modifyPrice(item.PRICE)} руб.`,
                      modifyPrice(item.PRICE)
                    );
                    setDropdownStatus(false);
                  }}
                  className={`btn-reset ${styles["button-option"]}`}
                >
                  {`Сертификат на ${modifyPrice(item.PRICE)} руб.`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {prices?.itemName && (
        <div className={styles["price-container"]}>
          <div className={styles.price}>{`Цена - ${prices?.price} р.`}</div>
          <Link to={"/form"} className={styles["button-buy-link"]}>
            Купить
          </Link>
        </div>
      )}
    </>
  );
};
