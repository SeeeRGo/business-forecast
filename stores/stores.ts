import { setSession } from "@/events/auth";
import { Session } from "@supabase/supabase-js";
import { createStore } from "effector";

export const $session = createStore<Session | null>(null)
  .on(setSession, (_, session) => session)

export const $userId = $session.map(session => session ? session.user.id : null)
