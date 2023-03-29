import { CategoryTarget } from '@/components/CategoryTarget'
import { $categoryTargetData } from '@/stores/calcs'
import { Typography } from '@mui/material'
import { useStore } from 'effector-react'
import React from 'react'

export const CategoryTargetsReport = () => {
  const categories = useStore($categoryTargetData)

  return (
    <div>
      <Typography variant='h5'>
        Цели по категориям
      </Typography>
      <div style={{ display: 'flex', columnGap: 16 }}>
        {categories.map(([category, target], i) => (
          <CategoryTarget key={i} category={category} target={target}  />
        ))}
      </div>
    </div>
  );
}