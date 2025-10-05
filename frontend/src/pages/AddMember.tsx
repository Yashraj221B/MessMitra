import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function AddMember() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subscriptionEndDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - just navigate back
    navigate('/members');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-xl">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity text-white"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-white">Add New Member</h1>
        <p className="text-white text-sm mt-1">Fill in the details below</p>
      </div>

      {/* Form */}
      <div className="px-6 py-6 pb-24 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-hidden transition-all"
                placeholder="Enter member's full name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-hidden transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div>
              <label htmlFor="subscriptionEndDate" className="block text-sm font-medium text-slate-700 mb-2">
                Subscription End Date *
              </label>
              <input
                id="subscriptionEndDate"
                type="date"
                value={formData.subscriptionEndDate}
                onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-hidden transition-all"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Select the last day of the member's subscription
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>

          <button
            type="button"
            onClick={() => navigate('/members')}
            className="w-full bg-white text-slate-700 py-4 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
