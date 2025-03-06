
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Image, Home, Info, LayoutTemplate, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface BannerContent {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  active: boolean;
  page: 'home' | 'jobs' | 'resources';
}

interface PageContent {
  id: string;
  page: string;
  title: string;
  content: string;
  lastUpdated: string;
}

const mockBanners: BannerContent[] = [
  {
    id: '1',
    title: 'Find Your Next Career Opportunity',
    subtitle: 'Connect with employers who value your military experience',
    buttonText: 'Browse Jobs',
    buttonUrl: '/job-search',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    active: true,
    page: 'home'
  },
  {
    id: '2',
    title: 'Transitioning to Civilian Life?',
    subtitle: 'Explore our resources designed specifically for veterans',
    buttonText: 'View Resources',
    buttonUrl: '/resources/military-transition',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    active: false,
    page: 'home'
  },
  {
    id: '3',
    title: 'Find Jobs That Match Your Skills',
    subtitle: 'Search thousands of veteran-friendly positions',
    buttonText: 'Start Searching',
    buttonUrl: '/job-search',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    active: true,
    page: 'jobs'
  }
];

const mockPageContent: PageContent[] = [
  {
    id: '1',
    page: 'about',
    title: 'About VeteranJobBoard',
    content: 'VeteranJobBoard is dedicated to connecting veterans with employers who value their unique skills and experiences. Our mission is to ease the transition from military to civilian life by providing resources, job opportunities, and a supportive community.',
    lastUpdated: '2023-09-15'
  },
  {
    id: '2',
    page: 'mission',
    title: 'Our Mission',
    content: 'Our mission is to empower veterans in their career journey by providing access to job opportunities, resources, and a supportive community. We believe that veterans bring exceptional skills and experiences to the workforce, and we are dedicated to helping them find roles where they can thrive.',
    lastUpdated: '2023-10-02'
  },
  {
    id: '3',
    page: 'privacy',
    title: 'Privacy Policy',
    content: 'At VeteranJobBoard, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform.',
    lastUpdated: '2023-11-01'
  }
];

