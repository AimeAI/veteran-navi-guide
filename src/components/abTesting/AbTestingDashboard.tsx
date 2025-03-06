
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  FlaskConical, 
  Copy, 
  Edit, 
  Trash2, 
  Plus, 
  TrendingUp, 
  Check, 
  Clock, 
  AlertTriangle, 
  Award,
  Eye,
  MousePointerClick,
  FileText
} from 'lucide-react';
import { AbTestResult, JobVariant, VariantPerformance } from '@/types/abTest';
import { toast } from 'sonner';
import AbTestPerformanceChart from './AbTestPerformanceChart';
import AbTestVariantForm from './AbTestVariantForm';

// Mock data for demonstration
const mockTestResults: AbTestResult[] = [
  {
    jobId: 'job-123',
    variants: [
      {
        id: 'var-1',
        jobId: 'job-123',
        title: 'Senior Cybersecurity Analyst',
        description: 'Join our team to protect critical systems and data from cyber threats. Ideal for veterans with security clearance experience.',
        callToAction: 'Apply Now',
        isControl: true,
        isActive: true,
        createdAt: '2023-05-01T00:00:00Z'
      },
      {
        id: 'var-2',
        jobId: 'job-123',
        title: 'Cybersecurity Expert - Military Veterans Preferred',
        description: 'Leverage your military security expertise to protect our clients from emerging cyber threats in a fast-paced environment.',
        callToAction: 'Submit Your Application',
        isControl: false,
        isActive: true,
        createdAt: '2023-05-01T00:00:00Z'
      },
      {
        id: 'var-3',
        jobId: 'job-123',
        title: 'Military Veteran Cyber Analyst',
        description: 'Transform your military security skills into a rewarding civilian career. Security clearance holders highly desired.',
        callToAction: 'Start Your Application',
        isControl: false,
        isActive: true,
        createdAt: '2023-05-01T00:00:00Z'
      }
    ],
    performance: [
      {
        variantId: 'var-1',
        views: 320,
        clicks: 142,
        applications: 28,
        conversionRate: 8.75
      },
      {
        variantId: 'var-2',
        views: 305,
        clicks: 180,
        applications: 42,
        conversionRate: 13.77
      },
      {
        variantId: 'var-3',
        views: 298,
        clicks: 155,
        applications: 38,
        conversionRate: 12.75
      }
    ],
    startDate: '2023-05-01T00:00:00Z',
    status: 'running'
  },
  {
    jobId: 'job-456',
    variants: [
      {
        id: 'var-4',
        jobId: 'job-456',
        title: 'Logistics Coordinator',
        description: 'Standard job description for logistics position focusing on supply chain management.',
        callToAction: 'Apply Now',
        isControl: true,
        isActive: true,
        createdAt: '2023-04-15T00:00:00Z'
      },
      {
        id: 'var-5',
        jobId: 'job-456',
        title: 'Logistics Coordinator - Perfect for Veterans',
        description: 'Military logistics experience welcomed! Use your skills to manage our supply chain operations.',
        callToAction: 'Join Our Team',
        isControl: false,
        isActive: true,
        createdAt: '2023-04-15T00:00:00Z'
      }
    ],
    performance: [
      {
        variantId: 'var-4',
        views: 245,
        clicks: 98,
        applications: 15,
        conversionRate: 6.12
      },
      {
        variantId: 'var-5',
        views: 258,
        clicks: 152,
        applications: 34,
        conversionRate: 13.18
      }
    ],
    startDate: '2023-04-15T00:00:00Z',
    endDate: '2023-05-15T00:00:00Z',
    winningVariantId: 'var-5',
    status: 'completed'
  }
];

interface AbTestingDashboardProps {
  employerId: string;
}

