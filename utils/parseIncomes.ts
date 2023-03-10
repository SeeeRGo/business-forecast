import { ParsedConstantMoneyMove } from "../types";
import { parseAccountType } from "./parseAccountType";

export const parseIncomes = (incomes: any[]): ParsedConstantMoneyMove[] =>
  incomes.map(([dayOfMonth, income, expense, description, account], i) => ({
    dayOfMonth,
    income: !income ? income : parseFloat(income),
    expense: !expense ? expense : parseFloat(expense),
    description,
    account: parseAccountType(account),
  }));