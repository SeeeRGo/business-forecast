import { MenuItem, Select } from '@mui/material'
import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  options: string[]
}
const AccountSelect = ({value, onChange, options}: Props) => {
  return (
    <Select
      value={value}
      sx={{
        '.MuiSelect-select': {
          padding: 0,
          minWidth: 200,
        }
      }}
      variant='standard'
      onChange={(ev) => onChange(ev.target.value)}
    >
      {options.map(option => (
        <MenuItem value={option} key={option}>{option}</MenuItem>
      ))}
    </Select>
  );
}

export default AccountSelect;
