// src/services/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// Substitua com sua URL e chave do Supabase
const supabaseUrl = 'https://dthokjkvnznnstiwwhfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aG9ramt2bnpubnN0aXd3aGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNjg3MzQsImV4cCI6MjAzOTk0NDczNH0.SIeFuv4Y_-4hFOEEJLP-xsvNJlBK8T4Sv3OSsMovJkM';

export const supabase = createClient(supabaseUrl, supabaseKey);
