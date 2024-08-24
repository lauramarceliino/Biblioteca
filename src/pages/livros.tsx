import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBookModal from './AddBookModal';
import Button from '@mui/material/Button';

const Livros = () => {
  const [livros, setLivros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para o termo de busca
  const [selectedLivro, setSelectedLivro] = useState<any | null>(null); // Estado para o livro selecionado para edição

  useEffect(() => {
    const fetchLivros = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('livros')
          .select(`
            id,
            titulo,
            quantidade,
            autor:id_autor (nome),
            materia:id_materia (nome_materia)
          `);

        if (error) throw error;

        setLivros(data || []);
      } catch (err) {
        setError('Erro ao buscar livros: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('livros')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar livro:', error.message);
    } else {
      setLivros(livros.filter(livro => livro.id !== id));
    }
  };

  const handleEdit = async () => {
    if (!selectedLivro) return;

    const { error } = await supabase
      .from('livros')
      .update({
        titulo: selectedLivro.titulo,
        id_autor: selectedLivro.autor?.id,
        id_materia: selectedLivro.materia?.id,
        quantidade: selectedLivro.quantidade,
      })
      .eq('id', selectedLivro.id);

    if (error) {
      console.error('Erro ao editar livro:', error.message);
    } else {
      setLivros(livros.map(livro => (livro.id === selectedLivro.id ? selectedLivro : livro)));
      setSelectedLivro(null); // Fechar o modal
    }
  };

  // Filtrar livros com base no termo de busca
  const filteredLivros = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Lista de Livros
      </Typography>

      {/* Box para o campo de busca e o botão de adicionar livro */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Buscar por título"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '300px' }}
        />
        <AddBookModal />
      </Box>

      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Matéria</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLivros.map((livro) => (
                <TableRow key={livro.id}>
                  <TableCell>{livro.titulo}</TableCell>
                  <TableCell>{livro.autor?.nome}</TableCell>
                  <TableCell>{livro.materia?.nome_materia}</TableCell>
                  <TableCell>{livro.quantidade}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedLivro(livro)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(livro.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de edição */}
      {selectedLivro && (
        <Dialog open={!!selectedLivro} onClose={() => setSelectedLivro(null)}>
          <DialogTitle>Editar Livro</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Título"
              type="text"
              fullWidth
              value={selectedLivro.titulo}
              onChange={(e) => setSelectedLivro({ ...selectedLivro, titulo: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Quantidade"
              type="number"
              fullWidth
              value={selectedLivro.quantidade}
              onChange={(e) => setSelectedLivro({ ...selectedLivro, quantidade: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedLivro(null)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleEdit} color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Livros;
