import { fetchDataFx } from "@/effects/getDataFx";
import { setCalcs } from "@/events/calcs";
import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import { combine, createStore } from "effector";

export const $calcs = createStore<ParsedBudgetEntry[]>([])
  .on(fetchDataFx.doneData, (_, { calcs }) => (calcs))
  .on(setCalcs, (_, calcs) => calcs)

export const $calcHeaders = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { calcHeaders }) => calcHeaders)

export const $incomes = createStore<ParsedIncomes[]>([])
  .on(fetchDataFx.doneData, (_, { incomes }) => incomes)

export const $incomeHeaders = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { incomeHeaders }) => incomeHeaders)

export const $expenses = createStore<ParsedExpenses[]>([])
  .on(fetchDataFx.doneData, (_, { expenses }) => expenses)

export const $expensesHeaders = createStore<string[]>([])
  .on(fetchDataFx.doneData, (_, { expenceHeaders }) => expenceHeaders)

export const $initialBalances = createStore<IAccount[]>([])
  .on(fetchDataFx.doneData, (_, { initialBalances }) => initialBalances)

export const $selectOptions = $calcHeaders.map(headers => headers.slice(7, -1))

export const $calcsData = combine(
  $calcs, $initialBalances,
  (calcs, initialBalances) => calculateBalances(calcs, initialBalances)
)