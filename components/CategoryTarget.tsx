import { $calcs, $monthsCalculated } from '@/stores/calcs'
import { Typography } from '@mui/material'
import { endOfMonth, format, isAfter, isSameMonth, parseISO, startOfMonth } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useStore } from 'effector-react'
import React, { useEffect, useMemo, useState } from 'react'
import AccountSelect from './AccountSelect'
import { Balance } from './Balance'

interface Props {
  category: string
  target: number
}
export const CategoryTarget = ({ category, target }: Props) => {
  const options = useStore($monthsCalculated)
  const calcs = useStore($calcs)
  const parsedOptions = useMemo(() => options.map(option => format(parseISO(option), 'LLLL yyyy', { locale: ru })), [options])
  const [selectedMonth, setSelectedMonth] = useState(parsedOptions[0])

  const month = parsedOptions.findIndex(option => option === selectedMonth)
  const dateISO = options[month]
  const dateToCompare = parseISO(dateISO)

  const monthlyCalcs = calcs.filter(({ date, moneyMoveCategory }) => isSameMonth(date, dateToCompare) && moneyMoveCategory === category).reduce(
    (sum, { income, expense }) => sum + (income || 0) + (expense || 0),
    0
  )

  useEffect(() => {
    if(parsedOptions.length) {
      setSelectedMonth(parsedOptions[0])
    }
  }, [parsedOptions])
  return (
    <div>
      <Typography>{category}</Typography>
      <Typography><Balance value={target} /></Typography>
      <Typography>Отчет За</Typography>
      <AccountSelect value={selectedMonth} options={parsedOptions} onChange={setSelectedMonth} />
      <Typography>Расходы за <Balance value={monthlyCalcs} /></Typography>
      <Typography>Разница с планом за месяц <Balance value={target + monthlyCalcs} /></Typography>
    </div>
  )
}