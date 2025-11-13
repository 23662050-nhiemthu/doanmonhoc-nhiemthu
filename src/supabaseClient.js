import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gietauwhxqhqfhuhleto.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZXRhdXdoeHFocWZodWhsZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODg4ODMsImV4cCI6MjA3Nzk2NDg4M30.hwlY8yRm8Ne_DndsGsNycey6bsvbv9S0EXnAUSz1Qz0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
