import React, { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, Paper, TextField, Container, CircularProgress } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.5, px: 2 }}>
    <span className="typing-dot" style={{
      width: "6px",
      height: "6px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "50%",
      animation: "typingAnimation 1.4s infinite",
      animationDelay: "0s"
    }} />
    <span className="typing-dot" style={{
      width: "6px",
      height: "6px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "50%",
      animation: "typingAnimation 1.4s infinite",
      animationDelay: "0.2s"
    }} />
    <span className="typing-dot" style={{
      width: "6px",
      height: "6px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "50%",
      animation: "typingAnimation 1.4s infinite",
      animationDelay: "0.4s"
    }} />
    <style>
      {`
        @keyframes typingAnimation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}
    </style>
  </Box>
);

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const chat = useChat();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const userMessage = { role: "user" as const, content: message };
      chat.addMessage(userMessage);
      setMessage("");

      const response = await sendChatRequest(message);
      const botMessage = { role: "assistant" as const, content: response.reply };
      chat.addMessage(botMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChats = async () => {
    try {
      await deleteUserChats();
      chat.clearMessages();
      toast.success("Chats deleted successfully");
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats");
    }
  };

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat.messages, isLoading]);

  // Example conversation starter
  useEffect(() => {
    if (chat.messages.length === 0) {
      const welcomeMessage = {
        role: "assistant" as const,
        content: "Hi! I'm your AI assistant. How are you feeling today? I'd love to chat and help you with anything you need."
      };
      chat.addMessage(welcomeMessage);
    }
  }, [chat.messages.length]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading chats...</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", height: "88vh", pt: 3 }}>
        {/* Chat Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Chat with AI
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleDeleteChats}
            sx={{ height: 40 }}
          >
            Clear Chat
          </Button>
        </Box>

        {/* Chat Messages */}
        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            overflow: "auto",
            mb: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            p: 2,
          }}
        >
          {chat.messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                mb: 2,
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.role === "user" ? "primary.main" : red[500],
                  mr: msg.role === "user" ? 0 : 1,
                  ml: msg.role === "user" ? 1 : 0,
                }}
              >
                {msg.role === "user" ? "U" : "AI"}
              </Avatar>
              <Paper
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: msg.role === "user" ? "primary.light" : "white",
                  color: msg.role === "user" ? "white" : "text.primary",
                }}
              >
                <Typography>{msg.content}</Typography>
                {msg.timestamp && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                )}
              </Paper>
            </Box>
          ))}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                mb: 2,
                flexDirection: "row",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: red[500],
                  mr: 1,
                }}
              >
                AI
              </Avatar>
              <Paper
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">AI is typing</Typography>
                <TypingIndicator />
              </Paper>
            </Box>
          )}
        </Box>

        {/* Message Input */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            sx={{ 
              minWidth: 100,
              position: 'relative'
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary.light',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
                <span style={{ visibility: 'hidden' }}>
                  <IoMdSend />
                </span>
              </>
            ) : (
              <>
                Send
                <IoMdSend style={{ marginLeft: '8px' }} />
              </>
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
