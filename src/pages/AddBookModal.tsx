import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AddBookModal = () => {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState(''); // Estado para o nome do autor
  const [materia, setMateria] = useState(''); // Estado para o nome da matéria
  const [quantidade, setQuantidade] = useState('');
  const [autores, setAutores] = useState<any[]>([]); // Lista de autores
  const [materias, setMaterias] = useState<any[]>([]); // Lista de matérias

  useEffect(() => {
    if (open) {
      const fetchAutoresEMaterias = async () => {
        const { data: autoresData } = await supabase.from('autor').select('id, nome');
        const { data: materiasData } = await supabase.from('materia').select('id, nome_materia');
        setAutores(autoresData || []);
        setMaterias(materiasData || []);
      };

      fetchAutoresEMaterias();
    }
  }, [open]);

  const handleSubmit = async () => {
    // Encontre os IDs correspondentes aos nomes selecionados
    const autorSelecionado = autores.find(a => a.nome === autor);
    const materiaSelecionada = materias.find(m => m.nome_materia === materia);

    if (!autorSelecionado || !materiaSelecionada) {
      console.error('Autor ou Matéria não encontrados');
      return;
    }

    const { error } = await supabase
      .from('livros')
      .insert([{ 
        titulo, 
        id_autor: autorSelecionado.id, 
        id_materia: materiaSelecionada.id, 
        quantidade 
      }]);

    if (error) {
      console.error('Erro ao adicionar livro:', error.message);
    } else {
      setOpen(false);
      setTitulo('');
      setAutor('');
      setMateria('');
      setQuantidade('');
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Adicionar Livro
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Adicionar Livro</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Autor</InputLabel>
            <Select
              value={autor}
              onChange={(e) => setAutor(e.target.value as string)}
            >
              {autores.map((autor) => (
                <MenuItem key={autor.id} value={autor.nome}>
                  {autor.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Matéria</InputLabel>
            <Select
              value={materia}
              onChange={(e) => setMateria(e.target.value as string)}
            >
              {materias.map((materia) => (
                <MenuItem key={materia.id} value={materia.nome_materia}>
                  {materia.nome_materia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Quantidade"
            type="number"
            fullWidth
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddBookModal;
