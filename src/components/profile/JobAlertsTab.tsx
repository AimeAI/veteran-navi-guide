
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import JobAlertForm from "@/components/JobAlertForm";
import JobAlertsList from "@/components/JobAlertsList";
import { toast } from "sonner";

const JobAlertsTab = ({ showCreate = false }) => {
  const [showCreateAlert, setShowCreateAlert] = useState(showCreate);

  return (
    <>
      {showCreateAlert ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Job Alert</h2>
            <Button variant="outline" onClick={() => setShowCreateAlert(false)}>
              Back to Alerts
            </Button>
          </div>
          <JobAlertForm 
            onSuccess={() => {
              setShowCreateAlert(false);
              toast.success("Job alert created successfully");
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Job Alerts</h2>
            <Button onClick={() => setShowCreateAlert(true)}>
              Create New Alert
            </Button>
          </div>
          <JobAlertsList />
        </div>
      )}
    </>
  );
};

export default JobAlertsTab;
