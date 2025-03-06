
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserCog, Ban, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Mock user data
const mockUsers = [
  { 
    id: '1', 
    name: 'James Wilson', 
    email: 'james.wilson@example.com', 
    role: 'veteran', 
    status: 'active', 
    lastActive: '2023-06-15T14:30:00Z' 
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@company.ca', 
    role: 'employer', 
    status: 'active', 
    lastActive: '2023-06-16T09:45:00Z' 
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael.brown@example.com', 
    role: 'veteran', 
    status: 'inactive', 
    lastActive: '2023-05-20T11:15:00Z' 
  },
  { 
    id: '4', 
    name: 'Rebecca Martinez', 
    email: 'rebecca@techfirm.ca', 
    role: 'employer', 
    status: 'active', 
    lastActive: '2023-06-14T16:20:00Z' 
  },
  { 
    id: '5', 
    name: 'David Thompson', 
    email: 'david.t@example.com', 
    role: 'veteran', 
    status: 'suspended', 
    lastActive: '2023-06-10T08:05:00Z' 
  }
];

interface UserManagementProps {
  isLoading?: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({ isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'ban' | 'unban' | null>(null);

  // Filter users based on search query
  const filteredUsers = searchQuery 
    ? mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockUsers;

  const handleUserAction = (user: typeof mockUsers[0], action: 'ban' | 'unban') => {
    setSelectedUser(user);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // In a real app, this would call a Supabase function to update the user's status
    console.log(`${actionType === 'ban' ? 'Banned' : 'Unbanned'} user:`, selectedUser?.id);
    setActionDialogOpen(false);
  };

  const viewUserDetails = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'veteran':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Veteran</span>;
      case 'employer':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Employer</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case 'suspended':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No users found</p>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="border rounded-lg p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    {getRoleLabel(user.role)}
                    {getStatusLabel(user.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last active: {formatDate(user.lastActive)}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" onClick={() => viewUserDetails(user)}>
                    <UserCog className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  {user.status === 'suspended' ? (
                    <Button variant="outline" size="sm" onClick={() => handleUserAction(user, 'unban')}>
                      <Check className="h-4 w-4 mr-1" />
                      Unban
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleUserAction(user, 'ban')}>
                      <Ban className="h-4 w-4 mr-1" />
                      Ban
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user account.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Name:</div>
                <div className="text-sm">{selectedUser.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Email:</div>
                <div className="text-sm">{selectedUser.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Role:</div>
                <div className="text-sm capitalize">{selectedUser.role}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Status:</div>
                <div className="text-sm capitalize">{selectedUser.status}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Last Active:</div>
                <div className="text-sm">{formatDate(selectedUser.lastActive)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban/Unban Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'ban' ? 'Ban User' : 'Unban User'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'ban' 
                ? 'This action will suspend user access to the platform.' 
                : 'This action will restore user access to the platform.'}
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to {actionType === 'ban' ? 'ban' : 'unban'} {selectedUser?.name}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'ban' ? 'destructive' : 'default'} 
              onClick={confirmAction}
            >
              {actionType === 'ban' ? 'Ban User' : 'Unban User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
