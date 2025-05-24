import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { getUserChats } from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

type ConversationMetrics = {
  startTime: Date | null;
  endTime: Date | null;
  messages: Message[];
  sentiment?: {
    mood: string;
    score: number;
  };
};

type ChatContextType = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  loading: boolean;
  conversationMetrics: ConversationMetrics;
  setConversationMetrics: (metrics: ConversationMetrics) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationMetrics, setConversationMetrics] = useState<ConversationMetrics>({
    startTime: null,
    endTime: null,
    messages: [],
    sentiment: undefined
  });

  // Load chat history when the provider mounts
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getUserChats();
        const messagesWithTimestamps = data.chats.map((msg: Message) => ({
          ...msg,
          timestamp: new Date()
        }));
        setMessages(messagesWithTimestamps);
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, []);

  const addMessage = (message: Message) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, messageWithTimestamp]);
    
    // Update conversation metrics
    if (conversationMetrics.startTime === null) {
      setConversationMetrics({
        ...conversationMetrics,
        startTime: new Date(),
        messages: [messageWithTimestamp]
      });
    } else {
      setConversationMetrics({
        ...conversationMetrics,
        messages: [...conversationMetrics.messages, messageWithTimestamp]
      });
    }

    // Check if 10 minutes have passed since conversation start
    if (conversationMetrics.startTime) {
      const timeDiff = new Date().getTime() - conversationMetrics.startTime.getTime();
      if (timeDiff >= 10 * 60 * 1000) { // 10 minutes in milliseconds
        handleConversationEnd();
      }
    }
  };

  const handleConversationEnd = async () => {
    try {
      const response = await fetch("/api/v1/mood/analyze-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMetrics.messages,
          startTime: conversationMetrics.startTime,
          endTime: new Date()
        }),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setConversationMetrics({
          ...conversationMetrics,
          endTime: new Date(),
          sentiment: data.sentiment
        });
      }
    } catch (error) {
      console.error("Failed to analyze conversation:", error);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setConversationMetrics({
      startTime: null,
      endTime: null,
      messages: [],
      sentiment: undefined
    });
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        setMessages, 
        addMessage, 
        clearMessages, 
        loading,
        conversationMetrics,
        setConversationMetrics
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}; 