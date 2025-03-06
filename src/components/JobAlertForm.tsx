import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useJobAlerts } from "@/context/JobAlertContext";
import { searchJobs } from "@/data/jobs";

interface JobAlertFormProps {
  onSuccess?: () => void;
}

const JobAlertForm: React.FC<JobAlertFormProps> = ({ onSuccess }) => {
  const { addJobAlert } = useJobAlerts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [jobMatchPreview, setJobMatchPreview] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    keywords: [],
    locations: [],
    jobType: "",
    frequency: "daily"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "" && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleAddLocation = () => {
    if (locationInput.trim() !== "" && !formData.locations.includes(locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, locationInput.trim()]
      }));
      setLocationInput("");
    }
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(location => location !== locationToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error("Please provide a title for your job alert");
      }
      
      if (formData.keywords.length === 0 && formData.locations.length === 0 && !formData.jobType) {
        throw new Error("Please provide at least one search criteria");
      }
      
      // In a real app, this would save to a database via API
      console.log("Creating job alert:", formData);
      
      // Simulate fetch matching jobs
      const matchingJobs = searchJobs({
        keywords: formData.keywords,
        locations: formData.locations,
        jobType: formData.jobType,
        mosCodes: [],
        clearanceLevel: [],
        remote: false
      });
      
      const jobMatches = matchingJobs || [];
      
      console.log(`Found ${jobMatches.length} jobs matching your new alert criteria.`);
      
      if (jobMatches.length > 0) {
        setJobMatchPreview(jobMatches.slice(0, 3));
      }
      
      setTimeout(() => {
        // Simulate API call
        console.log("Job alert created successfully");
        
        // Update context with the new alert
        addJobAlert({
          id: `alert-${Date.now()}`,
          title: formData.title,
          criteria: {
            keywords: formData.keywords,
            locations: formData.locations,
            jobType: formData.jobType
          },
          frequency: formData.frequency,
          createdAt: new Date().toISOString(),
          lastSent: null,
          matchCount: jobMatches.length
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Reset form
          setFormData({
            title: "",
            keywords: [],
            locations: [],
            jobType: "",
            frequency: "daily"
          });
          setKeywordInput("");
          setLocationInput("");
          setJobMatchPreview([]);
          setSuccessMessage("Job alert created successfully!");
        }
      }, 1000);
    } catch (error) {
      console.error("Error creating job alert:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Alert Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Software Engineer Jobs in Ottawa"
          required
        />
      </div>

      <div>
        <Label>Keywords</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add keyword"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <Button type="button" onClick={handleAddKeyword}>
            Add
          </Button>
        </div>
        <div className="mt-2">
          {formData.keywords.map((keyword) => (
            <Badge key={keyword} className="mr-1 cursor-pointer" onClick={() => handleRemoveKeyword(keyword)}>
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Locations</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
          <Button type="button" onClick={handleAddLocation}>
            Add
          </Button>
        </div>
        <div className="mt-2">
          {formData.locations.map((location) => (
            <Badge key={location} className="mr-1 cursor-pointer" onClick={() => handleRemoveLocation(location)}>
              {location}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="jobType">Job Type</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a job type" defaultValue={formData.jobType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="full-time">Full-Time</SelectItem>
            <SelectItem value="part-time">Part-Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="temporary">Temporary</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select frequency" defaultValue={formData.frequency} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {jobMatchPreview.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Job Match Preview</h3>
          <p className="text-sm text-muted-foreground">
            Here's a preview of jobs matching your criteria:
          </p>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <div className="p-4 space-y-3">
              {jobMatchPreview.map((job) => (
                <div key={job.id} className="border rounded-md p-3">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.company} - {job.location}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500">
          Error: {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="text-green-500">
          {successMessage}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating Alert..." : "Create Job Alert"}
      </Button>
    </form>
  );
};

export default JobAlertForm;
