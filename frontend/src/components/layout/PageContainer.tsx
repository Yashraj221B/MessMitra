import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50">
      {children}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function PageContent({ children, noPadding = false }: PageContentProps) {
  return (
    <div 
      className={`flex-1 ${noPadding ? '' : 'p-6'}`}
      style={{ paddingBottom: noPadding ? '0' : '80px' }} // Space for bottom nav
    >
      {children}
    </div>
  );
}
