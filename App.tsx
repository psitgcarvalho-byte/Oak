
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Evaluation from './pages/Evaluation';
import Reports from './pages/Reports';
import Feedback from './pages/Feedback';
import AIChatBot from './components/AIChatBot';
import { Language } from './services/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'pt-BR',
  setLang: () => {},
});

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('pt-BR');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/calendar" element={<div className="p-8 text-center text-slate-400">Calendar Module Coming Soon...</div>} />
              <Route path="/evaluations" element={<Evaluation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<div className="p-8 text-center text-slate-400">Settings Module Coming Soon...</div>} />
            </Routes>
          </main>
          <AIChatBot />
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;
