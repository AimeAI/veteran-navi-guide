
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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

const JobAlertForm = () => {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create alert object with form data
    const alertData = {
      keywords,
      location,
      category,
      createdAt: new Date().toISOString(),
    };
    
    // Log the alert data to console (for now)
    console.log("Job Alert Created:", alertData);
    
    // Show success toast
    toast.success("Job alert created successfully", {
      description: "You'll receive notifications when new matching jobs are posted."
    });
    
    // Reset form
    setKeywords("");
    setLocation("");
    setCategory("");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">Job Alerts</CardTitle>
        <CardDescription>
          Get notified when new jobs matching your criteria are posted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input 
              id="keywords" 
              placeholder="Job title, skills, or keywords" 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
            />
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
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full"
        >
          Create Alert
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobAlertForm;
