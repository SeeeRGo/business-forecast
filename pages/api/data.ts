// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { calculateBudget } from '../utils';

const url =
  "https://script.google.com/macros/s/AKfycbwnvwyuUfil4NtQlAKdagrz6EJijWi88rpU9Ou1f9myqWWk65TVjKQ57VtLYm3Qsby7fg/exec";

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { query, method } = req;
    const id = parseInt(query.id as string, 10);
    const res = await axios.get(url);
    const parsedCalcs = res.data.calcs.map((row, i) =>
        i <= 1
          ? ['', ...row]
          : [true, ...row.map((value, index) => {
            return (index >= row.length - 2 ? 0 : index === 5 && value ? value === "Счёт рублевый ООО" ? "OOO" : "IP" : value)
          })]
      )

    const parsedIncomes = res.data.income.map((row, i) =>
        i < 1
          ? [...row]
          : [
              ...row.map((value, index) => {
                return index === 4 && value
                  ? value === "Счёт рублевый ООО"
                    ? "OOO"
                    : "IP"
                  : value;
              }),
            ]
      )

    const parsedExpenses = res.data.expense.map((row, i) =>
        i < 1
          ? [...row]
          : [
              ...row.map((value, index) => {
                return index === 4 && value
                  ? value === "Счёт рублевый ООО"
                    ? "OOO"
                    : "IP"
                  : value;
              }),
            ]
      )
    const calculatedCalcs = calculateBudget(parsedCalcs, parsedIncomes, parsedExpenses, 4)
  res.status(200).json({ incomes: parsedIncomes, expenses: parsedExpenses, calcs: calculatedCalcs })
}
