import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { paymentRequest } from "../../api/Certificates";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../api/queryClient";
import { PriceContext } from "../../context/PriceContext";
import { FormField } from "../FormField.tsx/FormField";
import { CheckFormDataContext } from "../../context/CheckFormDataContext";
import styles from "./form.module.scss";

type FormFields = "name" | "phone" | "email" | "message";

const createFormData = z.object({
  name: z.string().min(1, 'Поле "ФИО" обязательное для заполнения'),
  phone: z
    .string()
    .min(1, 'Поле "Телефон" обязательное для заполнения')
    .regex(
      /^\+\d{1} \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      "Укажите корректный номер телефона"
    ),
  email: z
    .string()
    .regex(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Укажите корректный адрес электронной почты"
    )
    .min(1, 'Поле "Электронная почта" обязательное для заполнения'),
  message: z.string().optional(),
});
type createFormData = z.infer<typeof createFormData>;

export const Form = () => {
  const { prices } = useContext(PriceContext);
  const { setIsFormFilled } = useContext(CheckFormDataContext);
  const [nameText, setNameText] = useState<string>("");
  const [phoneText, setPhoneText] = useState<string>("");
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>("");
  const [emailText, setEmailText] = useState<string>("");
  const [descrText, setDescrText] = useState<string>("");
  const navigate = useNavigate();

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    clearErrors("name");
    setNameText(value);
  };

  const handleChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    clearErrors("phone");

    const formattedNumber = value.replace(/[^\d]/g, "");
    const formattedNumberLength = formattedNumber.length;

    if (formattedNumberLength === 0) {
      setPhoneText("");
    } else if (formattedNumberLength < 4) {
      setPhoneText(`+${formattedNumber}`);
    } else if (formattedNumberLength < 7) {
      setPhoneText(
        `+${formattedNumber.slice(0, 1)} (${formattedNumber.slice(
          1,
          4
        )}) ${formattedNumber.slice(4)}`
      );
    } else {
      setPhoneText(
        `+${formattedNumber.slice(0, 1)} (${formattedNumber.slice(
          1,
          4
        )}) ${formattedNumber.slice(4, 7)}-${formattedNumber.slice(7, 9)}${
          formattedNumberLength > 9 ? `-${formattedNumber.slice(9, 11)}` : ""
        }`
      );
    }
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    clearErrors("email");
    setEmailText(value);
  };

  const handleChangeMessage = (
    event: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { value } = event.target;
    clearErrors("message");
    setDescrText(value);
  };

  const paymentRequestMutation = useMutation(
    {
      mutationFn: paymentRequest,
      onSuccess() {
        navigate("/payment");
      },
    },
    queryClient
  );

  useEffect(() => {
    if (phoneText) {
      setFormattedPhoneNumber(fomatPhoneNumber(phoneText));
    }
  }, [phoneText]);

  const fomatPhoneNumber = (number: string) => {
    let formattedNumber = number.split("").filter((item) => Number(item));
    formattedNumber.splice(0, 0, "+");
    return formattedNumber.join("");
  };

  const goBack = () => {
    navigate(-1);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    // reset,
  } = useForm<createFormData>({
    resolver: zodResolver(createFormData),
  });

  return (
    <form
      className={styles.form}
      // Сюда в аргемент собираются значения из формы
      onSubmit={handleSubmit(({ name, phone, email, message }) => {
        paymentRequestMutation.mutate({
          name,
          phone: formattedPhoneNumber,
          email,
          message,
          price: prices?.price || "",
          itemName: prices?.itemName || "",
        });
      })}
    >
      <FormField
        label={"ФИО *"}
        errorMessage={errors.name?.message}
        text={nameText}
        placeholder={"Введите"}
      >
        <input
          className={styles.input}
          value={nameText}
          {...register("name")}
          onChange={handleChangeName}
        />
      </FormField>
      <FormField
        label={"Телефон *"}
        errorMessage={errors.phone?.message}
        text={phoneText}
        placeholder="+7 (___) ___-__-__"
      >
        <input
          className={styles.input}
          value={phoneText}
          {...register("phone")}
          onChange={handleChangePhone}
        />
      </FormField>
      <FormField
        label={"Почта *"}
        errorMessage={errors.email?.message}
        text={emailText}
        placeholder={"Введите"}
      >
        <input
          className={styles.input}
          value={emailText}
          {...register("email")}
          onChange={handleChangeEmail}
        />
      </FormField>
      <FormField label={"Сообщение"} text={descrText} placeholder={"Введите"}>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          value={descrText}
          {...register("message")}
          onChange={handleChangeMessage}
        ></textarea>
      </FormField>

      <div className={styles["buttons-block"]}>
        <button
          type="button"
          onClick={goBack}
          className={`btn-reset ${styles["go-back-btn"]}`}
        >
          Назад
        </button>
        <button
          className={`btn-reset ${styles.submit}`}
          onClick={() => setIsFormFilled(true)}
          type="submit"
        >
          Перейти к оплате
        </button>
      </div>
    </form>
  );
};
