
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  status: 'draft' | 'published';
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Guide to Military-to-Civilian Transition',
    excerpt: 'Tips for veterans transitioning to civilian careers',
    content: 'Full content here...',
    author: 'John Smith',
    publishedDate: '2023-10-15',
    status: 'published'
  },
  {
    id: '2',
    title: 'Top Industries Hiring Veterans in 2023',
    excerpt: 'Discover which industries are actively recruiting veterans',
    content: 'Full content here...',
    author: 'Emily Johnson',
    publishedDate: '2023-09-28',
    status: 'published'
  },
  {
    id: '3',
    title: 'Leveraging Military Skills in Job Interviews',
    excerpt: 'How to translate your military experience effectively',
    content: 'Draft content...',
    author: 'Michael Brown',
    publishedDate: '',
    status: 'draft'
  }
];

const BlogPostsManagement = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewPost = () => {
    setCurrentPost({
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      author: '',
      publishedDate: '',
      status: 'draft'
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast.success('Blog post deleted successfully');
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    if (isEditing) {
      setBlogPosts(prevPosts => 
        prevPosts.map(post => post.id === currentPost.id ? currentPost : post)
      );
      toast.success('Blog post updated successfully');
    } else {
      setBlogPosts(prevPosts => [...prevPosts, currentPost]);
      toast.success('Blog post created successfully');
    }
    
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
        <Button onClick={handleNewPost}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No blog posts found</h3>
          <p className="text-gray-500">Create your first blog post to get started</p>
          <Button onClick={handleNewPost} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium truncate" title={post.title}>
                  {post.title}
                </CardTitle>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.author}</span>
                  <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeletePost(post.id)}>
                    <Trash className="h-4 w-4 mr-1" /> Delete
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
            <DialogTitle>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePost} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input
                id="title"
                value={currentPost?.title || ''}
                onChange={(e) => setCurrentPost(prev => prev ? {...prev, title: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-1">Author</label>
              <Input
                id="author"
                value={currentPost?.author || ''}
                onChange={(e) => setCurrentPost(prev => prev ? {...prev, author: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt</label>
              <Textarea
                id="excerpt"
                value={currentPost?.excerpt || ''}
                onChange={(e) => setCurrentPost(prev => prev ? {...prev, excerpt: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
              <Textarea
                id="content"
                value={currentPost?.content || ''}
                onChange={(e) => setCurrentPost(prev => prev ? {...prev, content: e.target.value} : null)}
                required
                className="min-h-[200px]"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <select
                id="status"
                value={currentPost?.status || 'draft'}
                onChange={(e) => setCurrentPost(prev => prev ? {...prev, status: e.target.value as 'draft' | 'published'} : null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPostsManagement;
