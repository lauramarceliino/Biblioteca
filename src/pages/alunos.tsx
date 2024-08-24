import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // Importando o ícone de edição

const Alunos = () => {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Estado para modo de edição
  const [selectedAluno, setSelectedAluno] = useState<any | null>(null); // Estado para armazenar o aluno selecionado para edição
  const [newAluno, setNewAluno] = useState({
    matricula: '',
    nome: '',
    data_nasc: '',
    email: '',
    bolsista: false,
  });

  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('aluno')
          .select('*');
        
        if (error) throw error;
        
        setAlunos(data || []);
      } catch (err) {
        setError('Erro ao buscar alunos: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR'); // Formato brasileiro: DD/MM/YYYY
  };

  const handleDelete = async (matricula: string) => {
    try {
      const { error } = await supabase
        .from('aluno')
        .delete()
        .eq('matricula', matricula);

      if (error) throw error;

      setAlunos(alunos.filter(aluno => aluno.matricula !== matricula));
    } catch (err) {
      setError('Erro ao deletar aluno: ' + (err as Error).message);
    }
  };

  const handleOpen = () => {
    setIsEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAluno(null); // Limpar o aluno selecionado ao fechar o modal
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAluno({ ...newAluno, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditMode && selectedAluno) {
        // Editar aluno existente
        const { error } = await supabase
          .from('aluno')
          .update(newAluno)
          .eq('matricula', selectedAluno.matricula);

        if (error) throw error;

        setAlunos(alunos.map(aluno => 
          aluno.matricula === selectedAluno.matricula ? { ...newAluno, matricula: selectedAluno.matricula } : aluno
        ));
      } else {
        // Adicionar novo aluno
        const { error } = await supabase
          .from('aluno')
          .insert([newAluno]);

        if (error) throw error;

        setAlunos([...alunos, newAluno]);
      }

      handleClose();
    } catch (err) {
      setError('Erro ao salvar aluno: ' + (err as Error).message);
    }
  };

  const handleEdit = (aluno: any) => {
    setIsEditMode(true);
    setSelectedAluno(aluno);
    setNewAluno({
      matricula: aluno.matricula,
      nome: aluno.nome,
      data_nasc: aluno.data_nasc,
      email: aluno.email,
      bolsista: aluno.bolsista,
    });
    setOpen(true);
  };

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Lista de Alunos
      </Typography>
      
      {/* Box para o campo de busca e o botão de adicionar aluno */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Procurar aluno pelo nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Adicionar Aluno
        </Button>
      </Box>
      
      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Matrícula</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Data de Nascimento</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Bolsista</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.matricula}>
                  <TableCell>{aluno.matricula}</TableCell>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{formatDate(aluno.data_nasc)}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
                  <TableCell>{aluno.bolsista ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(aluno)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(aluno.matricula)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditMode ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Matrícula"
            type="text"
            fullWidth
            name="matricula"
            value={newAluno.matricula}
            onChange={handleInputChange}
            disabled={isEditMode} // Desabilitar a edição de matrícula ao editar
          />
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            name="nome"
            value={newAluno.nome}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            name="data_nasc"
            value={newAluno.data_nasc}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={newAluno.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Bolsista (true ou false)"
            type="text"
            fullWidth
            name="bolsista"
            value={newAluno.bolsista}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Alunos;
