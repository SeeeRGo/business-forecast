import React, { InputHTMLAttributes } from 'react'

interface Props {
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  value: InputHTMLAttributes<HTMLInputElement>['value'];
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
}
const Input = ({ type, value, onChange }: Props) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}

export default Input;