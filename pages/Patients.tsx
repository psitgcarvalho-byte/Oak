
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Phone, Mail } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { PatientStatus } from '../types';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Patients</h2>
          <p className="text-slate-500">Manage patient profiles and history.</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-teal-600/20 self-start">
          <Plus size={20} />
          <span>New Patient</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or status..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors w-full md:w-auto justify-center">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors">{patient.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                patient.status === PatientStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' :
                patient.status === PatientStatus.WAITING ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
              }`}>
                {patient.status}
              </span>
              <span className="text-slate-400 text-xs">ID: {patient.id.padStart(4, '0')}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{patient.email}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                History
              </button>
              <button className="flex-1 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;
