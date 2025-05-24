import { Box, Container, Typography, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

const ExpertConsultation = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Expert Consultation
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Connect with a licensed therapist for professional help.
          Our experts are available 24/7 to assist you.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PhoneIcon />}
          onClick={() => {
            // Implement your call functionality here
            alert('Calling expert... This is a demo.');
          }}
        >
          Call Now
        </Button>
      </Box>
    </Container>
  );
};

export default ExpertConsultation;