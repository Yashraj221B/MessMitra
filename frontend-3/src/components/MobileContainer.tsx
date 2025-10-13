import type { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4" style={{ background: 'linear-gradient(135deg, #0B8043 0%, #1a5c3a 100%)' }}>
      <div className="w-full max-w-[430px] min-h-screen bg-white relative">
        {children}
      </div>
    </div>
  );
}
