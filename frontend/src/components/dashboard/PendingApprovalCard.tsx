import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface PendingMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  enrollmentDate: string;
}

interface PendingApprovalCardProps {
  member: PendingMember;
  isProcessing: boolean;
  onApprove: (memberId: string) => void;
  onReject: (memberId: string) => void;
}

export default function PendingApprovalCard({
  member,
  isProcessing,
  onApprove,
  onReject
}: PendingApprovalCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-semibold text-white">{member.name}</p>
          <p className="text-white/70 text-sm">{member.phone}</p>
          <p className="text-white/60 text-xs mt-1">{member.email}</p>
        </div>
        <div className="flex items-center gap-1 text-white/80 text-xs">
          <Clock className="w-3 h-3" />
          {new Date(member.enrollmentDate).toLocaleDateString('en-IN')}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onApprove(member.id)}
          disabled={isProcessing}
          className="bg-green-600 disabled:bg-green-400 text-white py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(member.id)}
          disabled={isProcessing}
          className="bg-red-600/80 disabled:bg-red-400 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );
}
