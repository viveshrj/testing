import { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/axios';

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Diary = () => {
  const auth = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDiaries = async () => {
    try {
      const response = await api.get('/diary/entries');
      if (response.data.success) {
        setEntries(response.data.diaries);
      } else {
        toast.error('Failed to load diary entries');
      }
    } catch (error) {
      console.error('Error fetching diaries:', error);
      toast.error('Failed to load diary entries');
    }
  };

  useEffect(() => {
    if (auth?.isLoggedIn) {
      fetchDiaries();
    }
  }, [auth?.isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/diary/create', { 
        title: title.trim(),
        content: content.trim()
      });
      
      if (response.data.success) {
        setTitle('');
        setContent('');
        await fetchDiaries();
        toast.success('Diary entry saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save diary entry');
      }
    } catch (error: any) {
      console.error('Error creating diary:', error);
      toast.error(error.response?.data?.message || 'Failed to save diary entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Diary
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </Button>
          </form>
        </Paper>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Previous Entries
        </Typography>
        
        {entries.map((entry) => (
          <Paper key={entry._id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{entry.title}</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {new Date(entry.createdAt).toLocaleString()}
            </Typography>
            <Typography>{entry.content}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Diary;