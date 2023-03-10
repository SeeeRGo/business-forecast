import { parseISO } from "date-fns";
import { BudgetEntry, ParsedBudgetEntry } from "../types";

export const parseCalcs = (calcs: BudgetEntry[], headers: string[]): ParsedBudgetEntry[] => {
  return calcs.map(
    (
      [
        date,
        income,
        expense,
        comment,
        account,
        ...rest
      ]: BudgetEntry,
      i
    ) => {
      return {
        isIncluded: true,
        date:  parseISO(date),
        income: parseFloat(income || '0'),
        expense: parseFloat(expense || '0'),
        comment,
        account,
        balances: rest.map((_, i) => ({
          balance: 0,
          name: headers.at(i) || ''
        }))
      };
    }
  );
};
