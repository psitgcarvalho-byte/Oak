
import React, { useContext } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  FileText, 
  Settings, 
  LogOut,
  BrainCircuit,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useTranslation } from '../services/i18n';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { lang, setLang } = useContext(LanguageContext);
  const t = useTranslation(lang);
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: t('dashboard'), path: '/' },
    { icon: <Users size={20} />, label: t('patients'), path: '/patients' },
    { icon: <Calendar size={20} />, label: t('calendar'), path: '/calendar' },
    { icon: <ClipboardCheck size={20} />, label: t('evaluations'), path: '/evaluations' },
    { icon: <FileText size={20} />, label: t('reports'), path: '/reports' },
    { icon: <MessageSquare size={20} />, label: t('feedback'), path: '/feedback' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-teal-600 p-2 rounded-lg text-white">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Gestor T</h1>
      </div>

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
          <Globe size={16} className="text-slate-400" />
          <select 
            className="bg-transparent text-xs font-bold text-slate-600 outline-none w-full"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            <option value="pt-BR">Português (BR)</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
