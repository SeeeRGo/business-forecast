import { add } from "date-fns";
import { ParsedBudgetEntry, ParsedConstantMoneyMove } from "../types";

export const calculateBudget = (
  [head, initial, ...calcs]: ParsedBudgetEntry[],
  incomes: ParsedConstantMoneyMove[],
  expenses: ParsedConstantMoneyMove[],
  extrapolatedMonths: number,
  offsetMonths: number = 0
) => {
  let result = [...calcs];
  const baseTimestamp = calcs.reduce(
    (currentMin, entry) =>
      currentMin < entry.date.getTime() ? currentMin : entry.date.getTime(),
    initial.date.getTime()
  );
  const baseDate = new Date(baseTimestamp).setDate(1);
  for (let i = offsetMonths; i < extrapolatedMonths + offsetMonths; i++) {
    console.log('offsetMonths', offsetMonths);
    console.log('i', i);
    console.log('extrapolatedMonths + offsetMonths', extrapolatedMonths + offsetMonths);
    
    result = result.concat(
      incomes
        .slice(1)
        .map((move) => createBudgetEntriesFromMoneyMoves(move, baseDate, i))
    );
    result = result.concat(
      expenses
        .slice(1)
        .map((move) => createBudgetEntriesFromMoneyMoves(move, baseDate, i))
    );
  }
  const sortedByDate = sortBudgetEntries(result);
  return [head, initial, ...sortedByDate];
};

export const sortBudgetEntries = (entries: ParsedBudgetEntry[]) =>
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

const createBudgetEntriesFromMoneyMoves = (
  { dayOfMonth: dayOfTheMonth, income, expense, description, account }: ParsedConstantMoneyMove,
  baseDate: Date | number,
  offset: number
): ParsedBudgetEntry => {
  return {
    isIncluded: true,
    date: add(baseDate, { months: offset, days: dayOfTheMonth - 1 }),
    income,
    expense,
    comment: description,
    account,
    balanceIP: 0,
    balanceOOO: 0,
    balanceThird: 0,
    balanceFourth: 0,
  };
};
