/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Plus, AlertTriangle, CheckCircle, HelpCircle, Calendar, Syringe } from 'lucide-react';
import { Animal, MastitisLog, Medicine } from '../types';

interface MastitisProps {
  animals: Animal[];
  mastitisLogs: MastitisLog[];
  onAddMastitisLog: (log: Omit<MastitisLog, 'id'>) => void;
  medicines: Medicine[];
}

export default function MastitisView({ animals, mastitisLogs, onAddMastitisLog, medicines }: MastitisProps) {
  const milkingCows = animals.filter(a => a.category === 'Vaca' && a.lactationStatus === 'En Lactancia');

  const [cowIdSelected, setCowIdSelected] = useState<string>('');
  const [testDate, setTestDate] = useState<string>('2026-06-03');
  
  // Quadrants checklist states
  const [lf, setLf] = useState(false); // Left Front
  const [rf, setRf] = useState(false); // Right Front
  const [lr, setLr] = useState(false); // Left Rear
  const [rr, setRr] = useState(false); // Right Rear

  const [cmtGrade, setCmtGrade] = useState<'Negativo' | 'Traza' | 'Grado 1' | 'Grado 2' | 'Grado 3'>('Negativo');
  const [appliedTx, setAppliedTx] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cowIdSelected) return alert('Por favor seleccione una vaca.');

    const targetCow = animals.find(a => a.id === cowIdSelected);
    if (!targetCow) return;

    onAddMastitisLog({
      animalId: cowIdSelected,
      tag: targetCow.tag,
      date: testDate,
      quadrants: { LF: lf, RF: rf, LR: lr, RR: rr },
      grade: cmtGrade,
      treatmentApplied: appliedTx || 'Ninguno - Monitoreo'
    });

    alert(`Control California Mastitis Test (CMT) registrado para la vaca #${targetCow.tag}. Estatus: ${cmtGrade}.`);
    
    // reset
    setCowIdSelected('');
    setLf(false);
    setRf(false);
    setLr(false);
    setRr(false);
    setCmtGrade('Negativo');
    setAppliedTx('');
  };

  const getCmtStyle = (grade: string) => {
    switch (grade) {
      case 'Negativo': return 'bg-emerald-100 text-emerald-800 border-emerald-250';
      case 'Traza': return 'bg-amber-100 text-amber-800 border-amber-250';
      case 'Grado 1': return 'bg-orange-100 text-orange-800 border-orange-250';
      case 'Grado 2': return 'bg-rose-150 text-rose-800 border-rose-250';
      case 'Grado 3': return 'bg-rose-800 text-white border-rose-900 font-bold';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Intro visual banner */}
      <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-start gap-3.5">
        <div className="bg-rose-100 text-rose-700 p-2.5 rounded-xl">
          <Activity className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-poppins font-bold text-slate-800 text-sm">Control Preventivo de Mastitis (California Mastitis Test)</h3>
          <p className="text-xs text-rose-650 font-medium leading-normal mt-0.5 max-w-2xl">
            La mastitis subclínica afecta silenciosamente el rendimiento de grasa y rendimiento quesero. El diagnóstico con CMT previene pérdidas masivas de leche y cuida el bienestar mamario del rebaño.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Register Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
          <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-rose-600" />
            Registrar Prueba CMT Individual
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {/* Choose cow */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Vaca evaluada en ordeño *</label>
              <select
                required
                value={cowIdSelected}
                onChange={(e) => setCowIdSelected(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
              >
                <option value="">-- Seleccionar Vaca --</option>
                {milkingCows.map(cow => (
                  <option key={cow.id} value={cow.id}>
                    Arete #{cow.tag} - {cow.name} ({cow.breed})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Date */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Fecha del CMT</label>
              <input
                type="date"
                required
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full border border-slate-205 rounded-lg p-2 font-medium outline-none"
              />
            </div>

            {/* Visual udder quadrants choice (Very fancy UI!) */}
            <div className="space-y-2">
              <label className="text-slate-600 block">Cuartos Mamarios Reactivos/Afectados</label>
              
              <div className="bg-slate-55 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-mono text-slate-400 mb-2 font-bold tracking-wider">Esquema Mamario (Ubre)</span>
                
                {/* 2x2 grid representing the cow's udder from behind */}
                <div className="grid grid-cols-2 gap-3.5">
                  
                  {/* Left Front (LF) */}
                  <button
                    type="button"
                    onClick={() => setLf(!lf)}
                    className={`w-16 h-16 rounded-t-full rounded-l-full border flex flex-col items-center justify-center transition-all ${
                      lf ? 'bg-rose-500 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold">AI</span>
                    <span className="text-[8px] font-mono leading-none mt-0.5">LF</span>
                  </button>

                  {/* Right Front (RF) */}
                  <button
                    type="button"
                    onClick={() => setRf(!rf)}
                    className={`w-16 h-16 rounded-t-full rounded-r-full border flex flex-col items-center justify-center transition-all ${
                      rf ? 'bg-rose-500 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold">AD</span>
                    <span className="text-[8px] font-mono leading-none mt-0.5">RF</span>
                  </button>

                  {/* Left Rear (LR) */}
                  <button
                    type="button"
                    onClick={() => setLr(!lr)}
                    className={`w-16 h-16 rounded-b-full rounded-l-full border flex flex-col items-center justify-center transition-all ${
                      lr ? 'bg-rose-500 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold">PI</span>
                    <span className="text-[8px] font-mono leading-none mt-0.5">LR</span>
                  </button>

                  {/* Right Rear (RR) */}
                  <button
                    type="button"
                    onClick={() => setRr(!rr)}
                    className={`w-16 h-16 rounded-b-full rounded-r-full border flex flex-col items-center justify-center transition-all ${
                      rr ? 'bg-rose-500 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold">PD</span>
                    <span className="text-[8px] font-mono leading-none mt-0.5">RR</span>
                  </button>
                  
                </div>
                <span className="text-[8px] text-slate-400 mt-2 text-center leading-normal">
                  (AI: Ant Izq | AD: Ant Der | PI: Post Izq | PD: Post Der). Haga click en los cuartos reactivos.
                </span>
              </div>
            </div>

            {/* CMT Score / Grade */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Grado de Diagnóstico CMT</label>
              <select
                value={cmtGrade}
                onChange={(e) => setCmtGrade(e.target.value as any)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
              >
                <option value="Negativo">Negativo (Líquido homogéneo - Sano)</option>
                <option value="Traza">Traza (Leve precipitado sin gelatina)</option>
                <option value="Grado 1">Grado 1 (Precipitado visible franco)</option>
                <option value="Grado 2">Grado 2 (Gel que se concentra al centro)</option>
                <option value="Grado 3">Grado 3 (Gel espeso, masa gelatinosa)</option>
              </select>
            </div>

            {/* Treatment applied */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Tratamiento Veterinario Aplicado</label>
              <input
                type="text"
                placeholder="Ej: Secado de cuarto, 1 jeringa intramamaria de Masticilina"
                value={appliedTx}
                onChange={(e) => setAppliedTx(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold py-2 rounded-lg text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Guardar en Historial CMT
            </button>
          </form>
        </div>

        {/* Right Column: Historical test Logs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-205 overflow-hidden shadow-xs">
          <div className="border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm bg-slate-50">
            Ficha de Controles California Mastitis Test (CMT) Históricos
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {mastitisLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay anomalías registradas. Historial limpio de mastitis ✨
              </div>
            ) : (
              [...mastitisLogs].reverse().map(log => {
                // Build reactive array representation
                const reactives = [];
                if (log.quadrants.LF) reactives.push('Ant. Izq (LF)');
                if (log.quadrants.RF) reactives.push('Ant. Der (RF)');
                if (log.quadrants.LR) reactives.push('Post. Izq (LR)');
                if (log.quadrants.RR) reactives.push('Post. Der (RR)');

                return (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-55 transition-all text-xs font-semibold">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-bold">Vaca #{log.tag}</span>
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getCmtStyle(log.grade)}`}>
                          CMT: {log.grade}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-normal">
                        Cuartos afectados: <strong className="text-rose-600">{reactives.length > 0 ? reactives.join(', ') : 'Ninguno (Sana)'}</strong>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Tratamiento: <strong className="text-slate-600 font-semibold">{log.treatmentApplied}</strong></p>
                    </div>

                    <div className="text-right mt-2 sm:mt-0 flex flex-col justify-between items-end">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {log.date}
                      </span>
                      {log.grade !== 'Negativo' && (
                        <span className="text-[9px] bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold font-mono inline-flex items-center gap-0.5 mt-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Retiro Activo
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
