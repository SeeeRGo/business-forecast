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
  prevRow: ParsedBudgetEntry,
  currentRow: ParsedBudgetEntry
) => {
  const { account, income, expense } = currentRow;
  const { balanceFourth, balanceIP, balanceOOO, balanceThird } = prevRow;
  
  return {
    ...currentRow,
    balanceFourth:
      balanceFourth + calcAddedBalance(income, expense, account, "Fourth"),
    balanceIP: balanceIP + calcAddedBalance(income, expense, account, "IP"),
    balanceOOO: balanceOOO + calcAddedBalance(income, expense, account, 'OOO'),
    balanceThird: balanceThird + calcAddedBalance(income, expense, account, 'Third'),
  };
};
export const calculateBalances = (values: ParsedBudgetEntry[]) => {
  const result = [values[0], values[1]];
  for (let i = 2; i < values.length; i++) {
    const currentRow = values[i];
    const prevRow = result[i - 1];
    const updatedCurrentRow = calculateRowBalance(prevRow, currentRow);
    result.push(updatedCurrentRow);
  }
  return result;
};
