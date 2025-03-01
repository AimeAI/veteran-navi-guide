import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpCircle, Briefcase, GraduationCap, PlusCircle, Trash2, X } from "lucide-react";
import JobAlertForm from "@/components/JobAlertForm";

const UserProfile = () => {
  const [profileCompletion, setProfileCompletion] = useState(60);
  const [skills, setSkills] = useState(["JavaScript", "React", "Node.js"]);
  const [education, setEducation] = useState([
    { id: 1, institution: "University of Code", degree: "BSc in Computer Science", year: "2018-2022" },
  ]);
  const [experience, setExperience] = useState([
    { id: 1, company: "Tech Solutions Inc.", position: "Frontend Developer", duration: "2022-Present" },
  ]);

  const addSkill = () => {
    setSkills([...skills, "New Skill"]);
  };

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now(), institution: "New Institution", degree: "New Degree", year: "Year" }]);
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter((item) => item.id !== id));
  };

  const addExperience = () => {
    setExperience([...experience, { id: Date.now(), company: "New Company", position: "New Position", duration: "Duration" }]);
  };

  const removeExperience = (id: number) => {
    setExperience(experience.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <p>This is your profile information. You can edit it here.</p>
                </TabsContent>
                <TabsContent value="settings">
                  <p>Here you can change your settings.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Skills</h2>
                <Button variant="outline" size="sm" onClick={addSkill}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                  <Button variant="ghost" size="icon" className="ml-2 -mr-1" onClick={() => removeSkill(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Education</h2>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {education.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{item.institution}</h3>
                    <p className="text-sm text-muted-foreground">{item.degree}</p>
                    <p className="text-sm text-muted-foreground">{item.year}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Experience</h2>
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {experience.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{item.company}</h3>
                    <p className="text-sm text-muted-foreground">{item.position}</p>
                    <p className="text-sm text-muted-foreground">{item.duration}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeExperience(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Profile Sidebar */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Completion</h2>
              <p className="text-sm text-muted-foreground">Complete your profile to get better job recommendations.</p>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompletion} />
              <p className="text-sm text-muted-foreground mt-2">{profileCompletion}% completed</p>
              <Button variant="secondary" className="mt-4 w-full">
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          {/* Job Alerts Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Job Alerts</h2>
            <JobAlertForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
