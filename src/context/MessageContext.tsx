
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Conversation, Message, ConversationWithMessages } from "@/types/message";
import { toast } from "sonner";
import { useUser } from "./UserContext";

// Generate a random ID for messages/conversations
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [
      { id: "user1", role: "veteran" },
      { id: "emp1", role: "employer" }
    ],
    unreadCount: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    subject: "Software Developer Position"
  },
  {
    id: "conv2",
    participants: [
      { id: "user1", role: "veteran" },
      { id: "emp2", role: "employer" }
    ],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    subject: "Project Manager Interview"
  }
];

// Mock data for messages
const mockMessages: Record<string, Message[]> = {
  "conv1": [
    {
      id: "msg1",
      conversationId: "conv1",
      senderId: "emp1",
      senderRole: "employer",
      recipientId: "user1",
      recipientRole: "veteran",
      content: "Hello! I noticed your application for our Software Developer position. Do you have time to discuss the role in more detail?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg2",
      conversationId: "conv1",
      senderId: "user1",
      senderRole: "veteran",
      recipientId: "emp1",
      recipientRole: "employer",
      content: "Hi! Yes, I'd be happy to discuss the position. I'm available any weekday afternoon.",
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg3",
      conversationId: "conv1",
      senderId: "emp1",
      senderRole: "employer",
      recipientId: "user1",
      recipientRole: "veteran",
      content: "Great! How about this Thursday at 2 PM? We can do a video call to discuss the role requirements and your experience.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: "msg4",
      conversationId: "conv1",
      senderId: "emp1",
      senderRole: "employer",
      recipientId: "user1",
      recipientRole: "veteran",
      content: "Also, could you share a bit about your experience with React and TypeScript?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ],
  "conv2": [
    {
      id: "msg5",
      conversationId: "conv2",
      senderId: "emp2",
      senderRole: "employer",
      recipientId: "user1",
      recipientRole: "veteran",
      content: "Thank you for applying to the Project Manager position. Your military leadership experience is impressive.",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg6",
      conversationId: "conv2",
      senderId: "user1",
      senderRole: "veteran",
      recipientId: "emp2",
      recipientRole: "employer",
      content: "Thank you for considering my application. I believe my experience leading teams in high-pressure situations would be valuable in your organization.",
      timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg7",
      conversationId: "conv2",
      senderId: "emp2",
      senderRole: "employer",
      recipientId: "user1",
      recipientRole: "veteran",
      content: "I agree. We've reviewed your application further and would like to schedule an interview. Are you available next week?",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: "msg8",
      conversationId: "conv2",
      senderId: "user1",
      senderRole: "veteran",
      recipientId: "emp2",
      recipientRole: "employer",
      content: "I'd be happy to schedule an interview. I'm available Monday through Wednesday next week, preferably in the morning.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ]
};

// Define the MessageContext interface
interface MessageContextType {
  conversations: Conversation[];
  currentConversation: ConversationWithMessages | null;
  isLoading: boolean;
  setCurrentConversation: (conversationId: string | null) => void;
  sendMessage: (recipientId: string, content: string, conversationId?: string) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
  startNewConversation: (recipientId: string, subject?: string) => Promise<string>;
  getTotalUnreadCount: () => number;
  refreshMessages: () => Promise<void>;
}

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider component
export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversationState] = useState<ConversationWithMessages | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load conversations on mount or when user changes
  useEffect(() => {
    if (user && user.isAuthenticated) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversationState(null);
    }
  }, [user]);

  // Simulates loading conversations from an API
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, use mock data
      setConversations(mockConversations);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
      setIsLoading(false);
    }
  };

  // Set current conversation with messages
  const setCurrentConversation = async (conversationId: string | null) => {
    if (!conversationId) {
      setCurrentConversationState(null);
      return;
    }

    setIsLoading(true);
    try {
      // Find the conversation
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get messages for this conversation (from mock data for demo)
      const messages = mockMessages[conversationId] || [];
      
      // Set as current conversation with messages
      setCurrentConversationState({
        ...conversation,
        messages: messages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      });

      // Mark unread messages as read
      const unreadMessageIds = messages
        .filter(m => !m.read && m.recipientId === user?.email)
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        await markAsRead(unreadMessageIds);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (recipientId: string, content: string, conversationId?: string) => {
    if (!user || !user.isAuthenticated) {
      toast.error("You must be logged in to send messages");
      return;
    }

    setIsLoading(true);
    try {
      // If no conversation ID, create a new conversation
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        activeConversationId = await startNewConversation(recipientId);
      }
      
      // Create the new message
      const newMessage: Message = {
        id: generateId(),
        conversationId: activeConversationId,
        senderId: user.email,
        senderRole: user.role,
        recipientId,
        recipientRole: user.role === "veteran" ? "employer" : "veteran",
        content,
        timestamp: new Date().toISOString(),
        read: false
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would be sent to Supabase
      console.log("Sending message:", newMessage);
      
      // Update local state for immediate feedback
      // Add message to current conversation if it's open
      if (currentConversation && currentConversation.id === activeConversationId) {
        setCurrentConversationState({
          ...currentConversation,
          messages: [...currentConversation.messages, newMessage],
          lastMessage: newMessage,
          updatedAt: newMessage.timestamp
        });
      }
      
      // Update conversations list with the new message info
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            updatedAt: newMessage.timestamp
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark messages as read
  const markAsRead = async (messageIds: string[]) => {
    if (!messageIds.length) return;
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would update Supabase
      console.log("Marking messages as read:", messageIds);
      
      // Update local state
      // Update current conversation if open
      if (currentConversation) {
        const updatedMessages = currentConversation.messages.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        );
        
        setCurrentConversationState({
          ...currentConversation,
          messages: updatedMessages,
          unreadCount: Math.max(0, currentConversation.unreadCount - messageIds.length)
        });
      }
      
      // Update conversations list
      const updatedConversations = conversations.map(conv => {
        if (conv.id === currentConversation?.id) {
          return {
            ...conv,
            unreadCount: Math.max(0, conv.unreadCount - messageIds.length)
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      // No toast here to avoid disrupting UX
    }
  };

  // Start a new conversation
  const startNewConversation = async (recipientId: string, subject?: string): Promise<string> => {
    if (!user || !user.isAuthenticated) {
      throw new Error("You must be logged in to start a conversation");
    }
    
    try {
      // Create the new conversation
      const newConversation: Conversation = {
        id: generateId(),
        participants: [
          { id: user.email, role: user.role },
          { id: recipientId, role: user.role === "veteran" ? "employer" : "veteran" }
        ],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subject
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be sent to Supabase
      console.log("Creating new conversation:", newConversation);
      
      // Update local state
      setConversations(prevConversations => [newConversation, ...prevConversations]);
      
      return newConversation.id;
    } catch (error) {
      console.error("Error starting conversation:", error);
      throw new Error("Failed to start conversation");
    }
  };

  // Get total unread count across all conversations
  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  // Refresh messages (simulate polling or websocket updates)
  const refreshMessages = async () => {
    if (!user || !user.isAuthenticated) return;
    
    try {
      // In a real app, this would fetch new messages from Supabase
      console.log("Refreshing messages");
      
      // For demo purposes, just reload conversations
      await loadConversations();
      
      // If a conversation is open, refresh it too
      if (currentConversation) {
        await setCurrentConversation(currentConversation.id);
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
      // No toast here to avoid disrupting UX
    }
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      currentConversation,
      isLoading,
      setCurrentConversation,
      sendMessage,
      markAsRead,
      startNewConversation,
      getTotalUnreadCount,
      refreshMessages
    }}>
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook for accessing the message context
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};
