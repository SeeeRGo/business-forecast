import { IAccount, ParsedBudgetEntry } from "../types";

const calcAddedBalance = (
  income: number | string,
  expense: number | string,
) => (parseFloat(`${income}`) || 0) + (parseFloat(`${expense}`) || 0)

const calculateRowBalance = (
  currentRow: ParsedBudgetEntry,
  prevRow?: IAccount[],
) => {
  const { income, expense, account, isIncluded } = currentRow;
  
  return {
    ...currentRow,
    balances: currentRow.balances.map(({ name }, i) => ({
      name,
      balance: isIncluded && prevRow?.at(i)?.name && prevRow?.at(i)?.name === account ? (prevRow?.at(i)?.balance ?? 0) + calcAddedBalance(income, expense) : (prevRow?.at(i)?.balance ?? 0),
    }))
  };
};
export const calculateBalances = (
  values: ParsedBudgetEntry[],
  initialState?: IAccount[]
) => {
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const currentRow = values[i];
    const prevRow = result.length ? result[i - 1].balances : initialState;
    const updatedCurrentRow = calculateRowBalance(currentRow, prevRow);
    result.push(updatedCurrentRow);
  }  
  return result;
};
