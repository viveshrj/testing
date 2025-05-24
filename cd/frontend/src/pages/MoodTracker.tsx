import { Box, Container, Typography, Paper, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from '../config/axios';

type MoodEntry = {
  date: string;
  mood: string;
  sentiment: number;
  notes: string;
  chatContext?: string;
};

const MoodTracker = () => {
  const auth = useAuth();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mood history when component mounts
    const fetchMoodHistory = async () => {
      try {
        const response = await api.get('/mood/history', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        if (response.data) {
          setMoodHistory(response.data.moodHistory);
        }
      } catch (error) {
        console.error('Failed to fetch mood history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.isLoggedIn) {
      fetchMoodHistory();
    }
  }, [auth?.isLoggedIn]);

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.sentiment, 0);
    return (sum / moodHistory.length).toFixed(2);
  };

  const getMoodColor = (sentiment: number) => {
    if (sentiment >= 0.7) return '#4caf50'; // Very positive - Green
    if (sentiment >= 0.5) return '#8bc34a'; // Positive - Light Green
    if (sentiment >= 0.3) return '#ffc107'; // Neutral - Yellow
    if (sentiment >= 0.2) return '#ff9800'; // Negative - Orange
    return '#f44336'; // Very negative - Red
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mood Tracker
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3 
        }}>
          {/* Overview Card */}
          <Box sx={{ 
            flex: { xs: '1', md: '0 0 300px' },
            width: '100%'
          }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography>
                Average Mood: {getAverageMood()}
              </Typography>
              <Typography>
                Total Entries: {moodHistory.length}
              </Typography>
            </Paper>
          </Box>

          {/* Recent Moods */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Moods
              </Typography>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : moodHistory.length === 0 ? (
                <Typography>No mood entries yet</Typography>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {moodHistory.map((entry, index) => (
                    <Paper 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        borderLeft: `4px solid ${getMoodColor(entry.sentiment)}`
                      }}
                      elevation={2}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">
                          {new Date(entry.date).toLocaleString()}
                        </Typography>
                        <Chip 
                          label={entry.mood}
                          sx={{ 
                            backgroundColor: getMoodColor(entry.sentiment),
                            color: 'white'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {entry.notes}
                      </Typography>
                      {entry.chatContext && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mt: 1, 
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            fontStyle: 'italic'
                          }}
                        >
                          Context: {entry.chatContext}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MoodTracker;