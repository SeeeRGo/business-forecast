import { ParsedIncomes } from "../types";

export const parseIncomes = (incomes: any[]): ParsedIncomes[] =>
  incomes.map(([dayOfMonth, income, description, account], i) => ({
    dayOfMonth,
    income: !income ? income : parseFloat(income),
    description,
    account,
  }));
  