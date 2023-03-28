import { ParsedExpenses } from "../types";
import { v4 as uuidv4 } from "uuid";

export const parseExpenses = (expenses: any[]): ParsedExpenses[] =>
  expenses.map(([dayOfMonth, expense, description, account, moneyMoveCategory]) => ({
    dayOfMonth,
    id: uuidv4(),
    expense: !expense ? expense : parseFloat(expense),
    description,
    account,
    moneyMoveCategory
  }));