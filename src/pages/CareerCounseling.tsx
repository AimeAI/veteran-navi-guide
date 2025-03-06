
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, Users, Calendar, BookOpen, Award, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceItem {
  title: string;
  description: string;
  link: string;
  official?: boolean;
}

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  resources: ResourceItem[];
}

const CareerCounseling: React.FC = () => {
  // Define categories with resources
  const resourceCategories: ResourceCategory[] = [
    {
      id: 'transition-programs',
      title: 'Transition Programs',
      description: 'Official programs designed to help CAF members transition to civilian careers',
      icon: <Briefcase className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Canada - Career Transition Services',
          description: 'Career counseling, job-search training, and help with resume writing.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/career-transition-services',
          official: true
        },
        {
          title: 'CAF Transition Group',
          description: 'Personalized support and resources for members transitioning to civilian life.',
          link: 'https://www.canada.ca/en/department-national-defence/services/benefits-military/transition.html',
          official: true
        },
        {
          title: 'Military Civilian Training Accreditation Program',
          description: 'Information on having military training recognized in civilian workplaces.',
          link: 'https://www.canada.ca/en/department-national-defence/corporate/reports-publications/transition-guide/qualified-ready.html',
          official: true
        }
      ]
    },
    {
      id: 'resume-help',
      title: 'Resume & CV Assistance',
      description: 'Resources to help translate military experience to civilian terms',
      icon: <FileText className="h-5 w-5" />,
      resources: [
        {
          title: 'VAC Resume Writing Guide',
          description: 'Specialized guide for military members to create effective civilian resumes.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/resume-and-job-search',
          official: true
        },
        {
          title: 'Canadian Job Bank - Resume Builder',
          description: 'Free tool to create professional resumes with military skills translation.',
          link: 'https://www.jobbank.gc.ca/findajob/resume-builder',
          official: true
        },
        {
          title: 'Canada Company Military Employment Transition',
          description: 'Resume support specifically for military to civilian transition.',
          link: 'https://canadacompany.ca/canadacompany/met/',
          official: true
        }
      ]
    },
    {
      id: 'interview-tips',
      title: 'Interview Preparation',
      description: 'Guidance for successful job interviews in the civilian sector',
      icon: <Calendar className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Interview Preparation Guide',
          description: 'Tips for communicating military experience effectively in interviews.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/interview-tips',
          official: true
        },
        {
          title: 'Skills for Success - Interview Skills',
          description: 'Government of Canada resources for developing interview skills.',
          link: 'https://www.canada.ca/en/services/jobs/training/initiatives/skills-success.html',
          official: true
        },
        {
          title: 'Helmets to Hardhats Interview Tips',
          description: 'Industry-specific interview guidance for construction and related trades.',
          link: 'https://helmetstohardhats.ca/en/job-seekers/resources/',
          official: true
        }
      ]
    },
    {
      id: 'networking',
      title: 'Networking Opportunities',
      description: 'Connect with employers and fellow veterans',
      icon: <Users className="h-5 w-5" />,
      resources: [
        {
          title: 'Military Employment Transition Sponsorship Program',
          description: 'Connects transitioning CAF members with corporate mentors.',
          link: 'https://canadacompany.ca/canadacompany/met/',
          official: true
        },
        {
          title: 'Veterans Business Network',
          description: 'Networking organization supporting veteran entrepreneurs and business professionals.',
          link: 'https://thevbnetwork.ca/',
          official: false
        },
        {
          title: 'Treble Victor Group',
          description: 'Network of ex-military business leaders helping veterans transition to business careers.',
          link: 'https://www.treblevictor.org/',
          official: false
        }
      ]
    },
    {
      id: 'education',
      title: 'Education & Training',
      description: 'Information on education benefits and training programs',
      icon: <BookOpen className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Education and Training Benefit',
          description: 'Financial support for post-secondary education and training.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/back-to-school/education-training-benefit',
          official: true
        },
        {
          title: 'Vocational Rehabilitation Program',
          description: 'Training support for veterans with service-related injuries/illnesses.',
          link: 'https://www.veterans.gc.ca/eng/health-support/physical-health-and-wellness/rehabilitation-services',
          official: true
        },
        {
          title: 'Provincial Military Credits',
          description: 'Information on military training credits recognized by provincial institutions.',
          link: 'https://www.canada.ca/en/department-national-defence/corporate/reports-publications/transition-guide/chapter-3-education.html',
          official: true
        }
      ]
    },
    {
      id: 'specialized-services',
      title: 'Specialized Career Services',
      description: 'Industry-specific programs and services',
      icon: <Award className="h-5 w-5" />,
      resources: [
        {
          title: 'Helmets to Hardhats Canada',
          description: 'Connects CAF members with career opportunities in construction trades.',
          link: 'https://helmetstohardhats.ca/',
          official: false
        },
        {
          title: 'Veterans in Tech',
          description: 'Program connecting veterans with careers in technology sectors.',
          link: 'https://www.withyouwithme.com/military-veterans',
          official: false
        },
        {
          title: 'Veterans Affairs Hiring Programs',
          description: 'Information on federal hiring programs for veterans.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/government-jobs',
          official: true
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Career Counseling Resources</h1>
          <p className="text-gray-600 text-lg">
            Resources to help Canadian Armed Forces veterans transition to civilian careers
          </p>
        </div>

        <div className="grid gap-8 mb-16">
          {resourceCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-semibold">{category.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{category.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {category.resources.map((resource, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">{resource.title}</CardTitle>
                        {resource.official && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Official
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">{resource.description}</CardDescription>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline font-medium text-sm"
                      >
                        Visit Resource <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Add separator after each category except the last one */}
              {resourceCategories.indexOf(category) < resourceCategories.length - 1 && (
                <Separator className="mt-8" />
              )}
            </section>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-xl font-medium mb-3">Need Personal Assistance?</h3>
          <p className="mb-4">
            Veterans Affairs Canada offers one-on-one career counseling services. You can contact them directly for personalized support.
          </p>
          <div className="grid gap-2">
            <a 
              href="tel:1-866-522-2122" 
              className="inline-flex items-center text-blue-700 hover:underline"
            >
              <span className="mr-2">☎️</span> 1-866-522-2122 (toll-free)
            </a>
            <a 
              href="mailto:vac.information.acc@canada.ca" 
              className="inline-flex items-center text-blue-700 hover:underline"
            >
              <span className="mr-2">✉️</span> vac.information.acc@canada.ca
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCounseling;
