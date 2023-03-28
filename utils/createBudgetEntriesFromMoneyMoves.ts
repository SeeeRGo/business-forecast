import { ParsedBudgetEntry, RegularMoneMove } from "@/types";
import { addMonths, differenceInMonths, isAfter, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const createBudgetEntriesFromMoneyMoves = (move: RegularMoneMove, accountOptions: string[], start?: Date, end?: Date): ParsedBudgetEntry[] => {
  const entries: ParsedBudgetEntry[] = [];
  if (start && end) {
    const months = differenceInMonths(end, start);
    let date = parseISO(start.toISOString());
    date.setDate(move.dayOfMonth)
    
    if (isAfter(start, date)) {
      date = addMonths(date, 1)
    }
    for (let i = 0; i <= months; i++) {
      const entry: ParsedBudgetEntry = {
        isIncluded: true,
        isSelected: false,
        id: uuidv4(),
        income: move.amount >= 0 ? move.amount : 0,
        expense: move.amount < 0 ? move.amount : 0,
        comment: move.comment,
        account: move.account,
        moneyMoveCategory: move.moneyMoveCategory,
        balances: accountOptions.map(account => ({
          name: account,
          balance: 0,
        })),
        date,
      };
      entries.push(entry);
      date = addMonths(date, 1);
    }
  }
  return entries;
}
