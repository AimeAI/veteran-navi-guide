import React from 'react';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, MapPin, DollarSign, Calendar, Clock, Shield, FileText, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ApplicationButton from '@/components/ApplicationButton';

const jobData = {
  id: 'job-123',
  title: 'Cybersecurity Analyst',
  company: 'DefenceNet Systems',
  logo: '/placeholder.svg',
  location: 'Ottawa, ON',
  jobType: 'Full-time',
  postDate: '2023-05-15',
  salary: {
    min: 85000,
    max: 110000,
    currency: 'CAD',
    period: 'year'
  },
  description: `
    <p>DefenceNet Systems is seeking a qualified Cybersecurity Analyst to join our growing team in Ottawa. This position is ideal for veterans with experience in Canadian Armed Forces intelligence, signals, or cybersecurity operations.</p>
    
    <h4>Responsibilities:</h4>
    <ul>
      <li>Monitor and analyze security alerts and incidents from various security tools and systems</li>
      <li>Conduct vulnerability assessments and penetration testing</li>
      <li>Develop and implement security measures and controls</li>
      <li>Respond to security incidents and conduct forensic investigations</li>
      <li>Create detailed documentation and reports for technical and non-technical stakeholders</li>
      <li>Stay current with emerging threats and security technologies</li>
    </ul>
    
    <h4>Requirements:</h4>
    <ul>
      <li>3+ years of experience in cybersecurity or related field</li>
      <li>Knowledge of network security, intrusion detection, and incident response</li>
      <li>Familiarity with security frameworks (NIST, ISO 27001, etc.)</li>
      <li>Experience with security tools such as SIEM, IDS/IPS, and vulnerability scanners</li>
      <li>Excellent analytical and problem-solving skills</li>
      <li>Strong communication skills and ability to work in a team environment</li>
      <li>Secret security clearance (current or ability to obtain)</li>
    </ul>
    
    <h4>Benefits:</h4>
    <ul>
      <li>Competitive salary and comprehensive benefits package</li>
      <li>Professional development opportunities and certification support</li>
      <li>Flexible work arrangements</li>
      <li>Career advancement paths</li>
      <li>Supportive team environment that values military experience</li>
    </ul>
    
    <p>DefenceNet Systems is proud to be an equal opportunity employer. We actively support the hiring of Canadian Armed Forces veterans and recognize the unique skills and experience they bring to our organization.</p>
  `,
  skills: [
    'Network Security', 
    'SIEM Technologies', 
    'Threat Analysis', 
    'Incident Response', 
    'Vulnerability Assessment', 
    'Security Compliance', 
    'Intrusion Detection'
  ],
  mosCodes: [
    { code: '00171', name: 'Communications and Information Systems Specialist' },
    { code: '00339', name: 'Intelligence Operator' },
    { code: '00120', name: 'Signal Operator' }
  ],
  clearanceLevel: 'Secret',
  companyInfo: 'DefenceNet Systems is a leading Canadian cybersecurity firm specializing in providing advanced security solutions to government agencies and private sector organizations.',
};

const JobDetailsPage: React.FC = () => {
  const { toast } = useToast();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  
  const searchParams = new URLSearchParams(window.location.search);
  const variantId = searchParams.get('variant');

  const trackApplicationConversion = () => {
    if (variantId) {
      console.log(`Conversion tracked for variant: ${variantId}`);
    }
  };

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleCancelApplication = () => {
    setShowApplicationForm(false);
    setCoverLetter('');
    setResumeFile(null);
    setResumeFileName('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log({
      jobId: jobData.id,
      jobTitle: jobData.title,
      coverLetter,
      resumeFile,
      variantId
    });
    
    trackApplicationConversion();
    
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted for this position.",
    });
    
    setShowApplicationForm(false);
    setCoverLetter('');
    setResumeFile(null);
    setResumeFileName('');
  };

  const formatSalary = (min: number, max: number, currency: string, period: string) => {
    return `${currency} $${min.toLocaleString()} - $${max.toLocaleString()} per ${period}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Job Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{jobData.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-700 mb-3">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{jobData.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{jobData.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 my-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {jobData.jobType}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {formatSalary(
                      jobData.salary.min, 
                      jobData.salary.max, 
                      jobData.salary.currency,
                      jobData.salary.period
                    )}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Shield className="h-3 w-3 mr-1" />
                    {jobData.clearanceLevel} Clearance
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    <Calendar className="h-3 w-3 mr-1" />
                    Posted: {jobData.postDate}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col sm:flex-row md:flex-col gap-3">
                <ApplicationButton jobId={jobData.id} jobTitle={jobData.title} />
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto md:w-full"
                  size="lg"
                >
                  Save Job
                </Button>
              </div>
            </div>
          </div>
          
          {/* Application Form */}
          {showApplicationForm && (
            <div className="p-6 sm:p-8 border-b border-gray-200 bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Apply for {jobData.title}</h2>
                <Button variant="ghost" size="icon" onClick={handleCancelApplication}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* Cover Letter */}
                <div className="space-y-2">
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                    Cover Letter
                  </label>
                  <textarea 
                    id="coverLetter"
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're interested in this position and how your military experience is relevant..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                {/* Resume Upload */}
                <div className="space-y-2">
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                    Resume
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('resume')?.click()}
                      className="flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {resumeFileName ? 'Change File' : 'Upload Resume'}
                    </Button>
                    <input
                      type="file"
                      id="resume"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                    {resumeFileName && (
                      <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-200">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm text-gray-700">{resumeFileName}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 h-6 w-6"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeFileName('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelApplication}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Job Details */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: jobData.description }} 
                />
              </section>
              
              {/* Skills */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors px-3 py-1 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Apply Button (Mobile Sticky) */}
              <div className="lg:hidden sticky top-4 z-10 bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
                {!showApplicationForm && (
                  <Button className="w-full" size="lg" onClick={handleApply}>
                    Apply Now
                  </Button>
                )}
              </div>
              
              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="font-semibold text-lg mb-3">About the Company</h3>
                <p className="text-gray-700 text-sm">{jobData.companyInfo}</p>
              </div>
              
              {/* MOS Codes */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="font-semibold text-lg mb-3">Related MOSID Codes</h3>
                <div className="space-y-2">
                  {jobData.mosCodes.map((mos, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <div className="font-medium text-primary">{mos.code}</div>
                      <div className="text-sm text-gray-600">{mos.name}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  MOSID codes help match CAF occupations with civilian jobs
                </div>
              </div>
              
              {/* Application Tips */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h3 className="font-semibold text-lg text-blue-800 mb-3">Application Tips</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Highlight your CAF cybersecurity experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Translate military terms into civilian language</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Include your clearance level if applicable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Apply Section (Bottom) */}
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-200">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-semibold mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 mb-6">
                This position offers an excellent opportunity for Canadian Armed Forces veterans to leverage their military experience in cybersecurity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!showApplicationForm && (
                  <>
                    <Button size="lg" onClick={handleApply}>
                      Apply for This Position
                    </Button>
                    <Button variant="outline" size="lg">
                      Share Job
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetailsPage;
