import { parseAccountType } from "./parseAccountType";

export const parseExpenses = (expenses: any[]) =>
  expenses.map((row, i) =>
    i < 1
      ? [...row]
      : [
          ...row.map((value, index) => {
            return index === 4 ? parseAccountType(value) : value;
          }),
        ]
  );