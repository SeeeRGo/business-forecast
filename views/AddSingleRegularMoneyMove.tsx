import AccountSelect from '@/components/AccountSelect';
import Input from '@/components/Input';
import { setCalcs } from '@/events/calcs';
import { $calcs, $moneyMoveCategories, $selectOptions } from '@/stores/calcs';
import { createBudgetEntriesFromMoneyMoves } from '@/utils/createBudgetEntriesFromMoneyMoves';
import { sortBudgetEntries } from '@/utils/utils';
import { Button, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isValid } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useStore } from 'effector-react';
import React, { useEffect, useState } from 'react'

export const AddSingleRegularMoneyMove = () => {
  const [amount, setAmount] = useState('0')
  const [dayOfMonth, setDayOfMonth] = useState('1')
  const selectOptions = useStore($selectOptions)
  const [account, setAccount] = useState(selectOptions[0] ?? '')
  const [comment, setComment] = useState('')
  const [start, setStart] = useState<string | Date | null>(null)
  const [end, setEnd] = useState<string | Date | null>(null)
  const calcs = useStore($calcs)
  const categoryOptions = useStore($moneyMoveCategories)
  const [category, setCategory] = useState(categoryOptions[0] ?? '');  

  useEffect(() => {
    if(selectOptions.length) {      
      setAccount(selectOptions[0])
    }
  }, [selectOptions.length])
  useEffect(() => {
    if (categoryOptions.length) {
      setAccount(categoryOptions[0]);
    }
  }, [categoryOptions.length]);

  const sortedCalcs = sortBudgetEntries(calcs);
  const earliestDate = sortedCalcs.at(0)?.date;
  const latestDate = sortedCalcs.at(-1)?.date;
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center'}}>
    <Input label={'День Месяца'} type='number' value={dayOfMonth} onChange={setDayOfMonth} />
    <Input label={'Сумма'} type='number' value={amount} onChange={setAmount} />
    <AccountSelect
      value={account}
      label={'Счет'}
      onChange={setAccount}
      options={selectOptions}
    />
    <AccountSelect
      value={category}
      label={'Статья бюджета'}
      onChange={setCategory}
      options={categoryOptions}
    />
    <TextField
        variant='standard'
        multiline
        maxRows={4}
        value={comment}
        onChange={(ev) => {setComment(ev.target.value)}}
        label={'Комментарий'}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          ".MuiInputBase-input": {
            padding: 0,
            width: 250,
            maxWidth: 250,
          },
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <DatePicker
          value={start}
          label={'Дата Начала'}
          sx={{
            ".MuiInputBase-input": {
              width: 150,
              maxWidth: 200,
            },
          }}
          onChange={setStart}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <DatePicker
          value={end}
          label={'Дата Окончания'}
          sx={{
            ".MuiInputBase-input": {
              width: 150,
              maxWidth: 200,
            },
          }}
          onChange={setEnd}
        />
      </LocalizationProvider>
    <Typography variant="h6">
      Регулярность (ежемесячно)
    </Typography>
    <Button
      onClick={() => {
        const startDate = start instanceof Date && isValid(start) ? start : earliestDate
        const endDate = end instanceof Date && isValid(end) ? end : latestDate
        
        const result = createBudgetEntriesFromMoneyMoves({
          amount: parseFloat(amount),
          dayOfMonth: parseFloat(dayOfMonth),
          account,
          comment,
          moneyMoveCategory: category,
          regularity: 'monthly'
        }, selectOptions, startDate, endDate)

        setCalcs(sortBudgetEntries([...calcs, ...result]))
      }}
    >
      Добавить регулярное движение средств
    </Button>
    </div>
  )
}