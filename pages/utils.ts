import { add, parseISO } from "date-fns";
import { ConstantMoneyMove, ParsedBudgetEntry } from "./types";
import { parseAccountType } from "./utils/parseAccountType";

export const calculateBudget = (
  [head, initial, ...calcs]: ParsedBudgetEntry[],
  incomes: ConstantMoneyMove[],
  expenses: ConstantMoneyMove[],
  extrapolatedMonths: number
) => {
  let result = [...calcs];
  const baseTimestamp = calcs.reduce(
    (currentMin, entry) =>
      currentMin < entry.date.getTime() ? currentMin : entry.date.getTime(),
    initial.date.getTime()
  );
  const baseDate = new Date(baseTimestamp).setDate(1);
  for (let i = 0; i <= extrapolatedMonths; i++) {
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
  const sortedByDate = sortBudgetEntries(result)
  return [head, initial, ...sortedByDate];
};

export const sortBudgetEntries = (entries: ParsedBudgetEntry[]) =>
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

const createBudgetEntriesFromMoneyMoves = (
  [day, income, expense, comment, account]: ConstantMoneyMove,
  baseDate: Date,
  offset: number
): ParsedBudgetEntry => {
  return {
    isIncluded: true,
    date: add(baseDate, { months: offset, days: day - 1 }),
    income,
    expense,
    comment,
    account,
    balanceIP: 0,
    balanceOOO: 0,
    balanceThird: 0,
    balanceFourth: 0,
  };
};
