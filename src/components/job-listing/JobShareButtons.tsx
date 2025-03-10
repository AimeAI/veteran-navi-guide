
import React from 'react';
import { Facebook, Linkedin, Twitter, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface JobShareButtonsProps {
  jobId: string;
  title: string;
  company: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showCopyLink?: boolean;
}

const JobShareButtons: React.FC<JobShareButtonsProps> = ({
  jobId,
  title,
  company,
  url,
  size = 'sm',
  variant = 'outline',
  showCopyLink = true
}) => {
  const { t } = useTranslation();
  
  // Get the full URL - if external URL is provided, use it, otherwise use our job details page
  const fullUrl = url || `${window.location.origin}/job/${jobId}`;
  
  const shareText = `${title} at ${company}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedShareText = encodeURIComponent(shareText);
  
  const buttonSizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };
  
  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedShareText}`, 'linkedin-share', 'width=750,height=600');
  };
  
  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`, 'twitter-share', 'width=550,height=235');
  };
  
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, 'facebook-share', 'width=580,height=296');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast.success(t('Link copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy link'));
      });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={variant}
        size="icon"
        className={`${buttonSizes[size]} rounded-full bg-[#0A66C2] hover:bg-[#084e95] text-white`}
        onClick={handleShareLinkedIn}
        title={t('Share on LinkedIn')}
        aria-label={t('Share on LinkedIn')}
      >
        <Linkedin className={iconSizes[size]} />
        <span className="sr-only">{t('Share on LinkedIn')}</span>
      </Button>
      
      <Button
        variant={variant}
        size="icon"
        className={`${buttonSizes[size]} rounded-full bg-[#1DA1F2] hover:bg-[#0c8bd9] text-white`}
        onClick={handleShareTwitter}
        title={t('Share on Twitter')}
        aria-label={t('Share on Twitter')}
      >
        <Twitter className={iconSizes[size]} />
        <span className="sr-only">{t('Share on Twitter')}</span>
      </Button>
      
      <Button
        variant={variant}
        size="icon"
        className={`${buttonSizes[size]} rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white`}
        onClick={handleShareFacebook}
        title={t('Share on Facebook')}
        aria-label={t('Share on Facebook')}
      >
        <Facebook className={iconSizes[size]} />
        <span className="sr-only">{t('Share on Facebook')}</span>
      </Button>
      
      {showCopyLink && (
        <Button
          variant={variant}
          size="icon"
          className={`${buttonSizes[size]} rounded-full`}
          onClick={handleCopyLink}
          title={t('Copy link')}
          aria-label={t('Copy link to clipboard')}
        >
          <Link className={iconSizes[size]} />
          <span className="sr-only">{t('Copy link')}</span>
        </Button>
      )}
    </div>
  );
};

export default JobShareButtons;
