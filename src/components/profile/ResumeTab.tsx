
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ResumeTab = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      console.log("File name:", selectedFile.name);
      console.log("File size:", selectedFile.size, "bytes");
      console.log("File type:", selectedFile.type);
      toast.success("Resume uploaded successfully!");
    } else {
      toast.error("Please select a file first!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume/CV Upload</CardTitle>
        <CardDescription>
          Upload your resume or CV to make it easier for employers to find you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="resume-upload">Upload Resume/CV</Label>
          <Input 
            id="resume-upload" 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
        
        {selectedFile && (
          <div className="bg-slate-50 p-3 rounded-md">
            <p className="text-sm font-medium">Selected file:</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              {selectedFile.name} <span className="text-xs">({Math.round(selectedFile.size / 1024)} KB)</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload Resume
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeTab;
