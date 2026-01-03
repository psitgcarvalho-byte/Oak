
import React, { useContext } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  FileCheck, 
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { LanguageContext } from '../App';
import { useTranslation } from '../services/i18n';

const data = [
  { month: 'Jan', patients: 12 },
  { month: 'Feb', patients: 15 },
  { month: 'Mar', patients: 18 },
  { month: 'Apr', patients: 14 },
  { month: 'May', patients: 22 },
  { month: 'Jun', patients: 25 },
];

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string, color: string }> = ({ 
  icon, label, value, trend, color 
}) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`${color} p-3 rounded-xl text-white`}>
        {icon}
      </div>
      <div className="flex items-center text-emerald-600 text-sm font-medium">
        {trend} <ArrowUpRight size={16} />
      </div>
    </div>
    <p className="text-slate-500 text-sm mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = useTranslation(lang);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">{t('welcome')}</h2>
        <p className="text-slate-500">Gestor T - Neuropsychology Management System.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={24} />} 
          label={t('totalPatients')} 
          value="124" 
          trend="+12%" 
          color="bg-blue-500"
        />
        <StatCard 
          icon={<CalendarIcon size={24} />} 
          label={t('sessionsMonth')} 
          value="48" 
          trend="+5%" 
          color="bg-purple-500"
        />
        <StatCard 
          icon={<FileCheck size={24} />} 
          label={t('pendingReports')} 
          value="7" 
          trend="-2%" 
          color="bg-amber-500"
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          label={t('revenue')} 
          value="R$ 12.400" 
          trend="+18%" 
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="patients" stroke="#0d9488" fill="#ccfbf1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50">
                <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-500 font-bold">P{i}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">João Silva</h4>
                  <p className="text-xs text-slate-500">Evaluation Session</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]"><Clock size={10} /> 14:00</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
