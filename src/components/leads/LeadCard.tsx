
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ExternalLink, Pencil, Trash2, Check, ClipboardCopy } from "lucide-react";
import { EmployerLead, LEAD_STATUS_OPTIONS } from "@/types/leads";
import { deleteLead, updateLead } from "@/services/leadService";
import { Badge } from "@/components/ui/badge";
import LeadEditForm from "./LeadEditForm";

interface LeadCardProps {
  lead: EmployerLead;
  onLeadUpdated: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onLeadUpdated }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get badge color based on lead status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'blue';
      case 'Contacted':
        return 'yellow';
      case 'Meeting Scheduled':
        return 'orange';
      case 'Onboarded':
        return 'green';
      case 'Rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  // Quick status change handler
  const handleQuickStatusChange = async (newStatus: string) => {
    const result = await updateLead(lead.id, { 
      lead_status: newStatus as any
    });
    
    if (result) {
      onLeadUpdated();
    }
  };
  
  // Handle lead deletion
  const handleDelete = async () => {
    const success = await deleteLead(lead.id);
    if (success) {
      onLeadUpdated();
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Copy website URL to clipboard
  const copyWebsiteUrl = () => {
    navigator.clipboard.writeText(lead.website_url)
      .then(() => toast.success("Website URL copied to clipboard"))
      .catch(() => toast.error("Failed to copy URL"));
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{lead.company_name}</CardTitle>
          <Badge variant={getStatusColor(lead.lead_status) as any}>
            {lead.lead_status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Website:</span>
            <div className="flex items-center">
              <a 
                href={lead.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center ml-1"
              >
                Visit Site <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <Button variant="ghost" size="sm" className="p-1 h-6" onClick={copyWebsiteUrl}>
                <ClipboardCopy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {lead.linkedin_url && (
            <div className="flex items-center justify-between">
              <span className="font-medium">LinkedIn:</span>
              <a 
                href={lead.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                View Profile <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          )}
          
          {lead.notes && (
            <div>
              <span className="font-medium">Notes:</span>
              <p className="text-gray-600 mt-1 whitespace-pre-line">{lead.notes}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Added:</span>
            <span>{formatDate(lead.date_added)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col pt-2 space-y-3">
        {/* Quick status update buttons */}
        <div className="flex flex-wrap gap-1 w-full justify-center">
          {LEAD_STATUS_OPTIONS.filter(status => status !== lead.lead_status).map(status => (
            <Button 
              key={status}
              variant="outline" 
              size="sm"
              className="text-xs py-1 h-7"
              onClick={() => handleQuickStatusChange(status)}
            >
              <Check className="w-3 h-3 mr-1" /> {status}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between w-full">
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Lead: {lead.company_name}</DialogTitle>
              </DialogHeader>
              <LeadEditForm 
                lead={lead} 
                onSave={() => {
                  setIsEditDialogOpen(false);
                  onLeadUpdated();
                }}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Lead</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>Are you sure you want to delete <strong>{lead.company_name}</strong>?</p>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
