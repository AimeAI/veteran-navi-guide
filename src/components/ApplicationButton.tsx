
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useApplications } from '@/hooks/useApplications';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

interface ApplicationButtonProps {
  jobId: string;
  jobTitle: string;
}

const ApplicationButton: React.FC<ApplicationButtonProps> = ({ jobId, jobTitle }) => {
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { applyForJob } = useApplications();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleApply = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const applicationId = await applyForJob(jobId, {
      coverLetter,
      resumeUrl
    });
    
    setIsSubmitting(false);
    
    if (applicationId) {
      setOpen(false);
      setCoverLetter('');
      setResumeUrl('');
    }
  };

  // For demo purposes, simplified file upload by just using a URL input
  // In a real app, implement proper file upload to Supabase storage
  
  return (
    <>
      <Button 
        onClick={handleApply} 
        className="w-full sm:w-auto md:w-full flex items-center gap-2"
      >
        <Briefcase className="h-4 w-4" />
        Apply Now
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {jobTitle}</DialogTitle>
            <DialogDescription>
              Submit your application for this position. Tell us why you're a great fit based on your military experience.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="coverLetter" className="text-sm font-medium">
                Cover Letter
              </label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position and how your military experience is relevant..."
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="resumeUrl" className="text-sm font-medium">
                Resume URL
              </label>
              <div className="flex gap-2">
                <input
                  id="resumeUrl"
                  type="text"
                  placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
                <Button variant="outline" size="icon" type="button">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                In a full implementation, we would provide direct file upload capability
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationButton;
