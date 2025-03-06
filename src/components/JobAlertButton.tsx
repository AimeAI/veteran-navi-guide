
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";

const JobAlertButton: React.FC = () => {
  return (
    <Button asChild>
      <Link to="/job-alerts" className="flex items-center">
        <Bell className="mr-2 h-4 w-4" />
        Job Alerts
      </Link>
    </Button>
  );
};

export default JobAlertButton;
