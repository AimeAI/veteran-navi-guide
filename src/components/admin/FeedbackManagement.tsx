
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Bug, HelpCircle, Search, CheckCircle, XCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  type: 'suggestion' | 'bug' | 'support';
  title: string;
  description: string;
  email: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  response?: string;
}

const mockFeedbackItems: FeedbackItem[] = [
  {
    id: '1',
    type: 'suggestion',
    title: 'Add dark mode support',
    description: 'It would be great to have a dark mode option for the platform, especially for night use.',
    email: 'user1@example.com',
    status: 'pending',
    createdAt: '2023-11-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'bug',
    title: 'Profile image not uploading',
    description: 'When I try to upload a profile picture, it gets stuck at 90% and then fails.',
    email: 'user2@example.com',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2023-11-14T15:45:00Z'
  },
  {
    id: '3',
    type: 'support',
    title: 'Cannot reset password',
    description: 'I requested a password reset link but never received the email.',
    email: 'user3@example.com',
    status: 'resolved',
    createdAt: '2023-11-13T09:20:00Z',
    response: 'We have resent the password reset email. Please also check your spam folder.'
  }
];

const FeedbackManagement = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(mockFeedbackItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentItem, setCurrentItem] = useState<FeedbackItem | null>(null);
  const [responseText, setResponseText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredItems = feedbackItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewItem = (item: FeedbackItem) => {
    setCurrentItem(item);
    setResponseText(item.response || '');
    setDialogOpen(true);
  };

  const handleStatusChange = (itemId: string, newStatus: FeedbackItem['status']) => {
    setFeedbackItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    toast.success(`Item status updated to ${newStatus}`);
  };

  const handleSaveResponse = () => {
    if (!currentItem) return;
    
    setFeedbackItems(prevItems => 
      prevItems.map(item => 
        item.id === currentItem.id 
        ? { ...item, response: responseText, status: item.status === 'pending' ? 'in-progress' : item.status } 
        : item
      )
    );
    
    toast.success('Response saved successfully');
    setDialogOpen(false);
    
    // In a real app, this would send an email to the user
    console.log(`Email would be sent to ${currentItem.email} with response: ${responseText}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'bug': return <Bug className="h-5 w-5 text-red-500" />;
      case 'support': return <HelpCircle className="h-5 w-5 text-purple-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    let classes = 'px-2 py-1 text-xs rounded-full font-medium';
    
    switch (status) {
      case 'pending':
        classes += ' bg-yellow-100 text-yellow-800';
        break;
      case 'in-progress':
        classes += ' bg-blue-100 text-blue-800';
        break;
      case 'resolved':
        classes += ' bg-green-100 text-green-800';
        break;
      case 'rejected':
        classes += ' bg-red-100 text-red-800';
        break;
      default:
        classes += ' bg-gray-100 text-gray-800';
    }
    
    return <span className={classes}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage User Feedback</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="suggestion">Suggestions</option>
            <option value="bug">Bugs</option>
            <option value="support">Support</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No feedback items found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(item.type)}
                    <CardTitle className="text-lg font-medium" title={item.title}>
                      {item.title}
                    </CardTitle>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2">
                    <span>{item.email}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.priority && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize">Priority: {item.priority}</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(item.id, 'resolved')}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Mark Resolved
                    </Button>
                    {item.status !== 'rejected' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(item.id, 'rejected')}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewItem(item)}>
                    <Mail className="h-4 w-4 mr-1" /> Respond
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentItem && (
                <div className="flex items-center gap-2">
                  {getTypeIcon(currentItem.type)}
                  <span>{currentItem.title}</span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">From</h4>
                <p className="text-sm">{currentItem.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{currentItem.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <div className="flex gap-2">
                  <select
                    value={currentItem.status}
                    onChange={(e) => setFeedbackItems(prev => 
                      prev.map(item => 
                        item.id === currentItem.id 
                          ? { ...item, status: e.target.value as FeedbackItem['status'] } 
                          : item
                      )
                    )}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Your Response</h4>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response here..."
                  rows={5}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveResponse}>
                  Save & Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackManagement;
