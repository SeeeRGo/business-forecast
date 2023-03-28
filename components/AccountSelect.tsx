import { MenuItem, Select } from '@mui/material'
import React from 'react'

interface Props {
  value: string
  label?: string
  onChange: (value: string) => void
  options: string[]
}
const AccountSelect = ({value, onChange, options, label}: Props) => {
  return (
    <Select
      value={value}
      label={label}
      variant='standard'
      disableUnderline
      sx={{
        ".MuiInputBase-input": {
          padding: 0,
          width: 200,
          maxWidth: 200,
        },
      }}
      onChange={(ev) => onChange(ev.target.value)}
    >
      {options.map(option => (
        <MenuItem value={option} key={option}>{option}</MenuItem>
      ))}
    </Select>
  );
}

export default AccountSelect;
