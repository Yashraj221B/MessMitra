import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Phone, Calendar } from 'lucide-react';
import { mockMembers } from '../data/mockData';
import type { Member } from '../types';

export default function Members() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'expiring') {
      setFilterStatus('expiring-soon');
    }
  }, [searchParams]);

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || member.subscriptionStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Member['subscriptionStatus']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expiring-soon':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusText = (status: Member['subscriptionStatus']) => {
    switch (status) {
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-white">Members</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'expiring-soon', label: 'Expiring' },
            { value: 'expired', label: 'Expired' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filterStatus === filter.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="px-6 py-4 space-y-3 pb-24 animate-fade-in">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No members found</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => navigate(`/members/${member.id}`)}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{member.name}</h3>
                  <div className="flex items-center gap-1 text-slate-600 text-sm mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                    member.subscriptionStatus
                  )}`}
                >
                  {getStatusText(member.subscriptionStatus)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Expires: {new Date(member.subscriptionEndDate).toLocaleDateString('en-IN')}</span>
                </div>
                {member.daysLeft >= 0 ? (
                  <span className={`text-sm font-semibold ${
                    member.daysLeft <= 7 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {member.daysLeft} days left
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-600">
                    Expired {Math.abs(member.daysLeft)} days ago
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/members/add')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
