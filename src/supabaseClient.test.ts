import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('Supabase Client', () => {
  const mockSupabaseUrl = 'https://dthokjkvnznnstiwwhfx.supabase.co';
  const mockSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aG9ramt2bnpubnN0aXd3aGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNjg3MzQsImV4cCI6MjAzOTk0NDczNH0.SIeFuv4Y_-4hFOEEJLP-xsvNJlBK8T4Sv3OSsMovJkM';

  it('should create and export a supabase client instance', () => {
    const mockClient = {}; // Mock para a instância do cliente
    (createClient as jest.Mock).mockReturnValue(mockClient);

    // Importa o cliente depois que o mock foi configurado
    const { supabase: importedSupabase } = require('./supabaseClient');
    
    // Verifica se a função createClient foi chamada com os parâmetros corretos
    expect(createClient).toHaveBeenCalledWith(mockSupabaseUrl, mockSupabaseKey);
    
    // Verifica se a exportação do supabase é a instância mockada
    expect(importedSupabase).toBe(mockClient);
  });

  it('should not call createClient more than once', () => {
    const mockClient = {}; // Mock para a instância do cliente
    (createClient as jest.Mock).mockReturnValue(mockClient);

    // Força a importação do módulo para chamar createClient
    require('./supabaseClient');
    
    // Verifica se a função createClient foi chamada exatamente uma vez
    expect(createClient).toHaveBeenCalledTimes(1);
  });
});
