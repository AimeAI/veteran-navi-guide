
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobAlertForm from "@/components/JobAlertForm";
import JobAlertsList from "@/components/JobAlertsList";

const JobAlertsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-muted-foreground flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Alerts</h1>
            <p className="text-gray-600 mt-1">
              Get notified when jobs matching your criteria are posted
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Bell className="mr-2 h-4 w-4" />
              Create New Alert
            </Button>
          )}
        </div>
        
        {showForm ? (
          <div className="mb-10">
            <JobAlertForm
              onSuccess={() => {
                setShowForm(false);
              }}
            />
          </div>
        ) : null}
        
        <JobAlertsList />
      </div>
    </div>
  );
};

export default JobAlertsPage;
