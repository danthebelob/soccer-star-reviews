// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ksmatarptkpamzfkmnnp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbWF0YXJwdGtwYW16Zmttbm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNTc3ODksImV4cCI6MjA1ODgzMzc4OX0.pOM0g8YH8mKVSv0_w9BY0N_1lF0G7f044P4jDXMjOEw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);