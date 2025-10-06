import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  value: number;
  label: string;
  color: 'green' | 'amber' | 'red';
  filterValue: 'active' | 'expiring-soon' | 'expired';
}

export default function StatCard({ value, label, color, filterValue }: StatCardProps) {
  const navigate = useNavigate();

  const colorStyles = {
    green: 'text-green-600 hover:bg-green-50 hover:border-green-200',
    amber: 'text-amber-600 hover:bg-amber-50 hover:border-amber-200',
    red: 'text-red-600 hover:bg-red-50 hover:border-red-200'
  };

  const handleClick = () => {
    navigate(`/members?filter=${filterValue}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 ${colorStyles[color]}`}
    >
      <p className={`text-2xl font-bold ${colorStyles[color].split(' ')[0]}`}>
        {value}
      </p>
      <p className="text-xs text-slate-600 mt-1">{label}</p>
    </button>
  );
}
