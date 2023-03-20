import { ParsedBudgetEntry } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const createBudgetEntry = (source: ParsedBudgetEntry): ParsedBudgetEntry => ({
  isIncluded: true,
  isSelected: false,
  date: source.date,
  income: 0,
  expense: 0,
  comment: "",
  account: source.balances.at(0)?.name ?? '',
  id: uuidv4(),
  balances: source.balances.map(({ balance, ...rest }) => ({
    balance: 0,
    ...rest,
  })),
})
