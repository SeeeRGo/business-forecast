import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes } from "@/types";
import { channel, supabase } from "@/utils/db";
import { createEffect } from "effector";

export const autosaveFx = createEffect(async (data: ParsedBudgetEntry[]) => {
  await supabase
    .from("calculations")
    .update({ values: JSON.stringify(data) })
    .eq("name", "Autosave")  
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
