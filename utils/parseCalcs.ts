import { parseISO } from "date-fns";
import { BudgetEntry, ParsedBudgetEntry } from "../types";
import { parseAccountType } from "./parseAccountType";

const parseMoney = (maybeMoney: string) => {
  return maybeMoney
    ? parseFloat(maybeMoney)
    : 0;
}
export const parseCalcs = (calcs: BudgetEntry[]): ParsedBudgetEntry[] => {
  return calcs.map(
    (
      [
        date,
        income,
        expense,
        comment,
        account,
        balanceIP,
        balanceOOO,
        balanceThird,
        balanceFourth,
      ]: BudgetEntry,
      i
    ) => {
      return {
        isIncluded: true,
        date:  parseISO(date),
        income: parseFloat(income || '0'),
        expense: parseFloat(expense || '0'),
        comment,
        account: parseAccountType(account),
        balanceIP: parseMoney(balanceIP),
        balanceOOO: parseMoney(balanceOOO),
        balanceThird: parseMoney(balanceThird),
        balanceFourth: parseMoney(balanceFourth),
      };
    }
  );
};
