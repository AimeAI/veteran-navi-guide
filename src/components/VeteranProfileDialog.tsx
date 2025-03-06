
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Medal, Briefcase, MapPin, Phone, Mail, FileText, Calendar, Star, Award, ChevronRight } from 'lucide-react';

interface VeteranProfileProps {
  isOpen: boolean;
  onClose: () => void;
  veteran: {
    id: string;
    name: string;
    photo?: string;
    rank: string;
    serviceYears: string;
    mosCode: string;
    mosTitle: string;
    branch: string;
    skills: string[];
    clearanceLevel?: string;
    location: string;
    summary: string;
    available: boolean;
    email?: string;
    phone?: string;
    education?: Array<{
      institution: string;
      degree: string;
      dates: string;
    }>;
    experience?: Array<{
      role: string;
      organization: string;
      dates: string;
      description: string;
    }>;
    achievements?: string[];
  };
}

const VeteranProfileDialog: React.FC<VeteranProfileProps> = ({ 
  isOpen, 
  onClose, 
  veteran 
}) => {
  if (!veteran) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            {veteran.name}
            {veteran.available ? (
              <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                Available Now
              </Badge>
            ) : (
              <Badge className="ml-2 bg-gray-100 text-gray-800 border-gray-200">
                Not Available
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {veteran.rank}, {veteran.branch}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 pr-4">
            {/* Left column - Basic info */}
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 text-center">
                    {veteran.photo ? (
                      <img 
                        src={veteran.photo} 
                        alt={veteran.name} 
                        className="w-32 h-32 rounded-full mx-auto mb-2 object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-2 bg-gray-200 flex items-center justify-center border-2 border-primary/20">
                        <Shield className="h-16 w-16 text-gray-400" aria-hidden="true" />
                      </div>
                    )}
                    <h3 className="font-bold text-lg text-gray-900">{veteran.name}</h3>
                    <p className="text-gray-600">{veteran.rank}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                      <span className="text-gray-700">{veteran.mosTitle} ({veteran.mosCode})</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                      <span className="text-gray-700">{veteran.branch}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Medal className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                      <span className="text-gray-700">Service: {veteran.serviceYears}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                      <span className="text-gray-700">{veteran.location}</span>
                    </div>
                    {veteran.clearanceLevel && (
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                        <span className="text-gray-700">Clearance: {veteran.clearanceLevel}</span>
                      </div>
                    )}
                    {veteran.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                        <span className="text-gray-700">{veteran.email}</span>
                      </div>
                    )}
                    {veteran.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                        <span className="text-gray-700">{veteran.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" aria-hidden="true" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {veteran.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Experience, Education, etc. */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3">Professional Summary</h3>
                  <p className="text-gray-700 whitespace-pre-line">{veteran.summary}</p>
                </CardContent>
              </Card>

              {veteran.experience && veteran.experience.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-primary" aria-hidden="true" />
                      Military Experience
                    </h3>
                    <div className="space-y-4">
                      {veteran.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-primary/30 pl-4 pb-2">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900">{exp.role}</h4>
                            <span className="text-sm text-gray-500">{exp.dates}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{exp.organization}</p>
                          <p className="text-sm text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {veteran.education && veteran.education.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" aria-hidden="true" />
                      Education
                    </h3>
                    <div className="space-y-3">
                      {veteran.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary/30 pl-4 pb-2">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <span className="text-sm text-gray-500">{edu.dates}</span>
                          </div>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {veteran.achievements && veteran.achievements.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Medal className="h-5 w-5 mr-2 text-primary" aria-hidden="true" />
                      Achievements
                    </h3>
                    <ul className="space-y-2">
                      {veteran.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-2 text-primary mt-1" aria-hidden="true" />
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 sm:justify-between flex flex-col-reverse sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button>Download Resume</Button>
            <Button>Contact Veteran</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VeteranProfileDialog;