const WebsiteContentManagement = () => {
  const [activeTab, setActiveTab] = useState('banners');
  const [banners, setBanners] = useState<BannerContent[]>(mockBanners);
  const [pages, setPages] = useState<PageContent[]>(mockPageContent);
  
  const [currentBanner, setCurrentBanner] = useState<BannerContent | null>(null);
  const [currentPage, setCurrentPage] = useState<PageContent | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [pageDialogOpen, setPageDialogOpen] = useState(false);

  // Banner management functions
  const handleNewBanner = () => {
    setCurrentBanner({
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      buttonText: '',
      buttonUrl: '',
      imageUrl: '',
      active: false,
      page: 'home'
    });
    setIsEditing(false);
    setBannerDialogOpen(true);
  };

  const handleEditBanner = (banner: BannerContent) => {
    setCurrentBanner(banner);
    setIsEditing(true);
    setBannerDialogOpen(true);
  };

  const handleToggleBannerActive = (id: string) => {
    setBanners(prevBanners => 
      prevBanners.map(banner => {
        if (banner.id === id) {
          return { ...banner, active: !banner.active };
        }
        return banner;
      })
    );
    toast.success('Banner status updated');
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBanner) return;

    if (isEditing) {
      setBanners(prevBanners => 
        prevBanners.map(banner => banner.id === currentBanner.id ? currentBanner : banner)
      );
      toast.success('Banner updated successfully');
    } else {
      setBanners(prevBanners => [...prevBanners, currentBanner]);
      toast.success('Banner created successfully');
    }
    
    setBannerDialogOpen(false);
  };

  // Page content management functions
  const handleNewPage = () => {
    setCurrentPage({
      id: Date.now().toString(),
      page: '',
      title: '',
      content: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setPageDialogOpen(true);
  };

  const handleEditPage = (page: PageContent) => {
    setCurrentPage(page);
    setIsEditing(true);
    setPageDialogOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (isEditing) {
      setPages(prevPages => 
        prevPages.map(page => page.id === currentPage.id ? updatedPage : page)
      );
      toast.success('Page content updated successfully');
    } else {
      setPages(prevPages => [...prevPages, updatedPage]);
      toast.success('Page content created successfully');
    }
    
    setPageDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="banners" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Page Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="banners">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Banners</h2>
            <Button onClick={handleNewBanner}>
              <Plus className="mr-2 h-4 w-4" /> New Banner
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {banners.map((banner) => (
              <Card key={banner.id} className={`hover:shadow-md transition-shadow ${banner.active ? 'border-primary' : ''}`}>
                <CardContent className="p-0">
                  <div className="w-full h-40 bg-gray-100 relative overflow-hidden">
                    {banner.imageUrl ? (
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        <Image className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                      <span className={`block h-3 w-3 rounded-full ${banner.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                      <div className="text-sm font-medium uppercase">
                        {banner.page.charAt(0).toUpperCase() + banner.page.slice(1)} Page
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate" title={banner.title}>{banner.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                    <div className="flex items-center text-sm text-primary mt-2">
                      <span>{banner.buttonText}</span>
                      <span className="mx-2">→</span>
                      <span className="text-gray-500 truncate">{banner.buttonUrl}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleBannerActive(banner.id)}
                        className={banner.active ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                      >
                        {banner.active ? (
                          <>
                            <X className="h-4 w-4 mr-1" /> Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" /> Activate
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditBanner(banner)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Banner' : 'Create New Banner'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveBanner} className="space-y-4">
                <div>
                  <label htmlFor="bannerTitle" className="block text-sm font-medium mb-1">Banner Title</label>
                  <Input
                    id="bannerTitle"
                    value={currentBanner?.title || ''}
                    onChange={(e) => setCurrentBanner(prev => prev ? {...prev, title: e.target.value} : null)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bannerSubtitle" className="block text-sm font-medium mb-1">Subtitle</label>
                  <Textarea
                    id="bannerSubtitle"
                    value={currentBanner?.subtitle || ''}
                    onChange={(e) => setCurrentBanner(prev => prev ? {...prev, subtitle: e.target.value} : null)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="buttonText" className="block text-sm font-medium mb-1">Button Text</label>
                    <Input
                      id="buttonText"
                      value={currentBanner?.buttonText || ''}
                      onChange={(e) => setCurrentBanner(prev => prev ? {...prev, buttonText: e.target.value} : null)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="buttonUrl" className="block text-sm font-medium mb-1">Button URL</label>
                    <Input
                      id="buttonUrl"
                      value={currentBanner?.buttonUrl || ''}
                      onChange={(e) => setCurrentBanner(prev => prev ? {...prev, buttonUrl: e.target.value} : null)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bannerImage" className="block text-sm font-medium mb-1">Banner Image URL</label>
                  <Input
                    id="bannerImage"
                    value={currentBanner?.imageUrl || ''}
                    onChange={(e) => setCurrentBanner(prev => prev ? {...prev, imageUrl: e.target.value} : null)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bannerPage" className="block text-sm font-medium mb-1">Page Location</label>
                    <select
                      id="bannerPage"
                      value={currentBanner?.page || 'home'}
                      onChange={(e) => setCurrentBanner(prev => prev ? {...prev, page: e.target.value as 'home' | 'jobs' | 'resources'} : null)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="home">Home Page</option>
                      <option value="jobs">Jobs Page</option>
                      <option value="resources">Resources Page</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium mt-6">
                      <input
                        type="checkbox"
                        checked={currentBanner?.active || false}
                        onChange={(e) => setCurrentBanner(prev => prev ? {...prev, active: e.target.checked} : null)}
                        className="mr-2 rounded border-gray-300"
                      />
                      Active Banner
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setBannerDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Update Banner' : 'Create Banner'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="pages">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Page Content</h2>
            <Button onClick={handleNewPage}>
              <Plus className="mr-2 h-4 w-4" /> New Page Content
            </Button>
          </div>
          
          <div className="space-y-4">
            {pages.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <LayoutTemplate className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="font-medium">{page.title}</h3>
                      </div>
                      <div className="text-sm text-gray-500 mt-1 mb-3">
                        <span className="uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                          {page.page}
                        </span>
                        <span className="ml-3">Last updated: {page.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{page.content}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditPage(page)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={pageDialogOpen} onOpenChange={setPageDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Page Content' : 'Add New Page Content'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSavePage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pageIdentifier" className="block text-sm font-medium mb-1">Page Identifier</label>
                    <Input
                      id="pageIdentifier"
                      value={currentPage?.page || ''}
                      onChange={(e) => setCurrentPage(prev => prev ? {...prev, page: e.target.value} : null)}
                      placeholder="E.g., about, mission, privacy"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">A unique identifier for the page section</p>
                  </div>
                  <div>
                    <label htmlFor="pageTitle" className="block text-sm font-medium mb-1">Section Title</label>
                    <Input
                      id="pageTitle"
                      value={currentPage?.title || ''}
                      onChange={(e) => setCurrentPage(prev => prev ? {...prev, title: e.target.value} : null)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="pageContent" className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    id="pageContent"
                    value={currentPage?.content || ''}
                    onChange={(e) => setCurrentPage(prev => prev ? {...prev, content: e.target.value} : null)}
                    required
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setPageDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Update Content' : 'Add Content'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteContentManagement;
