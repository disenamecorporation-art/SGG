import React, { useState } from 'react';
import { ShieldCheck, Calendar, X } from 'lucide-react';
import { SanitaryPlan } from '../types';

interface SanitarioViewProps {
  sanitaryPlans: SanitaryPlan[];
  onAddSanitaryPlan: (plan: Omit<SanitaryPlan, 'id'>) => void;
}

export default function SanitarioView({ sanitaryPlans, onAddSanitaryPlan }: SanitarioViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSanitaryPlan({
      year,
      entries: []
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-poppins text-slate-800">Plan Sanitario</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700"
        >
          + Nuevo Plan Anual
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-500">Planificación sanitaria mensual y registro de aplicaciones.</p>
        {sanitaryPlans.length === 0 && <p className="text-sm text-slate-400 mt-4">No hay planes sanitarios registrados.</p>}
        {sanitaryPlans.map(plan => (
            <div key={plan.id} className="mt-4 p-4 border rounded-lg">
                <h3 className="font-bold">Plan {plan.year}</h3>
            </div>
        ))}
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4">
                <h3 className="text-lg font-bold">Nuevo Plan Anual</h3>
                <input type="number" className="w-full border p-2 rounded" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-200 rounded">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Guardar</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}
