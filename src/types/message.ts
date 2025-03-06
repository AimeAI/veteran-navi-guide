
import { UserRole } from "./application";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  recipientId: string;
  recipientRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    role: UserRole;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  subject?: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}
