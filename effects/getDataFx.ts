import { baseUrl } from "@/constants";
import { IAccount, ParsedExpenses, ParsedIncomes, SavedBudgetEntry } from "@/types";
import { supabase } from "@/utils/db";
import { parseAccounts } from "@/utils/parseAccounts";
import { parseCalcs } from "@/utils/parseCalcs";
import { parseExpenses } from "@/utils/parseExpenses";
import { parseIncomes } from "@/utils/parseIncomes";
import { calculateBudget } from "@/utils/utils";
import axios from "axios";
import { parseISO } from "date-fns";
import { createEffect } from "effector";

export const fetchDataFx = createEffect(async () => {
  const res = await axios.get(baseUrl);
  const parsedCalcs = parseCalcs(res.data.calcs, res.data.calcHeaders.slice(6));
  const parsedIncomes = parseIncomes(res.data.income);
  const parsedExpenses = parseExpenses(res.data.expense);
  const {
    calcInitial,
    calcHeaders,
    incomeHeaders,
    expenceHeaders,
    categoryHeaders,
    categoryData,
  } = res.data;
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
    moneyMoveCategory: Array.from(
      new Set(parsedCalcs.map(({ moneyMoveCategory }) => moneyMoveCategory))
    ),
    initialBalances: parsedInitial,
    calcHeaders: ["Учет", "Выбор", ...calcHeaders, "Действия"],
    incomeHeaders: [...incomeHeaders, "Действия"],
    expenceHeaders: [...expenceHeaders, "Действия"],
    categoryData,
    categoryHeaders,
  };
});

export const fetchCalcsFx = createEffect(async () => {
  const { data, error } = await supabase.from('data').select().eq('variant_name', 'Базовый')
  const parsedCalcs = JSON.parse(
    data?.at(0)?.calcs ?? "[]"
  ) as SavedBudgetEntry[];
  return parsedCalcs.map(({ date, ...rest }) => ({
    date: parseISO(date),
    ...rest
  }))
})

export const fetchCalcsHeadersFx = createEffect(async () => {
  const { data: variants, error } = await supabase
    .from("data")
    .select()
    .eq("variant_name", "Базовый");
  const variant_id = variants?.at(0)?.id;
  if (variant_id) {
    const { data, error } = await supabase.from('headers').select().eq('variant_id', variant_id)
    const parsedCalcHeaders = JSON.parse(
      data?.at(0)?.calcHeaders ?? "[]"
    ) as string[];
    return parsedCalcHeaders;
  }
  return []
})

export const fetchIncomeHeadersFx = createEffect(async () => {
  const { data: variants, error } = await supabase
    .from("data")
    .select()
    .eq("variant_name", "Базовый");
  const variant_id = variants?.at(0)?.id;
  if (variant_id) {
    const { data, error } = await supabase.from('headers').select().eq('variant_id', variant_id)
    const parsedIncomeHeaders = JSON.parse(
      data?.at(0)?.incomeHeaders ?? "[]"
    ) as string[];
    return parsedIncomeHeaders;
  }
  return []
})

export const fetchExpenseHeadersFx = createEffect(async () => {
  const { data: variants, error } = await supabase
    .from("data")
    .select()
    .eq("variant_name", "Базовый");
  const variant_id = variants?.at(0)?.id
  if (variant_id) {
    const { data, error } = await supabase.from('headers').select().eq('variant_id', variant_id)
    const parsedExpenseHeaders = JSON.parse(
      data?.at(0)?.expenseHeaders ?? "[]"
    ) as string[];
    return parsedExpenseHeaders;
  }
  return []
})

export const fetchIncomesFx = createEffect(async () => {
  const { data, error } = await supabase.from('data').select().eq('variant_name', 'Базовый')
  const parsedIncomes = JSON.parse(
    data?.at(0)?.incomes ?? "[]"
  ) as ParsedIncomes[];  
  return parsedIncomes
})

export const fetchExpensesFx = createEffect(async () => {
  const { data, error } = await supabase.from('data').select().eq('variant_name', 'Базовый')
  const parsedExpenses = JSON.parse(
    data?.at(0)?.expenses ?? "[]"
  ) as ParsedExpenses[];
  return parsedExpenses
})

export const fetchInitialBalancesFx = createEffect(async () => {
  const { data, error } = await supabase.from('data').select().eq('variant_name', 'Базовый')
  const parsedExpenses = JSON.parse(
    data?.at(0)?.initial_balances ?? "[]"
  ) as IAccount[];
  return parsedExpenses
})
