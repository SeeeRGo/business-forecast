import { Session } from "@supabase/supabase-js";
import { createEvent } from "effector";

export const setSession = createEvent<Session | null>()
