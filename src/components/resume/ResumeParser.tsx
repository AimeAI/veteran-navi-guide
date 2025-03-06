
import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  FileCheck, 
  Search, 
  Clipboard, 
  ClipboardCheck, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { parseResume } from '@/utils/resumeParser';

interface ResumeData {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  summary?: string;
}

interface FeedbackItem {
  type: 'positive' | 'suggestion' | 'warning';
  message: string;
}

const ResumeParser = () => {
  const { user, updateProfile } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [showPreFill, setShowPreFill] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      // Check if the file is a PDF or DOCX
      if (
        fileType === 'application/pdf' || 
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        setFile(selectedFile);
        setResumeData(null);
        setFeedback([]);
        setShowPreFill(false);
      } else {
        toast.error('Invalid file format', {
          description: 'Please upload a PDF or DOCX file'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      // In a real app, this would be an API call to upload the file
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Resume uploaded successfully');
      
      setIsParsing(true);
      // Simulate parsing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse the resume
      const parsedData = await parseResume(file);
      setResumeData(parsedData);
      
      // Generate feedback based on the parsed data
      const generatedFeedback = generateFeedback(parsedData);
      setFeedback(generatedFeedback);
      
      setShowPreFill(true);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume', {
        description: 'Please try again later'
      });
    } finally {
      setIsUploading(false);
      setIsParsing(false);
    }
  };

  const generateFeedback = (data: ResumeData): FeedbackItem[] => {
    const feedback: FeedbackItem[] = [];
    
    // Evaluate skills section
    if (data.skills.length >= 10) {
      feedback.push({
        type: 'positive',
        message: 'Great job listing a comprehensive set of skills!'
      });
    } else if (data.skills.length >= 5) {
      feedback.push({
        type: 'positive',
        message: 'You have a good number of skills listed.'
      });
    } else {
      feedback.push({
        type: 'suggestion',
        message: 'Consider adding more relevant skills to strengthen your resume.'
      });
    }
    
    // Evaluate experience section
    if (data.experience.length === 0) {
      feedback.push({
        type: 'warning',
        message: 'No work experience detected. Make sure to include your professional background.'
      });
    } else if (data.experience.some(exp => !exp.description || exp.description.length < 50)) {
      feedback.push({
        type: 'suggestion',
        message: 'Add more details to your work experience descriptions, focusing on achievements and responsibilities.'
      });
    } else {
      feedback.push({
        type: 'positive',
        message: 'Your work experience section is well-detailed.'
      });
    }
    
    // Evaluate education section
    if (data.education.length === 0) {
      feedback.push({
        type: 'warning',
        message: 'No education history detected. Include your educational background.'
      });
    } else {
      feedback.push({
        type: 'positive',
        message: 'Education section is properly included.'
      });
    }
    
    // Check for military background
    const hasMilitaryKeywords = 
      data.experience.some(exp => 
        exp.company.toLowerCase().includes('military') || 
        exp.company.toLowerCase().includes('army') || 
        exp.company.toLowerCase().includes('navy') || 
        exp.company.toLowerCase().includes('air force') || 
        exp.company.toLowerCase().includes('marine') ||
        exp.title.toLowerCase().includes('veteran')
      );
    
    if (hasMilitaryKeywords) {
      feedback.push({
        type: 'positive',
        message: 'Military experience is clearly highlighted, which is excellent for veteran-focused opportunities.'
      });
    } else {
      feedback.push({
        type: 'suggestion',
        message: 'Consider highlighting your military background more prominently for veteran-friendly employers.'
      });
    }
    
    return feedback;
  };

  const handlePreFill = () => {
    if (!resumeData || !user) return;
    
    const formattedMilitaryBranch = resumeData.experience
      .find(exp => 
        exp.company.toLowerCase().includes('military') || 
        exp.company.toLowerCase().includes('army') || 
        exp.company.toLowerCase().includes('navy') || 
        exp.company.toLowerCase().includes('air force') || 
        exp.company.toLowerCase().includes('marine')
      )?.company || user.militaryBranch;
    
    updateProfile({
      bio: resumeData.summary || user.bio,
      militaryBranch: formattedMilitaryBranch
    });
    
    toast.success('Profile updated with resume data');
    setShowPreFill(false);
  };

  const renderFeedbackBadge = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'positive':
        return <Badge variant="success">Strength</Badge>;
      case 'suggestion':
        return <Badge variant="info">Suggestion</Badge>;
      case 'warning':
        return <Badge variant="warning">Improvement Needed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Resume Parsing and Analysis
        </CardTitle>
        <CardDescription>
          Upload your resume to get personalized feedback and automatically update your profile
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!resumeData ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="resume-upload">Upload Resume</Label>
              <Input 
                id="resume-upload" 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleFileChange}
                disabled={isUploading || isParsing}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX (Max 5MB)
              </p>
            </div>
            
            {file && (
              <div className="bg-slate-50 p-4 rounded-md flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={isUploading || isParsing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading || isParsing}
                className="w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-bounce" />
                    Uploading...
                  </>
                ) : isParsing ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Resume successfully analyzed</h3>
                <p className="text-xs text-muted-foreground">
                  {file?.name} • {(file?.size || 0) / 1024} KB
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Resume Feedback</h3>
              <div className="space-y-3">
                {feedback.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md ${
                      item.type === 'positive' 
                        ? 'bg-green-50 border border-green-100' 
                        : item.type === 'suggestion' 
                          ? 'bg-blue-50 border border-blue-100' 
                          : 'bg-yellow-50 border border-yellow-100'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-2">
                        {renderFeedbackBadge(item.type)}
                      </div>
                      <p className="text-sm">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Extracted Information</h3>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Experience</h4>
                <div className="space-y-2">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{exp.title}</div>
                      <div className="text-muted-foreground">
                        {exp.company} • {exp.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Education</h4>
                <div className="space-y-2">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-muted-foreground">
                        {edu.institution} • {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {showPreFill && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setFile(null);
              setResumeData(null);
              setFeedback([]);
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Discard
          </Button>
          
          <Button onClick={handlePreFill}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Update Profile with Resume Data
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResumeParser;
