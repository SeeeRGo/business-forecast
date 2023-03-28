import { ParsedBudgetEntry } from "@/types";
import { supabase } from "@/utils/db";
import { createEffect } from "effector";

export const autosaveFx = createEffect(async (data: ParsedBudgetEntry[]) => {
  await supabase
    .from("calculations")
    .update({ values: JSON.stringify(data) })
    .eq("name", "Autosave")  
})