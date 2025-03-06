
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, GraduationCap, Heart, Home, Briefcase, Shield, DollarSign, BookOpen } from 'lucide-react';
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

const MilitaryTransitionResources: React.FC = () => {
  // Define categories with resources
  const resourceCategories: ResourceCategory[] = [
    {
      id: 'benefits',
      title: 'Benefits & Services',
      description: 'Government programs and benefits available to transitioning veterans',
      icon: <Shield className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Canada - My VAC Account',
          description: 'Online portal to access all VAC services and benefits applications.',
          link: 'https://www.veterans.gc.ca/eng/e_services',
          official: true
        },
        {
          title: 'CAF Transition Group',
          description: 'Support during the transition from military to civilian life.',
          link: 'https://www.canada.ca/en/department-national-defence/services/benefits-military/transition.html',
          official: true
        },
        {
          title: 'Veterans Affairs Canada - Benefits Navigator',
          description: 'Tool to identify which benefits and services you may be eligible for.',
          link: 'https://www.veterans.gc.ca/eng/resources/benefits-navigator',
          official: true
        }
      ]
    },
    {
      id: 'education',
      title: 'Education & Training',
      description: 'Educational opportunities and training programs for veterans',
      icon: <GraduationCap className="h-5 w-5" />,
      resources: [
        {
          title: 'Education and Training Benefit',
          description: 'Financial support for post-secondary education and career development.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/back-to-school/education-training-benefit',
          official: true
        },
        {
          title: 'Military to Civilian Qualification Recognition',
          description: 'Information on having military qualifications recognized in civilian sectors.',
          link: 'https://www.canada.ca/en/department-national-defence/corporate/reports-publications/transition-guide/chapter-3-education.html',
          official: true
        },
        {
          title: 'Veterans Upskilling Program',
          description: 'Training programs focused on in-demand skills for the civilian workforce.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/back-to-school/vocational-rehabilitation',
          official: true
        }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Wellness',
      description: 'Resources for maintaining physical and mental health during transition',
      icon: <Heart className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Mental Health Services',
          description: 'Access to counseling, treatment, and support programs for mental health.',
          link: 'https://www.veterans.gc.ca/eng/health-support/mental-health-and-wellness',
          official: true
        },
        {
          title: 'Veterans Independence Program',
          description: 'Support services to help veterans remain independent in their homes.',
          link: 'https://www.veterans.gc.ca/eng/housing-and-home-life/help-at-home/veterans-independence-program',
          official: true
        },
        {
          title: 'CAF Member Assistance Program',
          description: '24/7 confidential counseling service for CAF members, veterans and families.',
          link: 'https://www.canada.ca/en/department-national-defence/services/guide/programs-canadian-forces/cfmap.html',
          official: true
        }
      ]
    },
    {
      id: 'employment',
      title: 'Employment & Career',
      description: 'Job search assistance and career development resources',
      icon: <Briefcase className="h-5 w-5" />,
      resources: [
        {
          title: 'Career Transition Services',
          description: 'Job search training, career counseling, and resume writing support.',
          link: 'https://www.veterans.gc.ca/eng/education-and-jobs/finding-a-job/career-transition-services',
          official: true
        },
        {
          title: 'Canada Company Military Employment Transition',
          description: 'Program connecting CAF members with employers who value military experience.',
          link: 'https://canadacompany.ca/canadacompany/met/',
          official: false
        },
        {
          title: 'Veterans Hiring Program - Federal Government',
          description: 'Priority hiring for qualified veterans in the federal public service.',
          link: 'https://www.canada.ca/en/public-service-commission/jobs/services/gc-jobs/veterans-priority-hiring.html',
          official: true
        }
      ]
    },
    {
      id: 'housing',
      title: 'Housing & Relocation',
      description: 'Assistance with finding housing and relocating to civilian communities',
      icon: <Home className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Housing Benefits',
          description: 'Programs to help veterans secure and maintain suitable housing.',
          link: 'https://www.veterans.gc.ca/eng/housing-and-home-life',
          official: true
        },
        {
          title: 'Canadian Mortgage and Housing Corporation - Veterans',
          description: 'Housing resources and mortgage assistance specifically for veterans.',
          link: 'https://www.cmhc-schl.gc.ca/en/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/mortgage-programs-veterans',
          official: true
        },
        {
          title: 'Integrated Relocation Program',
          description: 'Relocation benefits for releasing CAF members and their families.',
          link: 'https://www.canada.ca/en/department-national-defence/corporate/policies-standards/relocation-directive/2018.html',
          official: true
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Planning',
      description: 'Resources for financial management and planning during transition',
      icon: <DollarSign className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Affairs Financial Benefits',
          description: 'Income replacement and financial support programs for veterans.',
          link: 'https://www.veterans.gc.ca/eng/financial-support',
          official: true
        },
        {
          title: 'Canadian Armed Forces Pension',
          description: 'Information on CAF pension benefits and retirement planning.',
          link: 'https://www.canada.ca/en/department-national-defence/services/benefits-military/pay-pension-benefits/pension.html',
          official: true
        },
        {
          title: 'Financial Consumer Agency - Veterans',
          description: 'Financial planning resources tailored to the needs of transitioning veterans.',
          link: 'https://www.canada.ca/en/financial-consumer-agency/services/financial-toolkit.html',
          official: true
        }
      ]
    },
    {
      id: 'support-networks',
      title: 'Support Networks',
      description: 'Communities and organizations providing peer support during transition',
      icon: <BookOpen className="h-5 w-5" />,
      resources: [
        {
          title: 'Veterans Organizations Directory',
          description: 'Comprehensive list of veteran service organizations across Canada.',
          link: 'https://www.veterans.gc.ca/eng/resources/organizations-directory',
          official: true
        },
        {
          title: 'Operational Stress Injury Social Support (OSISS)',
          description: 'Peer support network for veterans with operational stress injuries.',
          link: 'https://www.canada.ca/en/department-national-defence/services/guide/dnd-caf-programs/osiss.html',
          official: true
        },
        {
          title: 'Royal Canadian Legion',
          description: 'Community support and advocacy for veterans and their families.',
          link: 'https://legion.ca/support-for-veterans',
          official: false
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Military Transition Resources</h1>
          <p className="text-gray-600 text-lg">
            Resources to help Canadian Armed Forces veterans transition to civilian life
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-xl font-medium mb-3">Transition Assistance Hotline</h3>
            <p className="mb-4">
              Veterans Affairs Canada offers personalized transition assistance for Canadian Armed Forces veterans. You can contact them directly for one-on-one support.
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

          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <h3 className="text-xl font-medium mb-3">Transition Timeline</h3>
            <p className="mb-4">Recommended steps for a successful military-to-civilian transition:</p>
            <ol className="space-y-2 list-decimal pl-5 text-gray-700">
              <li><strong>24 months before release:</strong> Begin exploring career options and educational needs</li>
              <li><strong>18 months before:</strong> Register for VAC benefits and attend transition workshops</li>
              <li><strong>12 months before:</strong> Update resume and begin networking</li>
              <li><strong>6 months before:</strong> Start job search and secure housing</li>
              <li><strong>3 months before:</strong> Finalize healthcare and benefits transition plans</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitaryTransitionResources;
