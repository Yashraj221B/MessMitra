import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: ReactNode;
  gradient?: string;
}

export function PageHeader({ title, subtitle, onBack, action, gradient }: PageHeaderProps) {
  const defaultGradient = 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)';
  
  return (
    <div 
      className="relative pt-12 pb-6 px-6"
      style={{ background: gradient || defaultGradient }}
    >
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" 
           style={{ background: 'rgba(255,255,255,0.2)', filter: 'blur(40px)' }} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {onBack && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
          )}
          
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: subtitle ? '4px' : '0' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/90" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
