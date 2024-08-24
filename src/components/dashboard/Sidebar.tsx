import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box, Divider, Button } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import { supabase } from '../../supabaseClient'; // Caminho ajustado para o arquivo supabaseClient.ts

type SidebarProps = {
  onClick: (selectedSection: string) => void;
};

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 240,
  backgroundColor: '#bfbfbf', // Cor de fundo mais clara de cinza
  color: '#333', // Cor do texto (preto ou cinza escuro para contraste)
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
}));

const SidebarTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3), // Margem abaixo do título
  marginTop: theme.spacing(2), // Margem acima do título
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  color: '#333', // Cor do título
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#333', // Cor do título
}));

const ECTText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  color: '#073d65',
  marginLeft: theme.spacing(1),
}));

const LogoImage = styled('img')(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(2),
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  backgroundColor: '#ccc', // Cor do divisor mais clara
  margin: `${theme.spacing(2)}px 0`,
}));

const Sidebar: React.FC<SidebarProps> = ({ onClick }) => {
  const handleClick = (section: string) => {
    onClick(section);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error.message);
    } else {
      window.location.href = '/'; // Redireciona para a página de 
    }
  };

  return (
    <SidebarContainer>
      <SidebarTitleContainer>
        <LogoImage src="https://secacademica.ect.ufrn.br/storage/default/logo_ect.png" alt="Logo" />
        <SidebarTitle>
          <TitleText>Biblioteca</TitleText>
          <ECTText>ECT</ECTText>
        </SidebarTitle>
      </SidebarTitleContainer>
      <DividerStyled />
      <List>
        <ListItem button onClick={() => handleClick('alunos')}>
          <ListItemIcon>
            <PersonIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Alunos" />
        </ListItem>
        <ListItem button onClick={() => handleClick('livros')}>
          <ListItemIcon>
            <LibraryBooksIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Livros" />
        </ListItem>
        <ListItem button onClick={() => handleClick('alugueis')}>
          <ListItemIcon>
            <AssignmentIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="Aluguéis" />
        </ListItem>
      </List>
      <DividerStyled sx={{ marginTop: 'auto' }} />
      <Box sx={{ padding: 2 }}>
        <Button
          variant="contained"
          color="error" // Usa a cor padrão de erro do Material-UI que é vermelha
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
          sx={{
            backgroundColor: '#f44336', // Cor de fundo vermelha
            color: '#fff', // Cor do texto
            '&:hover': {
              backgroundColor: '#d32f2f', // Cor de fundo quando o botão é pressionado
            },
          }}
        >
          Sair
        </Button>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
