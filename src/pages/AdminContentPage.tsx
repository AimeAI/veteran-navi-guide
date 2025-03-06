
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FolderOpen, Calendar, Layout, Shield } from 'lucide-react';
import BlogPostsManagement from '@/components/admin/BlogPostsManagement';
import ResourcesManagement from '@/components/admin/ResourcesManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import WebsiteContentManagement from '@/components/admin/WebsiteContentManagement';
import { RequireAuth } from '@/components/RequireAuth';

const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState('blog-posts');
  
  return (
    <RequireAuth>
      <div className="container py-10 max-w-7xl">
        <div className="flex items-center mb-8">
          <Shield className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">Admin Content Management</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="blog-posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Website Content
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="blog-posts">
            <BlogPostsManagement />
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourcesManagement />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>
          
          <TabsContent value="website">
            <WebsiteContentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
};

export default AdminContentPage;
