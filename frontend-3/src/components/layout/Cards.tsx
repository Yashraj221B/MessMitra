import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ icon: Icon, label, value, color, bgColor, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl p-4 shadow-sm"
      style={{ background: bgColor, border: `1.5px solid ${color}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend && (
          <div 
            className="px-2 py-1 rounded-lg text-xs font-semibold"
            style={{ 
              background: trend.isPositive ? '#D1FAE520' : '#FEE2E220',
              color: trend.isPositive ? '#10B981' : '#EF4444'
            }}
          >
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1A1F36' }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  color: string;
  bgColor: string;
  onClick: () => void;
  badge?: string | number;
}

export function ActionCard({ icon: Icon, title, subtitle, color, bgColor, onClick, badge }: ActionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 rounded-2xl transition-all text-left relative overflow-hidden group"
      style={{ background: bgColor, border: `1.5px solid ${color}20` }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      <div className="relative flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1A1F36', marginBottom: '2px' }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: '500' }}>
              {subtitle}
            </p>
          )}
        </div>
        {badge !== undefined && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: color }}
          >
            {badge}
          </div>
        )}
      </div>
    </motion.button>
  );
}

interface InfoCardProps {
  icon: string;
  title: string;
  message: string;
  variant?: 'info' | 'warning' | 'success';
}

export function InfoCard({ icon, title, message, variant = 'info' }: InfoCardProps) {
  const colors = {
    info: { bg: '#FFF9F0', border: 'rgba(255, 144, 102, 0.2)', iconBg: 'rgba(255, 144, 102, 0.15)' },
    warning: { bg: '#FEF3C7', border: 'rgba(245, 158, 11, 0.2)', iconBg: 'rgba(245, 158, 11, 0.15)' },
    success: { bg: '#D1FAE5', border: 'rgba(16, 185, 129, 0.2)', iconBg: 'rgba(16, 185, 129, 0.15)' },
  };

  const style = colors[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-2xl"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
    >
      <div className="flex gap-3">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: style.iconBg }}
        >
          <span style={{ fontSize: '1rem' }}>{icon}</span>
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', marginBottom: '4px' }}>
            {title}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
           style={{ background: 'rgba(255, 144, 102, 0.1)' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1A1F36', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: action ? '16px' : '0', maxWidth: '300px' }}>
        {message}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-3 rounded-xl text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)' }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
