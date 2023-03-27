import { interval } from "rxjs";
import { fromObservable } from "effector";
import { supabase } from "@/utils/db";

//emit value in sequence every 1 second
const source = interval(60000);

export const autosaveTimer = fromObservable(source);
