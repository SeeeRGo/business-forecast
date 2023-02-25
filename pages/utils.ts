import { add, parseISO } from "date-fns";
import { BudgetEntry, ConstantMoneyMove, MoneyMove } from "./types";

export const calculateBudget = (
  [head, initial, ...calcs]: BudgetEntry[],
  incomes: ConstantMoneyMove[],
  expenses: ConstantMoneyMove[],
  extrapolatedMonths: number
) => {
  let result = [...calcs];
  const baseTimestamp = calcs.reduce(
    (currentMin, entry) =>
      currentMin < parseISO(entry[1]).getTime()
        ? currentMin
        : parseISO(entry[1]).getTime(),
    parseISO(initial[1]).getTime()
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
  const sortedByDate = result.sort(
    (a, b) => parseISO(a[1]).getTime() - parseISO(b[1]).getTime()
  );
  return [head, initial, ...sortedByDate];
};

const createBudgetEntriesFromMoneyMoves = (
  [day, income, expense, description, account]: MoneyMove,
  baseDate: Date,
  offset: number
): BudgetEntry => {
  return [
    true,
    add(baseDate, { months: offset, days: day - 1 }).toISOString(),
    income,
    expense,
    description,
    "",
    account,
    "",
    0,
    0,
  ];
};
