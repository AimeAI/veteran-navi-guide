
import React from 'react';
import { Button } from './button';
import { Facebook, Linkedin, Twitter, Link } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showCopyLink?: boolean;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description = '',
  size = 'md',
  variant = 'outline',
  showCopyLink = true
}) => {
  const { t } = useTranslation();
  
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
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, 'facebook-share', 'width=580,height=296');
  };
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, 'twitter-share', 'width=550,height=235');
  };
  
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`, 'linkedin-share', 'width=750,height=600');
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success(t('common.linkCopied'), {
        description: t('common.linkCopiedDescription')
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast.error(t('common.linkCopyFailed'));
    });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={variant}
        size="icon"
        className={`${buttonSizes[size]} rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white`}
        onClick={shareOnFacebook}
        title={t('share.facebook')}
      >
        <Facebook className={iconSizes[size]} />
        <span className="sr-only">{t('share.facebook')}</span>
      </Button>
      
      <Button
        variant={variant}
        size="icon"
        className={`${buttonSizes[size]} rounded-full bg-[#1DA1F2] hover:bg-[#0c8bd9] text-white`}
        onClick={shareOnTwitter}
        title={t('share.twitter')}
      >
        <Twitter className={iconSizes[size]} />
        <span className="sr-only">{t('share.twitter')}</span>
      </Button>
      
      <Button
        variant={variant}
        size="icon"
        className={`${buttonSizes[size]} rounded-full bg-[#0A66C2] hover:bg-[#084e95] text-white`}
        onClick={shareOnLinkedIn}
        title={t('share.linkedin')}
      >
        <Linkedin className={iconSizes[size]} />
        <span className="sr-only">{t('share.linkedin')}</span>
      </Button>
      
      {showCopyLink && (
        <Button
          variant={variant}
          size="icon"
          className={`${buttonSizes[size]} rounded-full`}
          onClick={copyLinkToClipboard}
          title={t('share.copyLink')}
        >
          <Link className={iconSizes[size]} />
          <span className="sr-only">{t('share.copyLink')}</span>
        </Button>
      )}
    </div>
  );
};

export default SocialShareButtons;
