import { AccountType, ParsedBudgetEntry } from "../types";

const calcAddedBalance = (
  income: number | string,
  expense: number | string,
  account: AccountType,
  targetAccount: AccountType
) =>
  account === targetAccount
    ? (parseFloat(`${income}`) || 0) + (parseFloat(`${expense}`) || 0)
    : 0;
const calculateRowBalance = (
  currentRow: ParsedBudgetEntry,
  prevRow?: ParsedBudgetEntry,
) => {
  const { account, income, expense } = currentRow;
  const { balanceFourth, balanceIP, balanceOOO, balanceThird } = prevRow ?? {
    balanceFourth: 0,
    balanceIP: 0,
    balanceOOO: 0,
    balanceThird: 0,
  };
  
  return {
    ...currentRow,
    balanceFourth:
      balanceFourth + calcAddedBalance(income, expense, account, "Fourth"),
    balanceIP: balanceIP + calcAddedBalance(income, expense, account, "IP"),
    balanceOOO: balanceOOO + calcAddedBalance(income, expense, account, 'OOO'),
    balanceThird: balanceThird + calcAddedBalance(income, expense, account, 'Third'),
  };
};
export const calculateBalances = (
  values: ParsedBudgetEntry[],
  initialState?: ParsedBudgetEntry
) => {
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const currentRow = values[i];
    const prevRow = result.length ? result[i - 1] : initialState;
    const updatedCurrentRow = calculateRowBalance(currentRow, prevRow);
    result.push(updatedCurrentRow);
  }  
  return result;
};
