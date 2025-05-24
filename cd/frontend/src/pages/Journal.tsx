import { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/axios';

interface JournalEntry {
  content: string;
  createdAt: string;
  _id?: string; // Add ID for future features like editing/deleting
}

const Journal = () => {
  const auth = useAuth();
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJournals = async () => {
    try {
      const response = await api.get('/journal/entries', {
        withCredentials: true,  // Add this to ensure cookies are sent
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.journals) {
        // Sort entries by date, newest first
        const sortedEntries = response.data.journals.sort((a: JournalEntry, b: JournalEntry) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setEntries(sortedEntries);
      } else {
        toast.error('Failed to load journal entries');
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Failed to load journal entries');
    }
  };

  useEffect(() => {
    if (auth?.isLoggedIn) {
      fetchJournals();
    }
  }, [auth?.isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      toast.error('Please write something in your journal');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/journal/create', { 
        content: trimmedContent
      });
      
      if (response.data.success) {
        setContent(''); // Clear the text area
        await fetchJournals(); // Refresh the entries list
        toast.success('Journal entry saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save journal entry');
      }
    } catch (error: any) {
      console.error('Error creating journal:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to save journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent(''); // Add clear button functionality
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Journal
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!content.trim() || loading}
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClear}
            disabled={!content.trim() || loading}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom>
        Previous Entries
      </Typography>
      
      {entries.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          No journal entries yet. Start writing your first entry!
        </Typography>
      ) : (
        entries.map((entry, index) => (
          <Paper
            key={entry._id || index}
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {entry.content}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {new Date(entry.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default Journal;