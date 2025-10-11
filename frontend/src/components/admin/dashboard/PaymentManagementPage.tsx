import { IndianRupee } from 'lucide-react';

interface PaymentManagementPageProps {
  searchQuery: string;
}

export function PaymentManagementPage({ }: PaymentManagementPageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600">Track and manage all payments</p>
      </div>

      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <IndianRupee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Management Coming Soon</h3>
        <p className="text-gray-600">
          This section will include payment tracking, transaction history, verification, and export functionality.
        </p>
      </div>
    </div>
  );
}
