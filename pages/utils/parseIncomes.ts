import { parseAccountType } from "./parseAccountType";

export const parseIncomes = (incomes: any[]) =>
  incomes.map((row, i) =>
    i < 1
      ? [...row]
      : [
          ...row.map((value, index) => {
            return index === 4 ? parseAccountType(value) : value;
          }),
        ]
  );