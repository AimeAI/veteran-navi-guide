
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Plus, BookOpen, Award, School } from 'lucide-react';
import LmsConnectionForm from '@/components/lms/LmsConnectionForm';
import LmsConnectionsList from '@/components/lms/LmsConnectionsList';
import CoursesList from '@/components/lms/CoursesList';
import CertificationsList from '@/components/lms/CertificationsList';
import CertificationForm from '@/components/lms/CertificationForm';
import { 
  LmsConnection, 
  LmsCourse, 
  LmsCertification,
  getUserLmsConnections,
  removeLmsConnection,
  getUserCourses,
  getUserCertifications,
  deleteCertification
} from '@/services/lms';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const LmsIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('connections');
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState<LmsConnection[]>([]);
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [certifications, setCertifications] = useState<LmsCertification[]>([]);
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false);
  const [isAddCertificationOpen, setIsAddCertificationOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Load connections
        const userConnections = await getUserLmsConnections(user.email);
        setConnections(userConnections);
        
        // If there are connections, load courses
        if (userConnections.length > 0) {
          const allCourses: LmsCourse[] = [];
          for (const connection of userConnections) {
            const connectionCourses = await getUserCourses(connection.id);
            allCourses.push(...connectionCourses);
          }
          setCourses(allCourses);
        }
        
        // Load certifications
        const userCertifications = await getUserCertifications(user.email);
        setCertifications(userCertifications);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load learning data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveConnection = async (connectionId: string) => {
    try {
      const success = await removeLmsConnection(connectionId);
      if (success) {
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
        // Also filter out courses from this connection
        setCourses(prev => prev.filter(course => course.lms_connection_id !== connectionId));
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    }
  };

  const handleDeleteCertification = async (certificationId: string) => {
    try {
      const success = await deleteCertification(certificationId);
      if (success) {
        setCertifications(prev => prev.filter(cert => cert.id !== certificationId));
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Failed to delete certification');
    }
  };

  if (!user) {
    return (
      <div className="container py-10">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Learning Management</CardTitle>
            <CardDescription>
              You need to be logged in to access your learning resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Learning Management</h1>
            <p className="text-gray-500 mt-1">
              Connect your learning platforms and showcase your courses and certifications
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isAddCertificationOpen} onOpenChange={setIsAddCertificationOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsAddCertificationOpen(true)}>
                  <Award className="mr-2 h-4 w-4" />
                  Add Certification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Certification</DialogTitle>
                  <DialogDescription>
                    Add your certifications to showcase your skills and achievements
                  </DialogDescription>
                </DialogHeader>
                <CertificationForm 
                  onSuccess={() => {
                    loadUserData();
                    setIsAddCertificationOpen(false);
                  }} 
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddConnectionOpen} onOpenChange={setIsAddConnectionOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddConnectionOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Connect LMS
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Learning Platform</DialogTitle>
                  <DialogDescription>
                    Link your Learning Management System to import your courses
                  </DialogDescription>
                </DialogHeader>
                <LmsConnectionForm 
                  onSuccess={() => {
                    loadUserData();
                    setIsAddConnectionOpen(false);
                  }} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="connections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <School className="mr-2 h-4 w-4" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Award className="mr-2 h-4 w-4" />
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-6">
            <LmsConnectionsList 
              connections={connections}
              onRemove={handleRemoveConnection}
              onRefresh={loadUserData}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CoursesList 
              courses={courses}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <CertificationsList 
              certifications={certifications}
              onDelete={handleDeleteCertification}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LmsIntegrationPage;
