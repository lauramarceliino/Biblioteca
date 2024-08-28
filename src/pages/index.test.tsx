// src/pages/index.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './index'; // Ajuste o caminho conforme necessário
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock do supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('Login Component', () => {
  it('should render the login form correctly', () => {
    render(<Login />);

    // Verifica se os elementos estão sendo renderizados
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
    expect(screen.getByAltText(/logo ect/i)).toBeInTheDocument();
    expect(screen.getByText(/biblioteca/i)).toBeInTheDocument();
    expect(screen.getByText(/ect/i)).toBeInTheDocument();
  });

  it('should display error message on failed login', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/entrar/i));

    // Aguarda a atualização do componente para garantir que o erro seja exibido
    await waitFor(() => {
      expect(screen.getByText(/erro ao fazer login/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to home on successful login', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'correctpassword' } });
    fireEvent.click(screen.getByText(/entrar/i));

    // Aguarda o redirecionamento para garantir que a chamada para push foi feita
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });
});
