import { TextField } from '@mui/material';
import React, { InputHTMLAttributes, useCallback } from 'react'

interface Props {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: InputHTMLAttributes<HTMLInputElement>['value'];
  name: string;
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
    <TextField
      sx={{
        ".MuiInputBase-input": {
          padding: 0,
          maxWidth: 100,
        },
      }}
      name={name}
      value={value}
      type={type}
      onChange={ (ev) => {
          console.log("ev", ev);

          return handleChange(ev.target.value);
        }}
    />
  );
}

export default Input;
