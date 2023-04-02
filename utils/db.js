import { setCalcsExternal } from '@/events/calcs';
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Channel name can be any string.
// Create channels with the same name for both the broadcasting and receiving clients.
export const channel = supabase.channel("room1");

// Subscribe registers your client with the server
channel.subscribe();

supabase
  .channel("room1")
  .on("broadcast", { event: "table-update" }, ({payload}) => {
    return setCalcsExternal(payload);
  })