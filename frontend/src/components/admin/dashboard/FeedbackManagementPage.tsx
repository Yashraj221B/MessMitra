import { MessageSquare } from 'lucide-react';

interface FeedbackManagementPageProps {
  searchQuery: string;
}

export function FeedbackManagementPage({ }: FeedbackManagementPageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback & Ratings</h1>
        <p className="text-gray-600">View and respond to user feedback</p>
      </div>

      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback Management Coming Soon</h3>
        <p className="text-gray-600">
          This section will include feedback viewing, ratings analytics, sentiment analysis, and response management.
        </p>
      </div>
    </div>
  );
}
