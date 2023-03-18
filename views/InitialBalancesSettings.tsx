import Input from '@/components/Input';
import { IAccount } from '@/types';
import { createInputRenderer } from '@/utils/createInputRender';
import { Grid, Typography } from '@mui/material';
import React from 'react';

interface Props {
  accounts: IAccount[]
  updateAccounts: (account: IAccount[]) => void
}
export const InitialBalancesSettings = ({ accounts, updateAccounts }: Props) => {
  return (
    <div>
      <Typography variant="h6">Текущее состояние счетов</Typography>
      <Grid container rowSpacing={1}>
        {accounts.map(({ name, balance }, i) => (
          <Grid xs={6} sm={4} item key={name}>
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

                updateAccounts(newState);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
