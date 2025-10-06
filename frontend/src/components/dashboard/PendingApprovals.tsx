import { UserPlus, QrCode, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PendingApprovalCard from './PendingApprovalCard';

interface PendingMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  enrollmentDate: string;
}

interface PendingApprovalsProps {
  pendingMembers: PendingMember[];
  isProcessing: boolean;
  onApprove: (memberId: string) => void;
  onReject: (memberId: string) => void;
}

export default function PendingApprovals({
  pendingMembers,
  isProcessing,
  onApprove,
  onReject
}: PendingApprovalsProps) {
  const navigate = useNavigate();
  const hasPending = pendingMembers.length > 0;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 border border-purple-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Pending Approvals</h2>
            <p className="text-white/80 text-xs">
              {hasPending ? `${pendingMembers.length} new enrollment(s)` : 'All caught up!'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/generate-qr')}
          className="bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          New QR
        </button>
      </div>

      {hasPending ? (
        <div className="space-y-2">
          {pendingMembers.map((member) => (
            <PendingApprovalCard
              key={member.id}
              member={member}
              isProcessing={isProcessing}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
        <CheckCircle className="w-8 h-8 text-green-200" />
      </div>
      <p className="text-white font-medium mb-1">No pending approvals</p>
      <p className="text-white/70 text-sm mb-4">All caught up! Great work.</p>
      
      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-left">
        <p className="text-white/90 text-xs font-medium mb-1">💡 Pro Tip</p>
        <p className="text-white/80 text-xs">
          Waiting for new members?{' '}
          <button
            onClick={() => navigate('/generate-qr')}
            className="text-white font-semibold underline hover:text-white/90"
          >
            Generate a new enrollment QR
          </button>
          {' '}to share with them.
        </p>
      </div>
    </div>
  );
}
