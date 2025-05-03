import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pqrsxtcjlqlmjwconlex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcnN4dGNqbHFsbWp3Y29ubGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTcxNTYsImV4cCI6MjA2MTg3MzE1Nn0.G9fqysOLOCskgJdCMc1aubi-0LFXRLOkACedZRx9R3Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);