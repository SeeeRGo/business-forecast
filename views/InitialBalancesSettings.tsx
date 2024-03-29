import Input from '@/components/Input';
import { initialBalanceUpdateFx } from '@/effects/autosaveFx';
import { setInitialBalance } from '@/events/calcs';
import { $initialBalances } from '@/stores/calcs';
import { Grid, Typography } from '@mui/material';
import { sample } from 'effector';
import { useStore } from 'effector-react';
import React from 'react';

sample({
  clock: setInitialBalance,
  target: initialBalanceUpdateFx,
});

export const InitialBalancesSettings = () => {
  const accounts = useStore($initialBalances)

  return (
    <div>
      <Typography variant="h6">Текущее состояние счетов</Typography>
      <Grid container rowSpacing={1} columnSpacing={2}>
        {accounts.map(({ name, balance }, i) => (
          <Grid item key={name}>
            <Typography>{name}</Typography>
            <Input
              value={balance}
              type="number"
              onChange={(value) => {
                let newState = [...accounts];

                newState[i] = {
                  ...newState[i],
                  balance: parseFloat(value),
                };

                setInitialBalance(newState);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
