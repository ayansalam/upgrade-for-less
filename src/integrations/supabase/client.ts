
// Supabase client initialization
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  'https://wospdquyvrdrycjbsusm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3BkcXV5dnJkcnljamJzdXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODQ4OTMsImV4cCI6MjA2MDc2MDg5M30.qxfm3pjRuQzWbt0ytj1YAZvNg2NUheMw37Wq9xhXJXQ'
);
