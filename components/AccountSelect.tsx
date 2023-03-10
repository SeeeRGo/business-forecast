import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  options: string[]
}
const AccountSelect = ({value, onChange, options}: Props) => {
  return (
    <select
      value={value}
      onChange={(ev) => onChange(ev.target.value)}
    >
      {options.map(option => (
        <option value={option} key={option}>{option}</option>
      ))}
    </select>
  );
}

export default AccountSelect;
