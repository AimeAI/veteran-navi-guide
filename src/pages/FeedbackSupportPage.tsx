
import React from 'react';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { RequireAuth } from '@/components/RequireAuth';

const FeedbackSupportPage = () => {
  return (
    <RequireAuth>
      <div className="container py-10 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Feedback & Support</h1>
        <FeedbackForm />
      </div>
    </RequireAuth>
  );
};

export default FeedbackSupportPage;
