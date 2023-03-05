import { parseISO } from "date-fns";
import { timeFormat } from "../constants";
import { BudgetEntry } from "../types";
import { parseAccountType } from "./parseAccountType";

const parseMoney = (maybeMoney: string, rowIndex: number) => {
  return rowIndex === 0
    ? maybeMoney
    : rowIndex === 1 && maybeMoney
    ? parseFloat(maybeMoney)
    : 0;
}
export const parseCalcs = (calcs: BudgetEntry[]): ParsedBudgetEntry => {
  return calcs.map(
    (
      [
        date,
        income,
        expense,
        comment,
        variantName,
        account,
        entry,
        balanceIP,
        balanceOOO,
        balanceThird,
        balanceFourth,
      ]: BudgetEntry,
      i
    ) => {
      return {
        isIncluded: i === 0 ? 'Included' : true,
        date: i === 0 ? date : parseISO(date),
        income: income && i > 1 ? parseFloat(income) : income,
        expense: expense && i > 1 ? parseFloat(expense) : expense,
        comment,
        account: i === 0 ? account : parseAccountType(account),
        balanceIP: parseMoney(balanceIP, i),
        balanceOOO: parseMoney(balanceOOO, i),
        balanceThird: parseMoney(balanceThird, i),
        balanceFourth: parseMoney(balanceFourth, i),
      };
    }
  );
};
