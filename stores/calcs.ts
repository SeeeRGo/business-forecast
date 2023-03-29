import { fetchDataFx } from "@/effects/getDataFx";
import { setCalcs, setExpenses, setIncomes, setInitialBalance } from "@/events/calcs";
import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import { sortBudgetEntries } from "@/utils/utils";
import { add, differenceInCalendarMonths, differenceInMonths, format } from "date-fns";
import { ru } from "date-fns/locale";
import { combine, createStore } from "effector";

export const $calcs = createStore<ParsedBudgetEntry[]>([])
  .on(fetchDataFx.doneData, (_, { calcs }) => (calcs))
  .on(setCalcs, (_, calcs) => calcs)

export const $calcHeaders = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { calcHeaders }) => calcHeaders)

export const $incomes = createStore<ParsedIncomes[]>([])
  .on(fetchDataFx.doneData, (_, { incomes }) => incomes)
  .on(setIncomes, (_, incomes) => incomes)

export const $incomeHeaders = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { incomeHeaders }) => incomeHeaders)

export const $expenses = createStore<ParsedExpenses[]>([])
  .on(fetchDataFx.doneData, (_, { expenses }) => expenses)
  .on(setExpenses, (_, expenses) => expenses)

export const $expensesHeaders = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { expenceHeaders }) => expenceHeaders)

export const $initialBalances = createStore<IAccount[]>([])
  .on(fetchDataFx.doneData, (_, { initialBalances }) => initialBalances)
  .on(setInitialBalance, (_, initialBalances) => initialBalances)

export const $selectOptions = $calcHeaders.map(headers => headers.slice(7, -1))

export const $monthsCalculated = $calcs.map(calcs => {
    const sortedCalcs = sortBudgetEntries(calcs);
    const earliestDate = sortedCalcs.at(0)?.date;
    const latestDate = sortedCalcs.at(-1)?.date;
    let date = earliestDate
    const result: string[] = []
    console.log("earliestDate", earliestDate);
    console.log("latestDate", latestDate);
    
    if (earliestDate && latestDate && date) {
      const months = differenceInCalendarMonths(latestDate, earliestDate)
      
      for (let i = 0; i <= months; i++) {
        date = add(date, {months: i })
        const formattedDate = format(date, "LLLL yyyy", { locale: ru });
        result.push(formattedDate);
      }
    }
    return result;
})

export const $calcsData = combine(
  $calcs, $initialBalances,
  (calcs, initialBalances) => calculateBalances(calcs, initialBalances)
)
export const $moneyMoveCategories = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { moneyMoveCategory }) => moneyMoveCategory)

export const $categoryTargetData = createStore<Array<[name: string, target: number]>>([]).on(
  fetchDataFx.doneData,
  (_, { categoryData }) => categoryData
);

export const $categoryTargetHeaders = createStore<string[]>([]).on(
  fetchDataFx.doneData,
  (_, { categoryHeaders }) => categoryHeaders
);
