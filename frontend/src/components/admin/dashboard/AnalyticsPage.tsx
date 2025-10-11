import { BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">View detailed analytics and insights</p>
      </div>

      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard Coming Soon</h3>
        <p className="text-gray-600">
          This section will include charts, graphs, trends, and detailed platform analytics.
        </p>
      </div>
    </div>
  );
}
