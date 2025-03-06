
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/LoadingButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { isEmptyOrWhitespace } from "@/utils/validation";
import FormErrorMessage from "./ui/form-error-message";

const jobCategories = [
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "healthcare", label: "Healthcare" },
  { value: "engineering", label: "Engineering" },
  { value: "administration", label: "Administration" },
  { value: "it", label: "Information Technology" },
  { value: "leadership", label: "Leadership & Management" },
  { value: "maintenance", label: "Maintenance & Repair" },
];

interface FormErrors {
  [key: string]: string;
}

interface JobAlertFormProps {
  initialData?: {
    keywords: string;
    location: string;
    category: string;
  };
  onSuccess?: () => void;
  className?: string;
}

const JobAlertForm = ({ initialData, onSuccess, className }: JobAlertFormProps) => {
  const [keywords, setKeywords] = useState(initialData?.keywords || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (isEmptyOrWhitespace(keywords)) {
      newErrors.keywords = "Keywords are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const alertData = {
        keywords,
        location,
        category,
        createdAt: new Date().toISOString(),
      };
      
      console.log("Job Alert Created:", alertData);
      
      if (!initialData) {
        toast.success("Job alert created successfully", {
          description: "You'll receive notifications when new matching jobs are posted."
        });
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        setKeywords("");
        setLocation("");
        setCategory("");
      }
    } catch (error) {
      console.error("Error creating job alert:", error);
      toast.error("Failed to create job alert", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto bg-white shadow-md ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">
          {initialData ? "Update Job Alert" : "Create Job Alert"}
        </CardTitle>
        <CardDescription>
          {initialData 
            ? "Modify your job alert settings" 
            : "Get notified when new jobs matching your criteria are posted."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keywords">
              Keywords <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="keywords" 
              placeholder="Job title, skills, or keywords" 
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
                if (errors.keywords) {
                  setErrors({ ...errors, keywords: "" });
                }
              }}
              className={errors.keywords ? "border-destructive" : ""}
              required
            />
            <FormErrorMessage message={errors.keywords} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="City, state, or zip code" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Job Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <LoadingButton 
          type="submit" 
          onClick={handleSubmit}
          className="w-full"
          isLoading={isSubmitting}
          loadingText={initialData ? "Updating Alert..." : "Creating Alert..."}
        >
          {initialData ? "Update Alert" : "Create Alert"}
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};

export default JobAlertForm;
