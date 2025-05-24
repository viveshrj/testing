import { Box, Button, Container, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TherapyPortal = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Therapy Portal
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
          Choose your preferred therapy option
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Card sx={{ width: 300 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                AI Therapy
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Chat with our AI therapist powered by advanced technology
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/ai-therapy')}
              >
                Start AI Therapy
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ width: 300 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Expert Consultation
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Connect with a licensed therapist for professional help
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/expert-consultation')}
              >
                Call an Expert
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default TherapyPortal;