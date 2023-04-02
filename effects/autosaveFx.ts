import { ParsedBudgetEntry } from "@/types";
import { channel, supabase } from "@/utils/db";
import { createEffect } from "effector";

export const autosaveFx = createEffect(async (data: ParsedBudgetEntry[]) => {
  await supabase
    .from("calculations")
    .update({ values: JSON.stringify(data) })
    .eq("name", "Autosave")  
})

export const tableUpdateFx = createEffect(async (data: ParsedBudgetEntry[]) => {
  channel.send({
        type: "broadcast",
        event: "table-update",
        payload: data,
      });
})