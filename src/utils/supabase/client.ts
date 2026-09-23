import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://gdjlhssopryukxvbtgap.supabase.co';

const supabaseKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_HtLefCMCi9gdiMTzbh2z2A_iOurJusc';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );

export const supabase = createClient();
