import { ParsedExpenses } from "../types";

export const parseExpenses = (expenses: any[]): ParsedExpenses[] =>
  expenses.map(([
    dayOfMonth,
    expense,
    description,
    account,
  ], i) => ({
    dayOfMonth,
    expense: !expense ? expense : parseFloat(expense),
    description,
    account,
  }));