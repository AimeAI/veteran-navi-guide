
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Share2, Link, Gift } from 'lucide-react';
import { generateReferralLink } from '@/utils/referralUtils';

interface ReferralShareProps {
  userId: string;
}

const ReferralShare: React.FC<ReferralShareProps> = ({ userId }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = generateReferralLink(userId);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareReferral = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join me on VetJobs',
          text: 'Check out this great platform for veterans!',
          url: referralLink
        });
      } else {
        await copyToClipboard();
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Your Referral Link</h3>
          <div className="flex space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Rewards Program</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-card">
            <Gift className="h-8 w-8 mb-2 text-primary" />
            <h4 className="font-medium mb-1">Premium Access</h4>
            <p className="text-sm text-muted-foreground">Get 1 month free premium for each successful referral</p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <Link className="h-8 w-8 mb-2 text-primary" />
            <h4 className="font-medium mb-1">Priority Support</h4>
            <p className="text-sm text-muted-foreground">Access priority support for you and your referral</p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <Share2 className="h-8 w-8 mb-2 text-primary" />
            <h4 className="font-medium mb-1">Special Features</h4>
            <p className="text-sm text-muted-foreground">Unlock special features for active referrers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralShare;