const AbTestingDashboard: React.FC<AbTestingDashboardProps> = ({ employerId }) => {
  const [activeTest, setActiveTest] = useState<AbTestResult | null>(mockTestResults[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateVariant = (jobId: string, variant: Partial<JobVariant>) => {
    // In a real implementation, this would save to a database
    toast.success("New variant created", {
      description: "Your job listing variant is now live and will be shown to job seekers"
    });
    setShowCreateForm(false);
  };

  const handlePauseTest = (testId: string) => {
    toast.success("Test paused", {
      description: "The A/B test has been paused. You can resume it anytime."
    });
  };

  const handleEndTest = (testId: string) => {
    toast.success("Test ended", {
      description: "The A/B test has ended and a winner has been selected."
    });
  };

  const getVariantStatus = (variant: JobVariant, performance?: VariantPerformance) => {
    if (!variant.isActive) return "inactive";
    if (variant.isControl) return "control";
    if (performance && performance.conversionRate > 10) return "leading";
    return "active";
  };

  const badgeColorByStatus = {
    control: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    leading: "bg-green-100 text-green-800 hover:bg-green-200",
    active: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    inactive: "bg-red-100 text-red-800 hover:bg-red-200",
    winner: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">A/B Testing Dashboard</h2>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Test
        </Button>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New A/B Test</CardTitle>
            <CardDescription>
              Create different versions of your job listing to see which performs best
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AbTestVariantForm 
              onSubmit={(variant) => handleCreateVariant('new-job', variant)}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Active Tests
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Completed Tests
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                All Tests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {mockTestResults.filter(test => test.status === 'running').map(test => (
                <Card key={test.jobId} onClick={() => setActiveTest(test)} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${activeTest?.jobId === test.jobId ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <CardTitle>{test.variants.find(v => v.isControl)?.title || 'Job Test'}</CardTitle>
                    <CardDescription>
                      Started on {new Date(test.startDate).toLocaleDateString()} • {test.variants.length} variants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {test.variants.map(variant => {
                          const performance = test.performance.find(p => p.variantId === variant.id);
                          const status = getVariantStatus(variant, performance);
                          return (
                            <Badge key={variant.id} variant="outline" className={badgeColorByStatus[status]}>
                              {variant.isControl ? 'Control' : `Variant ${test.variants.indexOf(variant)}`}
                              {status === 'leading' && <TrendingUp className="ml-1 h-3 w-3" />}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="mr-1 h-4 w-4" />
                        {test.performance.reduce((sum, p) => sum + p.views, 0)} views
                        <FileText className="ml-3 mr-1 h-4 w-4" />
                        {test.performance.reduce((sum, p) => sum + p.applications, 0)} applications
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {mockTestResults.filter(test => test.status === 'completed').map(test => (
                <Card key={test.jobId} onClick={() => setActiveTest(test)} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${activeTest?.jobId === test.jobId ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{test.variants.find(v => v.isControl)?.title || 'Job Test'}</CardTitle>
                      <Badge variant="outline" className={badgeColorByStatus.winner}>
                        <Award className="mr-1 h-3 w-3" />
                        Winner Found
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(test.startDate).toLocaleDateString()} - {test.endDate ? new Date(test.endDate).toLocaleDateString() : 'Present'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Winning variant: </span>
                        {test.variants.find(v => v.id === test.winningVariantId)?.title || 'Unknown'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                        {Math.round((test.performance.find(p => p.variantId === test.winningVariantId)?.conversionRate || 0) * 100) / 100}% conversion
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {mockTestResults.map(test => (
                <Card key={test.jobId} onClick={() => setActiveTest(test)} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${activeTest?.jobId === test.jobId ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{test.variants.find(v => v.isControl)?.title || 'Job Test'}</CardTitle>
                      <Badge variant="outline" className={
                        test.status === 'running' ? 'bg-blue-100 text-blue-800' : 
                        test.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(test.startDate).toLocaleDateString()} - {test.endDate ? new Date(test.endDate).toLocaleDateString() : 'Present'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Badge variant="outline">
                          {test.variants.length} variants
                        </Badge>
                        <Badge variant="outline">
                          <Eye className="mr-1 h-3 w-3" />
                          {test.performance.reduce((sum, p) => sum + p.views, 0)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {test.status === 'completed' ? 'Completed on ' : 'Running since '}
                        {test.status === 'completed' && test.endDate 
                          ? new Date(test.endDate).toLocaleDateString() 
                          : new Date(test.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {activeTest && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Test Details: {activeTest.variants.find(v => v.isControl)?.title}</CardTitle>
                    <CardDescription>
                      {activeTest.status === 'running' ? 'Running since ' : 'Ran from '}
                      {new Date(activeTest.startDate).toLocaleDateString()}
                      {activeTest.endDate && ` to ${new Date(activeTest.endDate).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {activeTest.status === 'running' && (
                      <>
                        <Button variant="outline" onClick={() => handlePauseTest(activeTest.jobId)}>
                          Pause Test
                        </Button>
                        <Button variant="destructive" onClick={() => handleEndTest(activeTest.jobId)}>
                          End Test
                        </Button>
                      </>
                    )}
                    {activeTest.status === 'completed' && (
                      <Button variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Use Winning Variant
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
                  <div className="h-64">
                    <AbTestPerformanceChart testResult={activeTest} />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Variants</h3>
                  <div className="space-y-4">
                    {activeTest.variants.map((variant, index) => {
                      const performance = activeTest.performance.find(p => p.variantId === variant.id);
                      const isWinner = activeTest.winningVariantId === variant.id;
                      return (
                        <Card key={variant.id} className={`${isWinner ? 'border-green-300 bg-green-50' : ''}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle className="flex items-center">
                                  {variant.title}
                                  {isWinner && <Award className="ml-2 h-5 w-5 text-yellow-500" />}
                                </CardTitle>
                                <CardDescription>
                                  {variant.isControl ? 'Control Variant' : `Variant ${index}`}
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <Badge 
                                  variant="outline" 
                                  className={
                                    isWinner ? badgeColorByStatus.winner :
                                    variant.isControl ? badgeColorByStatus.control :
                                    performance && performance.conversionRate > 10 ? badgeColorByStatus.leading :
                                    badgeColorByStatus.active
                                  }
                                >
                                  {isWinner ? 'Winner' : 
                                   variant.isControl ? 'Control' : 
                                   performance && performance.conversionRate > 10 ? 'Leading' : 
                                   'Active'}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">{variant.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-4">
                              <div className="bg-gray-100 rounded p-2 text-sm">
                                <div className="text-gray-600">Call to action</div>
                                <div className="font-medium">{variant.callToAction}</div>
                              </div>
                              {performance && (
                                <>
                                  <div className="bg-gray-100 rounded p-2 text-sm">
                                    <div className="text-gray-600">Views</div>
                                    <div className="font-medium">{performance.views}</div>
                                  </div>
                                  <div className="bg-gray-100 rounded p-2 text-sm">
                                    <div className="text-gray-600">Clicks</div>
                                    <div className="font-medium">{performance.clicks}</div>
                                  </div>
                                  <div className="bg-gray-100 rounded p-2 text-sm">
                                    <div className="text-gray-600">Applications</div>
                                    <div className="font-medium">{performance.applications}</div>
                                  </div>
                                  <div className="bg-gray-100 rounded p-2 text-sm">
                                    <div className="text-gray-600">Conversion Rate</div>
                                    <div className="font-medium">{performance.conversionRate.toFixed(2)}%</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t bg-gray-50 py-2">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              {!variant.isControl && (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AbTestingDashboard;
