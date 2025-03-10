
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LmsConnection, fetchCanvasCourses } from '@/services/lmsService';
import { BookOpen, RefreshCw, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistance } from 'date-fns';

interface LmsConnectionsListProps {
  connections: LmsConnection[];
  onRemove: (id: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const LmsConnectionsList: React.FC<LmsConnectionsListProps> = ({ 
  connections, 
  onRemove, 
  onRefresh,
  isLoading 
}) => {
  const handleRefreshCourses = async (connectionId: string, lmsType: string) => {
    try {
      if (lmsType === 'canvas') {
        await fetchCanvasCourses(connectionId);
        onRefresh();
      } else {
        toast.info('Refreshing courses is only supported for Canvas LMS currently');
      }
    } catch (error) {
      console.error('Error refreshing courses:', error);
      toast.error('Failed to refresh courses');
    }
  };

  if (connections.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No LMS Connections</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect your learning management systems to import your courses and certifications.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Connected Learning Platforms</h2>
      
      {connections.map((connection) => (
        <Card key={connection.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="capitalize">
                  {connection.lms_type} LMS
                </CardTitle>
                <CardDescription>
                  Connected {formatDistance(new Date(connection.connected_at), new Date(), { addSuffix: true })}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(connection.instance_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-gray-500">Instance URL:</p>
              <p className="font-medium truncate">{connection.instance_url}</p>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRefreshCourses(connection.id, connection.lms_type)}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Courses
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(connection.id)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LmsConnectionsList;
