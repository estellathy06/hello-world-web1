import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwpfmyeamjbkgsuneurb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cGZteWVhbWpia2dzdW5ldXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzU2OTgsImV4cCI6MjA4NzgxMTY5OH0.Z46L9eU6lERox2QR5x1STHtt7kFBFDVvmvJPYb1atn0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
