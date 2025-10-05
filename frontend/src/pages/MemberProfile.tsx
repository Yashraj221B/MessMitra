import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, UserCircle, Mail } from 'lucide-react';
import { mockMembers } from '../data/mockData';

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = mockMembers.find(m => m.id === id);

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Member not found</p>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (member.subscriptionStatus) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expiring-soon':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusText = () => {
    switch (member.subscriptionStatus) {
      case 'active':
        return 'Active';
      case 'expiring-soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity text-white"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Back</span>
        </button>
        
        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">{member.name}</h1>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge()}`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 pb-24 space-y-4 animate-fade-in">
        {/* Days Left Card */}
        <div className={`rounded-2xl shadow-lg p-6 border ${
          member.daysLeft >= 0
            ? member.daysLeft <= 7
              ? 'bg-linear-to-br from-amber-50 to-amber-100 border-amber-200'
              : 'bg-linear-to-br from-green-50 to-green-100 border-green-200'
            : 'bg-linear-to-br from-red-50 to-red-100 border-red-200'
        }`}>
          <p className={`text-sm font-medium mb-2 ${
            member.daysLeft >= 0
              ? member.daysLeft <= 7
                ? 'text-amber-700'
                : 'text-green-700'
              : 'text-red-700'
          }`}>
            Subscription Status
          </p>
          <p className={`text-4xl font-bold ${
            member.daysLeft >= 0
              ? member.daysLeft <= 7
                ? 'text-amber-700'
                : 'text-green-700'
              : 'text-red-700'
          }`}>
            {member.daysLeft >= 0 ? `${member.daysLeft} days` : 'Expired'}
          </p>
          {member.daysLeft < 0 && (
            <p className="text-red-600 text-sm mt-1">
              {Math.abs(member.daysLeft)} days ago
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="font-medium text-slate-800">{member.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{member.name.toLowerCase().replace(' ', '.')}@email.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Subscription Details</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 text-sm">Join Date</span>
              </div>
              <span className="font-medium text-slate-800">
                {new Date(member.joinDate).toLocaleDateString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 text-sm">End Date</span>
              </div>
              <span className="font-medium text-slate-800">
                {new Date(member.subscriptionEndDate).toLocaleDateString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Member ID</span>
              <span className="font-medium text-slate-800">#{member.id.padStart(4, '0')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors">
            Extend Subscription
          </button>
          
          <button className="w-full bg-white text-slate-700 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}
