import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  subscriptionEndDate: string;
  subscriptionStatus: 'active' | 'expiring-soon' | 'expired';
  daysLeft: number;
}

interface MemberAuthContextType {
  member: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const MemberAuthContext = createContext<MemberAuthContextType | undefined>(undefined);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedMember = localStorage.getItem('messmitra_member');
    if (storedMember) {
      try {
        setMember(JSON.parse(storedMember));
      } catch (error) {
        console.error('Failed to parse stored member:', error);
        localStorage.removeItem('messmitra_member');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - In production: await api.memberLogin(phone, password)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any credentials
      if (!phone || !password) {
        throw new Error('Invalid credentials');
      }

      // Mock member data - In production: comes from API
      const memberData: Member = {
        id: '1',
        name: 'Rahul Sharma',
        phone: phone,
        email: 'rahul.sharma@email.com',
        subscriptionEndDate: '2025-10-08',
        subscriptionStatus: 'expiring-soon',
        daysLeft: 2,
      };

      setMember(memberData);
      localStorage.setItem('messmitra_member', JSON.stringify(memberData));
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setMember(null);
    localStorage.removeItem('messmitra_member');
  };

  return (
    <MemberAuthContext.Provider
      value={{
        member,
        isAuthenticated: !!member,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);
  if (context === undefined) {
    throw new Error('useMemberAuth must be used within MemberAuthProvider');
  }
  return context;
}
