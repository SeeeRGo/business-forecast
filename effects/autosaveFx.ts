import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes, SaveData } from "@/types";
import { channel, supabase } from "@/utils/db";
import { createEffect } from "effector";

export const autosaveFx = createEffect(async ({ calcs, incomes, expenses, balances }: SaveData) => {
  await supabase
    .from("data")
    .update({
      calcs: JSON.stringify(calcs),
      initial_balances: JSON.stringify(balances),
      expenses: JSON.stringify(expenses),
      incomes: JSON.stringify(incomes), })
    .eq("variant_name", "Autosave")  
})

export const calcTableUpdateFx = createEffect(async (data: ParsedBudgetEntry[]) => {
  channel.send({
        type: "broadcast",
        event: "table-update",
        payload: data,
      });
})

export const initialBalanceUpdateFx = createEffect(async (data: IAccount[]) => {
  channel.send({
    type: "broadcast",
    event: "initial-balance-update",
    payload: data,
  })
})

export const incomeTableUpdateFx = createEffect(async (data: ParsedIncomes[]) => {
  channel.send({
    type: "broadcast",
    event: "income-update",
    payload: data,
  })
})

export const expenseTableUpdateFx = createEffect(async (data: ParsedExpenses[]) => {
  channel.send({
    type: "broadcast",
    event: "expense-update",
    payload: data,
  })
})
