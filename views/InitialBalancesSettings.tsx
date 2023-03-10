import Input from '@/components/Input';
import { IAccount } from '@/types';
import { createInputRenderer } from '@/utils/createInputRender';
import React from 'react';

interface Props {
  accounts: IAccount[]
  updateAccounts: (account: IAccount[]) => void
}
export const InitialBalancesSettings = ({ accounts, updateAccounts }: Props) => {
  return (
    <div>
      Текущее состояние счетов
      {accounts.map(({ name, balance }, i) => (
        <>
          <div key={name}>
            {name}
            &nbsp;
            Баланс
          </div>
          <Input
            value={balance}
            type='number'
            onChange={(value) => {
              let newState = [...accounts];
          
              newState[i] = {
                ...newState[i],
                balance: parseFloat(value)
              };
          
              updateAccounts(newState);
            }}
          />
        </>
      ))}
    </div>
  )
}
