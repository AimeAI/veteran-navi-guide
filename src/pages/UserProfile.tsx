
import React, { useState } from 'react';
import { User, Mail, Phone, Shield, BookOpen, Plus, X, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface ProfileState {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  militaryBackground: {
    branch: string;
    rank: string;
    mos: string;
    yearsOfService: string;
  };
  bio: string;
  skills: string[];
}

const UserProfile = () => {
  const [newSkill, setNewSkill] = useState('');
  const [profile, setProfile] = useState<ProfileState>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
    },
    militaryBackground: {
      branch: '',
      rank: '',
      mos: '',
      yearsOfService: '',
    },
    bio: '',
    skills: [],
  });

  const militaryBranches = [
    'Army',
    'Navy',
    'Air Force',
    'Marines',
    'Coast Guard',
    'Space Force',
  ];

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        [name]: value,
      },
    });
  };

  const handleMilitaryBackgroundChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      militaryBackground: {
        ...profile.militaryBackground,
        [name]: value,
      },
    });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      bio: e.target.value,
    });
  };

  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const addSkill = () => {
    if (newSkill.trim() !== '' && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSaveProfile = () => {
    console.log('Profile Data:', profile);
    // In a real application, we would send this data to an API
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Personal Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profile.personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Military Background */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Military Background
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={profile.militaryBackground.branch}
                      onChange={handleMilitaryBackgroundChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="">Select Branch</option>
                      {militaryBranches.map(branch => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-1">
                      Rank
                    </label>
                    <input
                      type="text"
                      id="rank"
                      name="rank"
                      value={profile.militaryBackground.rank}
                      onChange={handleMilitaryBackgroundChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="E-5, O-3, etc."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mos" className="block text-sm font-medium text-gray-700 mb-1">
                      MOS / Rating / AFSC
                    </label>
                    <input
                      type="text"
                      id="mos"
                      name="mos"
                      value={profile.militaryBackground.mos}
                      onChange={handleMilitaryBackgroundChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="11B, 68W, etc."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="yearsOfService" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Service
                    </label>
                    <input
                      type="text"
                      id="yearsOfService"
                      name="yearsOfService"
                      value={profile.militaryBackground.yearsOfService}
                      onChange={handleMilitaryBackgroundChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="e.g., 2015-2023"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Professional Bio
              </h2>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Tell employers about yourself
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profile.bio}
                  onChange={handleBioChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Share your professional background, accomplishments, and career goals..."
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Brief description of your background and career goals (max 500 characters)
                </p>
              </div>
            </div>
            
            {/* Skills */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg 
                  className="h-5 w-5 mr-2 text-primary" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Skills
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={handleNewSkillChange}
                    onKeyPress={handleKeyPress}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Add a skill (e.g., Leadership, Project Management)"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No skills added yet. Add your skills to help employers find you.
                    </p>
                  ) : (
                    profile.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-primary/70 hover:text-primary focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </button>
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

export default UserProfile;
