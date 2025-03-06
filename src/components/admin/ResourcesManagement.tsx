
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash, Search, FolderOpen, Link, FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  fileType?: string;
  icon: 'pdf' | 'doc' | 'video' | 'link' | 'other';
  dateAdded: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Resume Template for Veterans',
    description: 'A customizable resume template specifically designed for veterans transitioning to civilian careers',
    category: 'Resume Templates',
    url: '/resources/resume-template-veterans.docx',
    fileType: 'application/msword',
    icon: 'doc',
    dateAdded: '2023-08-15'
  },
  {
    id: '2',
    title: 'Interview Preparation Guide',
    description: 'Comprehensive guide to help veterans prepare for job interviews',
    category: 'Interview Preparation',
    url: '/resources/interview-guide.pdf',
    fileType: 'application/pdf',
    icon: 'pdf',
    dateAdded: '2023-09-20'
  },
  {
    id: '3',
    title: 'Veteran Benefits Overview Video',
    description: 'A video explaining key benefits available to veterans in the civilian workforce',
    category: 'Benefits Information',
    url: 'https://www.youtube.com/watch?v=exampleid',
    icon: 'video',
    dateAdded: '2023-10-05'
  }
];

const categories = [
  'Resume Templates',
  'Interview Preparation',
  'Benefits Information',
  'Career Transition',
  'Skill Translation',
  'Educational Resources',
  'Other'
];

const ResourcesManagement = () => {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewResource = () => {
    setCurrentResource({
      id: Date.now().toString(),
      title: '',
      description: '',
      category: '',
      url: '',
      icon: 'link',
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setCurrentResource(resource);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(prevResources => prevResources.filter(resource => resource.id !== id));
      toast.success('Resource deleted successfully');
    }
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResource) return;

    // Determine icon based on URL or file type
    let icon: Resource['icon'] = 'link';
    if (currentResource.url.endsWith('.pdf')) icon = 'pdf';
    else if (currentResource.url.endsWith('.doc') || currentResource.url.endsWith('.docx')) icon = 'doc';
    else if (currentResource.url.includes('youtube') || currentResource.url.includes('vimeo')) icon = 'video';
    
    const updatedResource = {
      ...currentResource,
      icon
    };

    if (isEditing) {
      setResources(prevResources => 
        prevResources.map(resource => resource.id === currentResource.id ? updatedResource : resource)
      );
      toast.success('Resource updated successfully');
    } else {
      setResources(prevResources => [...prevResources, updatedResource]);
      toast.success('Resource created successfully');
    }
    
    setDialogOpen(false);
  };

  const getIconForResource = (resource: Resource) => {
    switch (resource.icon) {
      case 'pdf':
        return <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">PDF</div>;
      case 'doc':
        return <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">DOC</div>;
      case 'video':
        return <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">VID</div>;
      default:
        return <Link className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Resources</h2>
        <Button onClick={handleNewResource}>
          <Plus className="mr-2 h-4 w-4" /> New Resource
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No resources found</h3>
          <p className="text-gray-500">Create your first resource to get started</p>
          <Button onClick={handleNewResource} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Resource
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="mr-4">
                    {getIconForResource(resource)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-gray-500 my-1">{resource.description}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mt-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">{resource.category}</span>
                      <span>Added: {resource.dateAdded}</span>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Resource</a>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditResource(resource)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteResource(resource.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveResource} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input
                id="title"
                value={currentResource?.title || ''}
                onChange={(e) => setCurrentResource(prev => prev ? {...prev, title: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <select
                id="category"
                value={currentResource?.category || ''}
                onChange={(e) => setCurrentResource(prev => prev ? {...prev, category: e.target.value} : null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                id="description"
                value={currentResource?.description || ''}
                onChange={(e) => setCurrentResource(prev => prev ? {...prev, description: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="resourceUrl" className="block text-sm font-medium mb-1">Resource URL</label>
              <Input
                id="resourceUrl"
                type="url"
                value={currentResource?.url || ''}
                onChange={(e) => setCurrentResource(prev => prev ? {...prev, url: e.target.value} : null)}
                placeholder="https://example.com/resource or /path/to/file.pdf"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <FileUp className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                File uploads will be supported when connected to storage service
              </span>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Resource' : 'Add Resource'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesManagement;
