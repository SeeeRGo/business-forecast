import { fetchCalcsFx, fetchCalcsHeadersFx, fetchDataFx, fetchExpenseHeadersFx, fetchExpensesFx, fetchIncomeHeadersFx, fetchIncomesFx, fetchInitialBalancesFx } from "@/effects/getDataFx";
import { createHistory } from "@/effects/history";
import { setCalcs, setCalcsExternal, setExpenses, setExpensesExternal, setIncomes, setIncomesExternal, setInitialBalance, setInitialBalanceExternal } from "@/events/calcs";
import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import { sortBudgetEntries } from "@/utils/utils";
import { add, differenceInCalendarMonths, differenceInMonths, format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { combine, createStore } from "effector";

export const $calcs = createStore<ParsedBudgetEntry[]>([])
  .on(fetchCalcsFx.doneData, (_, calcs) => (calcs))
  .on(setCalcs, (_, calcs) => calcs)
  .on(setCalcsExternal, (_, calcs) => calcs.map((entry) => ({
                        ...entry,
                        date: parseISO(entry.date)}
                        )))

export const $calcHeaders = createStore<string[]>([]).on(
  fetchCalcsHeadersFx.doneData,
  (_, calcHeaders) => ["Учет", "Выбор", ...calcHeaders, "Действия"]
);

export const $incomes = createStore<ParsedIncomes[]>([])
  .on(fetchIncomesFx.doneData, (_, incomes) => incomes)
  .on(setIncomes, (_, incomes) => incomes)
  .on(setIncomesExternal, (_, incomes) => incomes)

export const $incomeHeaders = createStore<string[]>([]).on(
  fetchIncomeHeadersFx.doneData,
  (_, incomeHeaders) => [...incomeHeaders, "Действия"]
);

export const $expenses = createStore<ParsedExpenses[]>([])
  .on(fetchExpensesFx.doneData, (_, expenses) => expenses)
  .on(setExpenses, (_, expenses) => expenses)
  .on(setExpensesExternal, (_, expenses) => expenses)

export const $expensesHeaders = createStore<string[]>([]).on(
  fetchExpenseHeadersFx.doneData,
  (_, expenceHeaders) => [...expenceHeaders, "Действия"]
);

export const $initialBalances = createStore<IAccount[]>([])
  .on(
    fetchInitialBalancesFx.doneData,
    (_, initialBalances) => initialBalances
  )
  .on(setInitialBalance, (_, initialBalances) => initialBalances)
  .on(setInitialBalanceExternal, (_, initialBalances) => initialBalances);

export const $selectOptions = $initialBalances.map(balances => balances.map(({ name }) => name))

export const $monthsCalculated = $calcs.map(calcs => {
    const sortedCalcs = sortBudgetEntries(calcs);
    const earliestDate = sortedCalcs.at(0)?.date;
    const latestDate = sortedCalcs.at(-1)?.date;
    let date = earliestDate
    const result: string[] = []
    if (earliestDate && latestDate && date) {
      const months = differenceInCalendarMonths(latestDate, earliestDate)
      result.push(date.toISOString());
      for (let i = 0; i < months; i++) {
        date = add(date, {months: 1 })
        const formattedDate = date.toISOString();
        result.push(formattedDate);
      }
    }
    return result;
})

export const $calcsData = combine(
  $calcs, $initialBalances,
  (calcs, initialBalances) => calculateBalances(calcs, initialBalances)
)
export const $moneyMoveCategories = $calcs.map(calcs => Array.from(new Set(calcs.map(({ moneyMoveCategory }) => moneyMoveCategory))))

export const $categoryTargetData = createStore<Array<[name: string, target: number]>>([]).on(
  fetchDataFx.doneData,
  (_, { categoryData }) => categoryData
);

export const $categoryTargetHeaders = createStore<string[]>([]).on(
  fetchDataFx.doneData,
  (_, { categoryHeaders }) => categoryHeaders
);

export const calcsHistory = createHistory({
  store: $calcs,
  events: [setCalcs, setCalcsExternal],
  limit: 30,
})

