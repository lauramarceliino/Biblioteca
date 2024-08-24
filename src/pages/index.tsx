// pages/login.tsx
"use client";

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage('Erro ao fazer login: ' + error.message);
    } else {
      router.push('/home'); // Redireciona para a página inicial após login bem-sucedido
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          width: '100%',
          maxWidth: 400,
          borderRadius: 1,
          boxShadow: 2,
          backgroundColor: '#ffffff',
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <img
            src="https://secacademica.ect.ufrn.br/storage/default/logo_ect.png"
            alt="Logo ECT"
            style={{ width: 100, height: 'auto' }}
          />
          <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
            <strong>Biblioteca</strong> <span style={{ color: '#003366' }}>ECT</span>
          </Typography>
        </Box>
        {errorMessage && (
          <Typography color="error" variant="body1" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ marginTop: 2 }}
        >
          Entrar
        </Button>
      </Container>
    </Box>
  );
};

export default Login;
