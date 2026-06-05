import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SanitaryPlan } from '../types';

interface SanitarioViewProps {
  sanitaryPlans: SanitaryPlan[];
  onAddSanitaryPlan: (plan: Omit<SanitaryPlan, 'id'>) => void;
}

export default function SanitarioView({ sanitaryPlans, onAddSanitaryPlan }: SanitarioViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-poppins text-slate-800">Plan Sanitario</h2>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
          + Nuevo Plan Anual
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-500">Planificación sanitaria mensual y registro de aplicaciones.</p>
        {/* Implementation to be completed in next steps */}
      </div>
    </div>
  );
}
