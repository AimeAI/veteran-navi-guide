
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ConversationList from '@/components/messaging/ConversationList';
import ConversationView from '@/components/messaging/ConversationView';
import NewConversationDialog from '@/components/messaging/NewConversationDialog';
import { useMessages } from '@/context/MessageContext';
import { RequireAuth } from '@/components/RequireAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MessagesPage: React.FC = () => {
  const { currentConversation } = useMessages();
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  return (
    <RequireAuth>
      <Helmet>
        <title>Messages | VeteranJobBoard</title>
        <meta name="description" content="Your messages with employers and veterans" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Mobile View Tabs */}
          <div className="md:hidden">
            <Tabs defaultValue={showMobileConversation && currentConversation ? "conversation" : "list"}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger 
                  value="list" 
                  onClick={() => setShowMobileConversation(false)}
                >
                  Conversations
                </TabsTrigger>
                <TabsTrigger 
                  value="conversation" 
                  disabled={!currentConversation}
                  onClick={() => setShowMobileConversation(true)}
                >
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="h-[calc(100vh-250px)]">
                <ConversationList onNewConversation={() => setNewConversationOpen(true)} />
              </TabsContent>
              
              <TabsContent value="conversation" className="h-[calc(100vh-250px)]">
                <ConversationView onBack={() => setShowMobileConversation(false)} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Desktop View - Side by Side */}
          <div className="hidden md:block md:col-span-1 border rounded-lg shadow-sm p-4 overflow-hidden h-full">
            <ConversationList onNewConversation={() => setNewConversationOpen(true)} />
          </div>
          
          <div className="hidden md:block md:col-span-2 border rounded-lg shadow-sm overflow-hidden h-full">
            <ConversationView onBack={() => {}} />
          </div>
        </div>
      </div>
      
      <NewConversationDialog 
        open={newConversationOpen} 
        onOpenChange={setNewConversationOpen} 
      />
    </RequireAuth>
  );
};

export default MessagesPage;
