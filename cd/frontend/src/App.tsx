import './App.css'
import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import MoodTracker from './pages/MoodTracker'
import Journal from './pages/Journal'
import { useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import TherapyPortal from './pages/TherapyPortal';
import AITherapy from './pages/AITherapy';
import ExpertConsultation from './pages/ExpertConsultation';
import Diary from './pages/Diary';

function App() {  
  const auth = useAuth();
  return (
    <main>
      <Header />
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/chat" 
            element={auth?.isLoggedIn ? <Chat /> : <Login />} 
          />
          <Route 
            path="/mood" 
            element={auth?.isLoggedIn ? <MoodTracker /> : <Login />} 
          />
          <Route 
            path="/journal" 
            element={auth?.isLoggedIn ? <Journal /> : <Login />} 
          />
          <Route path="/therapy" element={<TherapyPortal />} />
          <Route path="/ai-therapy" element={<AITherapy />} />
          <Route path="/expert-consultation" element={<ExpertConsultation />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </ChatProvider>
    </main>
  );
}

export default App
