import React, { InputHTMLAttributes, useCallback } from 'react'

interface Props {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: InputHTMLAttributes<HTMLInputElement>['value'];
  min?: number;
  max?: number;
  onChange?: (value: string) => void;
}
const Input = ({ type, value, onChange, min, max }: Props) => {

  const handleChange = useCallback((value: string) => {
    
    if(!onChange) return
    if(max !== undefined && parseFloat(value) > max) {
      onChange(`${max}`)
    } else if (min !== undefined && parseFloat(value) < min) {
      onChange(`${min}`)
    } else {
      onChange(value)
    }
  }, [onChange, max, min])
  return (
    <input
      type={type}
      value={value}
      onChange={(ev) => handleChange(ev.target.value)}
    />
  );
}

export default Input;
