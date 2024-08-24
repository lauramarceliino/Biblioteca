// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/dashboard/Sidebar';
import { Box, CircularProgress } from '@mui/material';
import Alunos from './alunos';
import Livros from './livros';
import Alugueis from './alugueis';

const Home = () => {
  const [section, setSection] = useState('alunos');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/'); // Redireciona para a página de login se não autenticado
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return null; // Não renderiza nada enquanto redireciona para a página de login
  }

  const handleSidebarClick = (selectedSection: string) => {
    setSection(selectedSection);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#eaeff1',
      }}
    >
      <Sidebar onClick={handleSidebarClick} />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '250px',
          padding: 3,
          overflowY: 'auto',
        }}
      >
        {section === 'alunos' && <Alunos />}
        {section === 'livros' && <Livros />}
        {section === 'alugueis' && <Alugueis />}
      </Box>
    </Box>
  );
};

export default Home;
