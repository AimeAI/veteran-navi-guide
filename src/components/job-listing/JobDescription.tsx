
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

interface JobDescriptionProps {
  description: string;
  matchingSkills?: string[];
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description, matchingSkills }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  const MAX_DESCRIPTION_LENGTH = 250;
  const shortDescription = description.length > MAX_DESCRIPTION_LENGTH ? 
    `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...` : 
    description;
  
  const highlightMatchingSkills = (text: string) => {
    if (!matchingSkills || matchingSkills.length === 0) {
      return text;
    }
    
    let highlightedText = text;
    
    // We're doing a simple replacement here, but this could be improved
    // with a more sophisticated algorithm that respects HTML tags
    matchingSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="bg-yellow-100 font-medium px-1 rounded dark:bg-yellow-900 dark:text-yellow-100">${skill}</span>`
      );
    });
    
    return highlightedText;
  };
  
  const sanitizedHighlightedDescription = expanded ? 
    DOMPurify.sanitize(highlightMatchingSkills(description)) : 
    DOMPurify.sanitize(highlightMatchingSkills(shortDescription));
  
  return (
    <>
      <div 
        className="mt-4 text-sm text-gray-700 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: sanitizedHighlightedDescription }}
        aria-label={expanded ? t("Full job description") : t("Job description preview")}
      />
      
      {description.length > MAX_DESCRIPTION_LENGTH && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-expanded={expanded}
        >
          {expanded ? t("Show less") : t("Show more")}
        </button>
      )}
    </>
  );
};

export default JobDescription;
