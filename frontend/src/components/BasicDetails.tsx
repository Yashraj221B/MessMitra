import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, User, Building2, Home, IdCard, ChefHat, GraduationCap } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { userService, messService } from '../services';
import { toast } from 'sonner';

interface BasicDetailsProps {
  role: 'admin' | 'manager' | 'member';
  onBack: () => void;
  onComplete: (details: ManagerDetails | MemberDetails) => void;
}

interface ManagerDetails {
  name: string;
  messName: string;
  address: string;
  monthlyFee: number;
}

interface MemberDetails {
  name: string;
  room: string;
  memberId: string;
}

export function BasicDetails({ role, onBack, onComplete }: BasicDetailsProps) {
  // Manager fields
  const [managerName, setManagerName] = useState('');
  const [messName, setMessName] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');

  // Member fields
  const [memberName, setMemberName] = useState('');
  const [room, setRoom] = useState('');
  const [memberId, setMemberId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'manager') {
      if (managerName.trim() && messName.trim() && address.trim() && monthlyFee) {
        await saveManagerDetails({
          name: managerName,
          messName,
          address,
          monthlyFee: parseFloat(monthlyFee)
        });
      }
    } else {
      if (memberName.trim() && room.trim() && memberId.trim()) {
        await saveMemberDetails({
          name: memberName,
          room,
          memberId
        });
      }
    }
  };

  const saveManagerDetails = async (details: ManagerDetails) => {
    setIsLoading(true);
    try {
      // Update user profile with name
      await userService.updateProfile({ name: details.name });
      
      // Create mess
      await messService.createMess({
        name: details.messName,
        address: details.address,
        monthlyFee: details.monthlyFee
      });
      
      toast.success('Mess created successfully! 🎉');
      onComplete(details);
    } catch (error: any) {
      console.error('Error saving manager details:', error);
      toast.error(error.response?.data?.message || 'Failed to save details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMemberDetails = async (details: MemberDetails) => {
    setIsLoading(true);
    try {
      // Update user profile with name and member details
      await userService.updateProfile({
        name: details.name,
        // Store room and memberId in profile (backend should support these fields)
      });
      
      toast.success('Profile updated successfully! 🎉');
      onComplete(details);
    } catch (error: any) {
      console.error('Error saving member details:', error);
      toast.error(error.response?.data?.message || 'Failed to save details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = role === 'manager' 
    ? managerName.trim() && messName.trim() && address.trim() && monthlyFee.trim()
    : memberName.trim() && room.trim() && memberId.trim();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFC' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)',
          boxShadow: '0 8px 24px rgba(11, 128, 67, 0.12)'
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {role === 'manager' ? 'Mess Details' : 'Your Details'}
            </h1>
            <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {role === 'manager' ? 'मेस की जानकारी' : 'आपकी जानकारी'}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.9)' }} />
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.9)' }} />
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Icon Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 rounded-3xl text-center"
          style={{ 
            background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)',
            border: '1px solid rgba(11, 128, 67, 0.1)'
          }}
        >
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)'
          }}>
            {role === 'manager' ? (
              <ChefHat className="w-10 h-10 text-white" />
            ) : (
              <GraduationCap className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1A1F36', marginBottom: '4px' }}>
            {role === 'manager' ? 'Welcome, Mess Owner!' : 'Welcome, Member!'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {role === 'manager' 
              ? 'Let\'s set up your mess details'
              : 'Help us know you better'
            }
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {role === 'manager' ? (
            <>
              {/* Manager Name */}
              <div>
                <Label 
                  htmlFor="managerName"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Your Name • आपका नाम
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </div>
                  <Input
                    id="managerName"
                    type="text"
                    placeholder="Enter your name"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Mess Name */}
              <div>
                <Label 
                  htmlFor="messName"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Mess Name • मेस का नाम
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Building2 className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </div>
                  <Input
                    id="messName"
                    type="text"
                    placeholder="e.g., Shanti Bhawan Mess"
                    value={messName}
                    onChange={(e) => setMessName(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <Label 
                  htmlFor="address"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Address • पता
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <Home className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </div>
                  <textarea
                    id="address"
                    placeholder="Enter mess address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 resize-none"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
                    }}
                  />
                </div>
              </div>

              {/* Monthly Fee */}
              <div>
                <Label 
                  htmlFor="monthlyFee"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Monthly Fee • मासिक शुल्क
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <span style={{ color: '#6B7280', fontSize: '1.25rem', fontWeight: '600' }}>₹</span>
                  </div>
                  <Input
                    id="monthlyFee"
                    type="number"
                    placeholder="e.g., 3000"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem'
                    }}
                    min="0"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Member Name */}
              <div>
                <Label 
                  htmlFor="memberName"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Your Name • आपका नाम
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </div>
                  <Input
                    id="memberName"
                    type="text"
                    placeholder="Enter your name"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Room Number */}
              <div>
                <Label 
                  htmlFor="room"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Room Number • कमरा नंबर
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Home className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </div>
                  <Input
                    id="room"
                    type="text"
                    placeholder="e.g., H1-201"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Member ID */}
              <div>
                <Label 
                  htmlFor="memberId"
                  style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '8px', display: 'block' }}
                >
                  Member ID • मेंबर आईडी
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <IdCard className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </div>
                  <Input
                    id="memberId"
                    type="text"
                    placeholder="e.g., 2025001"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-2"
                    style={{ 
                      background: 'white',
                      borderColor: '#E5E7EB',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-2xl"
            style={{ 
              background: '#FFF9F0',
              border: '1px solid rgba(255, 144, 102, 0.2)'
            }}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 144, 102, 0.15)' }}>
                <span style={{ fontSize: '1rem' }}>💡</span>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
                  Why do we need this?
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: '1.5' }}>
                  {role === 'manager' 
                    ? 'This information helps members identify your mess and helps you manage your operations better.'
                    : 'This helps us personalize your experience and helps mess owners identify you.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.form>
      </div>

      {/* Bottom Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5"
        style={{ 
          background: 'white',
          borderTop: '1px solid #E5E7EB',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.04)'
        }}
      >
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            background: isValid && !isLoading ? 'linear-gradient(135deg, #0B8043 0%, #48C479 100%)' : '#E5E7EB',
            color: 'white',
            fontWeight: '700',
            fontSize: '1rem'
          }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-center mt-3" style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
          Almost there! Setting up your account...
        </p>
      </motion.div>
    </div>
  );
}
