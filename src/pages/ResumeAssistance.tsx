
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, PencilLine, BookOpen, List, FileSearch } from 'lucide-react';
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

const ResumeAssistance: React.FC = () => {
  // Define categories with resources
  const resourceCategories: ResourceCategory[] = [
    {
      id: 'resume-templates',
      title: 'Resume Templates',
      description: 'Professional resume templates designed for military veterans transitioning to civilian careers',
      icon: <FileText className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Canada Resume Templates',
          description: 'Official resume templates designed specifically for Canadian veterans.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/resume-and-job-search',
          official: true,
          military: true
        },
        {
          title: 'Canada Job Bank Resume Builder',
          description: 'Free government tool to create professional resumes with military skills translation.',
          link: 'https://www.jobbank.gc.ca/findajob/resume-builder',
          official: true
        },
        {
          title: 'Canadian Forces Transition Group Templates',
          description: 'Resume templates specifically designed for CAF members transitioning to civilian work.',
          link: 'https://www.canada.ca/en/department-national-defence/services/benefits-military/transition.html',
          official: true,
          military: true
        }
      ]
    },
    {
      id: 'military-translation',
      title: 'Military-to-Civilian Translation',
      description: 'Resources to help translate military experience, skills, and terminology into civilian language',
      icon: <PencilLine className="h-5 w-5" />,
      resources: [
        {
          title: 'Military Skills Translator Tool',
          description: 'Convert military occupation codes and experience into civilian equivalents.',
          link: 'https://www.jobbank.gc.ca/military-equivalence',
          official: true,
          military: true
        },
        {
          title: 'Canada Company Military to Civilian Translation Guide',
          description: 'Comprehensive guide for translating military achievements to civilian terms.',
          link: 'https://canadacompany.ca/canadacompany/resources/',
          military: true
        },
        {
          title: 'Military to Civilian Occupation Matching',
          description: 'Database matching military occupations to civilian job opportunities.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/job-seeking-skills',
          official: true,
          military: true
        }
      ]
    },
    {
      id: 'action-verbs',
      title: 'Action Verbs & Keywords',
      description: 'Powerful action verbs and industry keywords to strengthen your resume',
      icon: <List className="h-5 w-5" />,
      resources: [
        {
          title: 'Military Leadership Verbs Guide',
          description: 'Action verbs that effectively communicate leadership skills gained in military service.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/resume-and-job-search/action-words',
          official: true,
          military: true
        },
        {
          title: 'Industry-Specific Keywords Database',
          description: 'Searchable database of keywords by industry sector for resume optimization.',
          link: 'https://www.jobbank.gc.ca/career-planning/search-job-description',
          official: true
        },
        {
          title: 'ATS-Friendly Resume Keywords',
          description: 'Guide to including keywords that will pass through Applicant Tracking Systems.',
          link: 'https://www.linkedin.com/pulse/20-powerful-action-verbs-your-resume-standout-melissa-darnell/',
          official: false
        }
      ]
    },
    {
      id: 'resume-formats',
      title: 'Resume Formats & Styles',
      description: 'Different resume formats to highlight your unique skills and experience',
      icon: <FileSearch className="h-5 w-5" />,
      resources: [
        {
          title: 'Chronological vs. Functional vs. Combination',
          description: 'Guide on choosing the right resume format for your career transition.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/resume-and-job-search/resume-styles',
          official: true,
          military: true
        },
        {
          title: 'Resume Format Selection Tool',
          description: 'Interactive tool to help you select the best resume format based on your experience.',
          link: 'https://www.jobbank.gc.ca/findajob/resume-builder/advice',
          official: true
        },
        {
          title: 'ATS-Compatible Resume Formatting',
          description: 'Guidelines for creating resumes that pass through Applicant Tracking Systems.',
          link: 'https://www.monster.ca/career-advice/article/how-does-an-ats-work',
          official: false
        }
      ]
    },
    {
      id: 'industry-examples',
      title: 'Industry-Specific Examples',
      description: 'Resume examples tailored to specific civilian industries popular among veterans',
      icon: <BookOpen className="h-5 w-5" />,
      resources: [
        {
          title: 'Security & Law Enforcement',
          description: 'Resume examples for veterans transitioning to security and law enforcement roles.',
          link: 'https://www.rcmp-grc.gc.ca/en/careers/veteran-recruitment',
          official: true,
          military: true
        },
        {
          title: 'Logistics & Operations Management',
          description: 'Examples showing how to highlight logistics and operations experience.',
          link: 'https://www.jobbank.gc.ca/marketreport/occupation/22509/ca',
          official: true
        },
        {
          title: 'Leadership & Project Management',
          description: 'Resume templates emphasizing leadership skills for management positions.',
          link: 'https://www.pmi.org/learning/library/military-civilian-project-management-9661',
          official: false
        },
        {
          title: 'Technical & Engineering',
          description: 'Examples for veterans with technical skills transitioning to engineering roles.',
          link: 'https://engineerscanada.ca/become-an-engineer/military-and-veterans',
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Writing Assistance</h1>
          <p className="text-gray-600 text-lg">
            Resources to help Canadian Armed Forces veterans create effective civilian resumes
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
            <h3 className="text-xl font-medium mb-3">Resume Review Service</h3>
            <p className="mb-4">
              Veterans Affairs Canada offers free resume review services for CAF veterans. A career counselor will provide feedback and suggestions for improvement.
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
            <h3 className="text-xl font-medium mb-3">Resume Writing Tips</h3>
            <ul className="space-y-2 list-disc pl-5 text-gray-700">
              <li>Translate military acronyms and jargon into civilian terms</li>
              <li>Quantify your achievements with numbers when possible</li>
              <li>Focus on transferable skills like leadership and problem-solving</li>
              <li>Tailor your resume for each job application</li>
              <li>Keep your resume concise (1-2 pages maximum)</li>
              <li>Include relevant civilian certifications and training</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAssistance;
