
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, MessageSquare, BookOpen, DollarSign, List, Calendar, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceItem {
  title: string;
  description: string;
  link: string;
  official?: boolean;
  military?: boolean;
}

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  resources: ResourceItem[];
}

const InterviewPreparation: React.FC = () => {
  // Define categories with resources
  const resourceCategories: ResourceCategory[] = [
    {
      id: 'common-questions',
      title: 'Common Interview Questions',
      description: 'Prepare for frequently asked questions in civilian job interviews',
      icon: <MessageSquare className="h-5 w-5" />,
      resources: [
        {
          title: 'Military-to-Civilian Question Guide',
          description: 'Common questions asked to veterans and how to answer them effectively.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/interview-tips',
          official: true,
          military: true
        },
        {
          title: 'Behavioral Interview Questions',
          description: 'STAR method responses to behavioral questions using military experience.',
          link: 'https://www.canada.ca/en/services/jobs/opportunities/government/interview-preparation.html',
          official: true
        },
        {
          title: 'Industry-Specific Questions',
          description: 'Interview questions tailored to industries popular among veterans.',
          link: 'https://www.jobbank.gc.ca/findajob/resources/prepare-interview',
          official: true
        }
      ]
    },
    {
      id: 'interview-techniques',
      title: 'Interview Techniques',
      description: 'Strategies and methods to excel in different interview formats',
      icon: <CheckCircle className="h-5 w-5" />,
      resources: [
        {
          title: 'STAR Method Tutorial',
          description: 'Using the Situation-Task-Action-Result method to structure your answers.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/interview-tips/star-technique',
          official: true,
          military: true
        },
        {
          title: 'Virtual Interview Preparation',
          description: 'Tips for succeeding in online and video interviews.',
          link: 'https://www.jobbank.gc.ca/findajob/resources/prepare-interview/virtual',
          official: true
        },
        {
          title: 'Panel Interview Strategies',
          description: 'How to handle interviews with multiple interviewers effectively.',
          link: 'https://www.canada.ca/en/services/jobs/opportunities/government/interview-types.html',
          official: true
        }
      ]
    },
    {
      id: 'practice-resources',
      title: 'Practice Resources',
      description: 'Tools and services to practice and refine your interview skills',
      icon: <Users className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Mock Interview Service',
          description: 'Free mock interview sessions with career counselors for veterans.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/career-transition-services',
          official: true,
          military: true
        },
        {
          title: 'Interview Simulation Tool',
          description: 'Online platform to practice answering common interview questions.',
          link: 'https://www.jobbank.gc.ca/career-planning/skills-assessment',
          official: true
        },
        {
          title: 'Peer Practice Network',
          description: 'Connect with other veterans to conduct practice interviews.',
          link: 'https://canadacompany.ca/canadacompany/met/',
          official: false,
          military: true
        }
      ]
    },
    {
      id: 'technical-interviews',
      title: 'Technical Interviews',
      description: 'Preparation resources for skill demonstrations and technical assessments',
      icon: <BookOpen className="h-5 w-5" />,
      resources: [
        {
          title: 'Technical Skills Translation Guide',
          description: 'How to demonstrate military technical skills in civilian interviews.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/skill-translation',
          official: true,
          military: true
        },
        {
          title: 'Industry Certification Guides',
          description: 'Resources for technical certifications valued in civilian industries.',
          link: 'https://www.canada.ca/en/department-national-defence/services/benefits-military/education-training/reimbursement.html',
          official: true,
          military: true
        },
        {
          title: 'Skills Assessment Tools',
          description: 'Self-assessment tools to identify and articulate technical skills.',
          link: 'https://www.jobbank.gc.ca/career-planning/skills-assessment',
          official: true
        }
      ]
    },
    {
      id: 'salary-negotiation',
      title: 'Salary Negotiation',
      description: 'Resources for navigating compensation discussions and negotiations',
      icon: <DollarSign className="h-5 w-5" />,
      resources: [
        {
          title: 'Military Benefits Calculator',
          description: 'Tool to calculate the civilian equivalent of your military compensation package.',
          link: 'https://www.veterans.gc.ca/eng/financial-support/financial-planning',
          official: true,
          military: true
        },
        {
          title: 'Salary Research Guide',
          description: 'How to research appropriate salary ranges for civilian positions.',
          link: 'https://www.jobbank.gc.ca/trend-analysis/search-wages',
          official: true
        },
        {
          title: 'Negotiation Techniques',
          description: 'Effective strategies for negotiating salary and benefits in civilian sectors.',
          link: 'https://www.canada.ca/en/services/jobs/opportunities/government/compensation.html',
          official: true
        }
      ]
    },
    {
      id: 'follow-up',
      title: 'Interview Follow-Up',
      description: 'Best practices for post-interview communication and next steps',
      icon: <Calendar className="h-5 w-5" />,
      resources: [
        {
          title: 'Thank You Letter Templates',
          description: 'Professional templates for post-interview thank you notes.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/interview-tips/follow-up',
          official: true,
          military: true
        },
        {
          title: 'Follow-Up Timeline Guide',
          description: 'When and how to follow up after different types of interviews.',
          link: 'https://www.jobbank.gc.ca/findajob/resources/prepare-interview/after',
          official: true
        },
        {
          title: 'Second Interview Preparation',
          description: 'How to prepare for subsequent interviews in the hiring process.',
          link: 'https://www.canada.ca/en/services/jobs/opportunities/government/interview-preparation-second.html',
          official: true
        }
      ]
    },
    {
      id: 'special-considerations',
      title: 'Special Considerations for Veterans',
      description: 'Guidance on addressing military service and related topics in interviews',
      icon: <List className="h-5 w-5" />,
      resources: [
        {
          title: 'Addressing Service-Related Gaps',
          description: 'How to explain service-related resume gaps effectively in interviews.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/resume-and-job-search/gaps',
          official: true,
          military: true
        },
        {
          title: 'Disability Accommodation Guide',
          description: 'Information on requesting accommodations during the interview process.',
          link: 'https://www.veterans.gc.ca/eng/health-support/physical-health-and-wellness/accommodation',
          official: true,
          military: true
        },
        {
          title: 'Discussing Military Experience',
          description: 'Guide to discussing military service appropriately in civilian interviews.',
          link: 'https://canadacompany.ca/canadacompany/resources/interview-tips/',
          official: false,
          military: true
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Interview Preparation Resources</h1>
          <p className="text-gray-600 text-lg">
            Resources to help Canadian Armed Forces veterans excel in civilian job interviews
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
                        <div className="flex gap-1">
                          {resource.official && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Official
                            </span>
                          )}
                          {resource.military && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Military
                            </span>
                          )}
                        </div>
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-xl font-medium mb-3">Interview Coaching Services</h3>
            <p className="mb-4">
              Veterans Affairs Canada offers personalized interview coaching for Canadian Armed Forces veterans. A career counselor will conduct mock interviews and provide feedback.
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

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
            <h3 className="text-xl font-medium mb-3">Interview Preparation Checklist</h3>
            <ul className="space-y-2 list-disc pl-5 text-gray-700">
              <li>Research the company and position thoroughly</li>
              <li>Prepare examples that translate military experience to civilian value</li>
              <li>Practice answering common questions using the STAR method</li>
              <li>Prepare appropriate professional attire</li>
              <li>Plan your route to arrive 15 minutes early</li>
              <li>Bring extra copies of your resume and reference list</li>
              <li>Prepare thoughtful questions to ask the interviewer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparation;
