
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle, Flag, ExternalLink, Trash, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Mock reported forum posts data
const mockReports = [
  { 
    id: '1',
    postId: 'post123',
    topicId: 'topic456',
    topicTitle: 'Transitioning to Civilian IT Careers',
    authorName: 'David Thompson',
    content: 'This platform is terrible. You should all look elsewhere for jobs. Check out this link: [removed link]',
    reportReason: 'Spam/Advertising',
    reportedBy: 'James Wilson',
    reportDate: '2023-06-15T14:30:00Z',
    status: 'pending'
  },
  { 
    id: '2',
    postId: 'post456',
    topicId: 'topic789',
    topicTitle: 'Interview Preparation Tips',
    authorName: 'Rebecca Martinez',
    content: 'You all are **** and don\'t deserve these opportunities. I can\'t believe that veterans get special treatment.',
    reportReason: 'Inappropriate/Offensive Content',
    reportedBy: 'Michael Brown',
    reportDate: '2023-06-14T11:45:00Z',
    status: 'pending'
  },
  { 
    id: '3',
    postId: 'post789',
    topicId: 'topic123',
    topicTitle: 'Resume Building Workshop',
    authorName: 'John Adams',
    content: 'I\'m offering resume writing services for a fee. DM me for rates and details. I can guarantee you\'ll get hired!',
    reportReason: 'Unauthorized Promotion',
    reportedBy: 'Sarah Johnson',
    reportDate: '2023-06-13T09:20:00Z',
    status: 'pending'
  },
  { 
    id: '4',
    postId: 'post111',
    topicId: 'topic222',
    topicTitle: 'Mental Health Resources',
    authorName: 'Lisa Chang',
    content: 'Why are there so many resources for veterans? They chose to join the military. Normal people deserve support too.',
    reportReason: 'Disrespectful to Veterans',
    reportedBy: 'James Wilson',
    reportDate: '2023-06-12T16:15:00Z',
    status: 'resolved'
  },
];

interface ForumModerationProps {
  isLoading?: boolean;
}

const ForumModeration: React.FC<ForumModerationProps> = ({ isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'dismiss' | null>(null);

  // Filter reports based on search query and status filter
  const filteredReports = mockReports
    .filter(report => 
      (filter === 'all' || report.status === filter) &&
      (
        searchQuery === '' || 
        report.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
        report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportReason.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const handleReportAction = (report: typeof mockReports[0], action: 'delete' | 'dismiss') => {
    setSelectedReport(report);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // In a real app, this would call a Supabase function to update the report status
    // and possibly delete the post if actionType is 'delete'
    console.log(`${actionType === 'delete' ? 'Deleted post and resolved report' : 'Dismissed report'}:`, selectedReport?.id);
    setActionDialogOpen(false);
  };

  const viewReportDetails = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
    setReportDialogOpen(true);
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

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Forum Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-4 w-32" />
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
        <CardTitle>Forum Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by content or reason"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              onClick={() => setFilter('all')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              All
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'} 
              onClick={() => setFilter('pending')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Pending
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No reports found</p>
          ) : (
            filteredReports.map(report => (
              <div key={report.id} className="border rounded-lg p-4 bg-white flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{report.topicTitle}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reported by {report.reportedBy} • {formatDate(report.reportDate)}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Reason:</span> {report.reportReason}
                    </p>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      <p className="italic">{truncateContent(report.content)}</p>
                    </div>
                  </div>
                </div>
                
                {report.status === 'pending' && (
                  <div className="flex gap-2 self-end">
                    <Button variant="outline" size="sm" onClick={() => viewReportDetails(report)}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      View Full Post
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleReportAction(report, 'delete')}>
                      <Trash className="h-4 w-4 mr-1" />
                      Delete Post
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleReportAction(report, 'dismiss')}>
                      <Shield className="h-4 w-4 mr-1" />
                      Dismiss Report
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Report Details Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reported Content</DialogTitle>
            <DialogDescription>
              Review this reported forum post before taking action.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{selectedReport.topicTitle}</h3>
                  <p className="text-sm">Posted by {selectedReport.authorName}</p>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="text-sm font-medium">Report Reason:</div>
                <div className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  {selectedReport.reportReason}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="text-sm font-medium">Reported by:</div>
                <div className="text-sm">{selectedReport.reportedBy} on {formatDate(selectedReport.reportDate)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Post Content:</h4>
                <div className="text-sm border rounded-md p-3 bg-gray-50">
                  {selectedReport.content}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Close</Button>
            {selectedReport?.status === 'pending' && (
              <>
                <Button 
                  variant="default" 
                  onClick={() => {
                    setReportDialogOpen(false);
                    handleReportAction(selectedReport, 'delete');
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete Post
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setReportDialogOpen(false);
                    handleReportAction(selectedReport, 'dismiss');
                  }}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Dismiss Report
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'delete' ? 'Delete Post' : 'Dismiss Report'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'delete' 
                ? 'This will permanently remove the post and mark the report as resolved.' 
                : 'This will mark the report as resolved without taking action on the post.'}
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to {actionType === 'delete' ? 'delete this post' : 'dismiss this report'}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'delete' ? 'destructive' : 'default'} 
              onClick={confirmAction}
            >
              {actionType === 'delete' ? 'Delete Post' : 'Dismiss Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ForumModeration;
