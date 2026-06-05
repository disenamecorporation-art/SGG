import React from 'react';
import { FileBarChart } from 'lucide-react';

export default function ReportesView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-poppins text-slate-800">Reportes y Dashboard Analítico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-lg mb-4">Producción</h3>
           <p className="text-slate-500">Métricas de producción de leche y ganancia de peso.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-lg mb-4">Salud y Reproducción</h3>
           <p className="text-slate-500">Historial clínico y eficiencia reproductiva.</p>
        </div>
      </div>
    </div>
  );
}
