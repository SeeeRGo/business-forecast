import { TextField } from '@mui/material';
import React, { InputHTMLAttributes, useCallback } from 'react'

interface Props {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: InputHTMLAttributes<HTMLInputElement>['value'];
  label?: string;
  min?: number;
  max?: number;
  onChange?: (value: string) => void;
}
const Input = ({ type, value, onChange, min, max, label }: Props) => {
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
      variant='standard'
      label={label}
      InputProps={{
        disableUnderline: true,
      }}
      sx={{
        ".MuiInputBase-input": {
          padding: 0,
          width: 100,
          minWidth: 100,
        },
      }}
      value={value}
      type={type}
      onChange={(ev) => {
          handleChange(ev.target.value);
        }}
    />
  );
}

export default Input;
