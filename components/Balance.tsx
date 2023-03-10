import React from "react";

interface Props {
  value: number;
}
export const Balance = ({ value }: Props) => {
  return (
    <span style={{ backgroundColor: value < 0 ? "#ff8080" : "" }}>
      {new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(value)}
    </span>
  );
};
