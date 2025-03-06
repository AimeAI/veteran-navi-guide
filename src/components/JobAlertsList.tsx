
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Edit, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import JobAlertForm from "./JobAlertForm";
import FormErrorMessage from "./ui/form-error-message";

// Define the type for a job alert
interface JobAlert {
  id: string;
  keywords: string;
  location: string;
  category: string;
  createdAt: string;
}

// Placeholder data for job alerts
const placeholderAlerts: JobAlert[] = [
  {
    id: "1",
    keywords: "Software Engineer, Developer, Programmer",
    location: "San Diego, CA",
    category: "it",
    createdAt: "2023-09-15T12:00:00Z",
  },
  {
    id: "2",
    keywords: "Cybersecurity Analyst, Security Engineer",
    location: "Remote",
    category: "cybersecurity",
    createdAt: "2023-10-20T15:30:00Z",
  },
  {
    id: "3",
    keywords: "Project Manager, Leadership",
    location: "Los Angeles, CA",
    category: "leadership",
    createdAt: "2023-11-05T09:45:00Z",
  },
];

// Map from category value to human-readable label
const categoryLabels: Record<string, string> = {
  cybersecurity: "Cybersecurity",
  logistics: "Logistics & Supply Chain",
  healthcare: "Healthcare",
  engineering: "Engineering",
  administration: "Administration",
  it: "Information Technology",
  leadership: "Leadership & Management",
  maintenance: "Maintenance & Repair",
};

const JobAlertsList: React.FC = () => {
  const [alerts, setAlerts] = useState<JobAlert[]>(placeholderAlerts);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmAlert, setDeleteConfirmAlert] = useState<JobAlert | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Format the creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle editing an alert
  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert);
    setIsEditDialogOpen(true);
  };

  // Handle deletion confirmation
  const handleDeleteConfirm = (alert: JobAlert) => {
    setDeleteConfirmAlert(alert);
    setIsDeleteDialogOpen(true);
  };

  // Delete an alert
  const deleteAlert = () => {
    if (deleteConfirmAlert) {
      setAlerts(alerts.filter(alert => alert.id !== deleteConfirmAlert.id));
      toast.success("Job alert deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeleteConfirmAlert(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Job Alerts</h2>
          <p className="text-muted-foreground">You have {alerts.length} active job alerts</p>
        </div>
        <Button onClick={() => window.location.hash = "create-alert"}>
          <Bell className="mr-2 h-4 w-4" />
          Create New Alert
        </Button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Alerts Found</h3>
          <p className="text-muted-foreground mt-2">
            You haven't created any job alerts yet. Create your first alert to get notified about new jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="overflow-hidden border-slate-200 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1 text-lg">
                      {alert.keywords.split(',')[0]}
                    </CardTitle>
                    <CardDescription>
                      Created {formatDate(alert.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {categoryLabels[alert.category] || alert.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                    <p className="line-clamp-2 text-sm">{alert.keywords}</p>
                  </div>
                  {alert.location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="line-clamp-1 text-sm">{alert.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(alert)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConfirm(alert)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Alert Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Job Alert</DialogTitle>
            <DialogDescription>
              Update your job alert settings
            </DialogDescription>
          </DialogHeader>
          {editingAlert && (
            <div className="py-4">
              {/* For simplicity, we're reusing the JobAlertForm component */}
              <JobAlertForm 
                initialData={{
                  keywords: editingAlert.keywords,
                  location: editingAlert.location,
                  category: editingAlert.category
                }}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  // In a real app, we would update the alert in the state
                  toast.success("Job alert updated successfully");
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Job Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job alert? You will no longer receive notifications for matching jobs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteAlert}>
              Delete Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobAlertsList;
