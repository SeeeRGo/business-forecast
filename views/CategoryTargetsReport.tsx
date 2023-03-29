import AccountSelect from '@/components/AccountSelect'
import { $categoryTargetData, $categoryTargetHeaders, $moneyMoveCategories, $monthsCalculated } from '@/stores/calcs'
import { Typography } from '@mui/material'
import { useStore } from 'effector-react'
import React from 'react'

export const CategoryTargetsReport = () => {
  const categories = useStore($categoryTargetData)
  const categoryHeaders = useStore($categoryTargetHeaders)
  const options = useStore($monthsCalculated)

  return (
    <div>
      Цели по категориям
      {categories.map(([category, target], i) => (
        <span key={i}>
          <Typography>{category}</Typography>
          <Typography>{target}</Typography>
          <Typography>Отчет За</Typography>
          <AccountSelect value={options[0]} options={options} onChange={() => {}} />
          <Typography>Тут посчитанная цифра за месяц</Typography>
        </span>
      ))}
    </div>
  );
}