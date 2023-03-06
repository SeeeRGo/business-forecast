import { ParsedConstantMoneyMove } from "../types";
import { parseAccountType } from "./parseAccountType";

export const parseExpenses = (expenses: any[]): ParsedConstantMoneyMove[] =>
  expenses.map(([
    dayOfMonth,
    income,
    expense,
    description,
    account,
  ], i) => ({
    dayOfMonth,
    income: i === 0 || !income ? income : parseFloat(income),
    expense: i === 0 || !expense ? expense : parseFloat(expense),
    description,
    account: i === 0 ? account : parseAccountType(account)
  }));