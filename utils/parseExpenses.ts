import { ParsedConstantMoneyMove } from "../types";

export const parseExpenses = (expenses: any[]): ParsedConstantMoneyMove[] =>
  expenses.map(([
    dayOfMonth,
    income,
    expense,
    description,
    account,
  ], i) => ({
    dayOfMonth,
    income: !income ? income : parseFloat(income),
    expense: !expense ? expense : parseFloat(expense),
    description,
    account,
  }));