import { baseUrl } from "@/constants";
import { parseAccounts } from "@/utils/parseAccounts";
import { parseCalcs } from "@/utils/parseCalcs";
import { parseExpenses } from "@/utils/parseExpenses";
import { parseIncomes } from "@/utils/parseIncomes";
import { calculateBudget } from "@/utils/utils";
import axios from "axios";
import { createEffect } from "effector"

export const fetchDataFx = createEffect(async () => {
  const res = await axios.get(baseUrl);
  const parsedCalcs = parseCalcs(
    res.data.calcs,
    res.data.calcHeaders.slice(6)
  );
  const parsedIncomes = parseIncomes(res.data.income);
  const parsedExpenses = parseExpenses(res.data.expense);
  const { calcInitial, calcHeaders, incomeHeaders, expenceHeaders } =
    res.data;
  const parsedInitial = parseAccounts(
    calcHeaders.slice(6),
    calcInitial.slice(6)
  );
  const calculatedCalcs = calculateBudget(
    parsedCalcs,
    parsedIncomes,
    parsedExpenses,
    0
  );
  return {
    calcs: calculatedCalcs,
    expenses: parsedExpenses,
    incomes: parsedIncomes,
    moneyMoveCategory: Array.from(new  Set(parsedCalcs.map(({ moneyMoveCategory }) => moneyMoveCategory))),
    initialBalances: parsedInitial,
    calcHeaders: ["Учет", "Выбор", ...calcHeaders, "Действия"],
    incomeHeaders: [...incomeHeaders, "Действия"],
    expenceHeaders: [...expenceHeaders, "Действия"]
  }
})
