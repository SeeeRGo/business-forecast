import React, { SelectHTMLAttributes } from 'react'
import { AccountType } from "../types";

interface Props {
  value: AccountType
  onChange: SelectHTMLAttributes<HTMLSelectElement>['onChange']
}
export const AccountSelect = ({value, onChange}: Props) => {
  return (
    <select
      value={value}
      onChange={onChange}
    >
      <option value={""}></option>
      <option value={"IP"}>Счёт рублевый ИП</option>
      <option value={"OOO"}>Счёт рублевый ООО</option>
      <option value={"Third"}>Счёт 3</option>
      <option value={"Fourth"}>Счёт 4</option>
    </select>
  );
}