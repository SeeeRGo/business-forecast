import { ParsedIncomes } from "../types";
import { v4 as uuidv4 } from "uuid";

export const parseIncomes = (incomes: any[]): ParsedIncomes[] =>
  incomes.map(([dayOfMonth, income, description, account, moneyMoveCategory]) => ({
    dayOfMonth,
    id: uuidv4(),
    income: !income ? income : parseFloat(income),
    description,
    account,
    moneyMoveCategory,
  }));
  