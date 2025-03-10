
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '@/components/employer/Dashboard';
import ApplicationManagement from '@/components/employer/ApplicationManagement';
import { CalendarRange, Users, ChartBar, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function EmployerDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <ChartBar className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Users className="mr-2 h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarRange className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="p-6">
            <Dashboard />
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card className="p-6">
            <ApplicationManagement />
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
              <p className="text-muted-foreground">Schedule interviews and track candidate touchpoints</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Messaging Center Coming Soon</h3>
              <p className="text-muted-foreground">Communicate with candidates directly from the dashboard</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
