
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useJobs } from "@/context/JobContext";

const ApplicationsTab = () => {
  const { appliedJobs } = useJobs();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          View your recent job applications and their statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appliedJobs && appliedJobs.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">You have applied to {appliedJobs.length} jobs.</p>
          </div>
        ) : (
          <p>No applications found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
