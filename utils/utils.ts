import { add } from "date-fns";
import { IAccount, ParsedBudgetEntry, ParsedConstantMoneyMove, ParsedExpenses, ParsedIncomes } from "../types";

export const calculateBudget = (
  calcs: ParsedBudgetEntry[],
  incomes: ParsedIncomes[],
  expenses: ParsedExpenses[],
  extrapolatedMonths: number,
  offsetMonths: number = 0
) => {
  let result = [...calcs];
  const baseTimestamp = calcs.reduce(
    (currentMin, entry) =>
      currentMin < entry.date.getTime() ? currentMin : entry.date.getTime(),
      calcs.at(0)?.date.getTime() || 0
  );
  const baseBalances = (calcs.at(0)?.balances ?? [] as IAccount[]).map(({ name }) => ({ name, balance: 0 }))
  const baseDate = new Date(baseTimestamp).setDate(1);
  for (let i = offsetMonths; i < extrapolatedMonths + offsetMonths; i++) {
    
    result = result.concat(
      incomes
        .map((move) => createBudgetEntriesFromMoneyMoves({
          ...move,
          expense: 0,
        }, baseDate, baseBalances , i))
    );
    result = result.concat(
      expenses
        .map((move) => createBudgetEntriesFromMoneyMoves({
          ...move,
          income: 0
        }, baseDate, baseBalances, i))
    );
  }
  const sortedByDate = sortBudgetEntries(result);
  return sortedByDate;
};

export const sortBudgetEntries = (entries: ParsedBudgetEntry[]) =>
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

const createBudgetEntriesFromMoneyMoves = (
  { dayOfMonth: dayOfTheMonth, income, expense, description, account, id }: ParsedConstantMoneyMove,
  baseDate: Date | number,
  balances: IAccount[],
  offset: number
): ParsedBudgetEntry => {
  return {
    isIncluded: true,
    isSelected: false,
    id,
    date: add(baseDate, { months: offset, days: dayOfTheMonth - 1 }),
    income,
    expense,
    comment: description,
    account,
    balances
  };
};
