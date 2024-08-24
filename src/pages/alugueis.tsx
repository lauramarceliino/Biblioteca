import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Alugueis = () => {
  const [alugueis, setAlugueis] = useState<any[]>([]);
  const [filteredAlugueis, setFilteredAlugueis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [aluno, setAluno] = useState<string>('');
  const [livro, setLivro] = useState<string>('');
  const [alunos, setAlunos] = useState<any[]>([]);
  const [livros, setLivros] = useState<any[]>([]);
  const [selectedAluguel, setSelectedAluguel] = useState<any>(null);

  useEffect(() => {
    const fetchAlugueis = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('livros_alugados')
          .select(`
            id,
            matricula_aluno,
            id_livro,
            data_aluguel,
            data_devolucao,
            aluno:matricula_aluno (nome),
            livro:id_livro (titulo)
          `);

        if (error) throw error;

        setAlugueis(data || []);
        setFilteredAlugueis(data || []);
      } catch (err) {
        setError('Erro ao buscar aluguéis: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlugueis();
  }, []);

  useEffect(() => {
    const fetchAlunos = async () => {
      const { data: alunosData } = await supabase.from('aluno').select('matricula, nome');
      setAlunos(alunosData || []);
    };

    const fetchLivros = async () => {
      const { data: livrosData } = await supabase.from('livros').select('id, titulo');
      setLivros(livrosData || []);
    };

    fetchAlunos();
    fetchLivros();
  }, []);

  useEffect(() => {
    const filtered = alugueis.filter(
      (aluguel) =>
        aluguel.aluno?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluguel.livro?.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlugueis(filtered);
  }, [searchTerm, alugueis]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAluguel(null);
  };

  const handleOpenEditModal = (aluguel: any) => {
    setSelectedAluguel(aluguel);
    setAluno(aluguel.matricula_aluno);
    setLivro(aluguel.id_livro);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedAluguel(null);
  };

  const handleCreateAluguel = async () => {
    try {
      const { error } = await supabase.from('livros_alugados').insert([
        {
          matricula_aluno: aluno,
          id_livro: livro,
          data_aluguel: new Date().toISOString().split('T')[0],
        },
      ]);

      if (error) throw error;

      // Atualizar a lista de aluguéis
      const { data: updatedAlugueis } = await supabase
        .from('livros_alugados')
        .select(`
          id,
          matricula_aluno,
          id_livro,
          data_aluguel,
          data_devolucao,
          aluno:matricula_aluno (nome),
          livro:id_livro (titulo)
        `);
      setAlugueis(updatedAlugueis || []);
      setFilteredAlugueis(updatedAlugueis || []);
      handleCloseModal();
    } catch (err) {
      setError('Erro ao criar aluguel: ' + (err as Error).message);
    }
  };

  const handleUpdateAluguel = async () => {
    try {
      const { error } = await supabase
        .from('livros_alugados')
        .update({ data_devolucao: new Date().toISOString().split('T')[0] })
        .eq('id', selectedAluguel.id);

      if (error) throw error;

      // Atualizar a lista de aluguéis
      const { data: updatedAlugueis } = await supabase
        .from('livros_alugados')
        .select(`
          id,
          matricula_aluno,
          id_livro,
          data_aluguel,
          data_devolucao,
          aluno:matricula_aluno (nome),
          livro:id_livro (titulo)
        `);
      setAlugueis(updatedAlugueis || []);
      setFilteredAlugueis(updatedAlugueis || []);
      handleCloseEditModal();
    } catch (err) {
      setError('Erro ao atualizar aluguel: ' + (err as Error).message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Lista de Aluguéis
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Buscar Aluguéis"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ ml: 2 }} // Margem à esquerda para separar o botão do campo de pesquisa
        >
          Cadastrar Aluguel
        </Button>
      </Box>

      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Aluno</TableCell>
                <TableCell>Título do Livro</TableCell>
                <TableCell>Data de Aluguel</TableCell>
                <TableCell>Data de Devolução</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlugueis.map((aluguel) => (
                <TableRow key={aluguel.id}>
                  <TableCell>{aluguel.aluno?.nome}</TableCell>
                  <TableCell>{aluguel.livro?.titulo}</TableCell>
                  <TableCell>{new Date(aluguel.data_aluguel).toLocaleDateString()}</TableCell>
                  <TableCell>{aluguel.data_devolucao ? new Date(aluguel.data_devolucao).toLocaleDateString() : 'Não devolvido'}</TableCell>
                  <TableCell>
                    {!aluguel.data_devolucao && (
                      <Tooltip title="Liberar Livro">
                        <IconButton onClick={() => handleOpenEditModal(aluguel)}>
                          <CheckCircleIcon color="success" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenEditModal(aluguel)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para Cadastrar Aluguel */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Cadastrar Aluguel
          </Typography>
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-aluno-label">Aluno</InputLabel>
              <Select
                labelId="select-aluno-label"
                value={aluno}
                onChange={(e) => setAluno(e.target.value)}
                label="Aluno"
              >
                {alunos.map((a) => (
                  <MenuItem key={a.matricula} value={a.matricula}>
                    {a.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-livro-label">Livro</InputLabel>
              <Select
                labelId="select-livro-label"
                value={livro}
                onChange={(e) => setLivro(e.target.value)}
                label="Livro"
              >
                {livros.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.titulo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleCreateAluguel} sx={{ mt: 2 }}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal para Editar Aluguel */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Editar Aluguel
          </Typography>
          <Box mt={2}>
            <Typography variant="body1">Deseja devolver o livro {selectedAluguel?.livro?.titulo}?</Typography>
            <Button variant="contained" color="primary" onClick={handleUpdateAluguel} sx={{ mt: 2 }}>
              Confirmar Devolução
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Alugueis;
