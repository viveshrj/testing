import { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  text: string;
  isBot: boolean;
}

const AITherapy = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm Dr. AI, a therapeutic assistant with 5 years of experience. How are you feeling today?",
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // TODO: Integrate with your AI backend
    // The AI should be prompted to act as an experienced therapist
    // Example prompt: "You are a therapist with 5 years of experience. Respond to the patient's message in a therapeutic manner."
    
    // Simulate AI response (replace with actual API call)
    const aiResponse: Message = {
      text: "I understand how you're feeling. Can you tell me more about what's been going on in your life recently?",
      isBot: true
    };
    setMessages(prev => [...prev, aiResponse]);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>
          AI Therapy Session
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            mb: 2, 
            p: 2, 
            overflow: 'auto',
            bgcolor: '#f5f5f5' 
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                mb: 2
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.isBot ? 'primary.light' : 'secondary.light',
                  color: message.isBot ? 'primary.contrastText' : 'secondary.contrastText'
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Paper>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AITherapy;