/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Plus, Sparkles, Syringe, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';
import { MassTreatment, MassVaccination, Medicine, Animal } from '../types';

interface SanidadMasivaProps {
  animals: Animal[];
  medicines: Medicine[];
  massTreatments: MassTreatment[];
  massVaccinations: MassVaccination[];
  onAddMassTreatment: (tx: Omit<MassTreatment, 'id'>) => void;
  onAddMassVaccination: (vac: Omit<MassVaccination, 'id'>) => void;
}

export default function SanidadMasivaView({
  animals,
  medicines,
  massTreatments,
  massVaccinations,
  onAddMassTreatment,
  onAddMassVaccination
}: SanidadMasivaProps) {
  const [activeSubTab, setActiveSubTab] = useState<'tratamientos' | 'vacunaciones'>('tratamientos');

  // --- TRATAMIENTO MASIVO STATES ---
  const [mtDate, setMtDate] = useState('2026-06-03');
  const [mtGroupType, setMtGroupType] = useState<'Lote' | 'Potrero' | 'Todo'>('Lote');
  const [mtGroupName, setMtGroupName] = useState('Lote Levante Hembras');
  const [mtMedicineId, setMtMedicineId] = useState('');
  const [mtDose, setMtDose] = useState('');
  const [mtPersonnel, setMtPersonnel] = useState('José Marquina (Vallar/Veterinario)');

  // --- VACUNACION MASIVA STATES ---
  const [mvDate, setMvDate] = useState('2026-06-03');
  const [mvVaccineType, setMvVaccineType] = useState<'Aftosa' | 'Rabia' | 'Brucelosis' | 'Triple Portal' | 'Carbonoso'>('Aftosa');
  const [mvGroupType, setMvGroupType] = useState<'Lote' | 'Potrero' | 'Todo'>('Todo');
  const [mvGroupName, setMvGroupName] = useState('Rebaño Completo');
  const [mvBatch, setMvBatch] = useState('');

  // Extract unique Lots and Pastures for dropdown selection
  const lotsList = Array.from(new Set(animals.map(a => a.lot).filter(Boolean)));
  const pasturesList = Array.from(new Set(animals.map(a => a.pasture).filter(Boolean)));

  const handleTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mtMedicineId) return alert('Por favor seleccione un medicamento.');

    const targetMedicine = medicines.find(m => m.id === mtMedicineId);
    if (!targetMedicine) return;

    // Calculate count of targets based on selected lot
    let count = animals.length;
    if (mtGroupType === 'Lote') {
      count = animals.filter(a => a.lot === mtGroupName).length;
    } else if (mtGroupType === 'Potrero') {
      count = animals.filter(a => a.pasture === mtGroupName).length;
    }

    onAddMassTreatment({
      date: mtDate,
      groupType: mtGroupType,
      groupName: mtGroupType === 'Todo' ? 'Todo el Rebaño' : mtGroupName,
      medicineId: mtMedicineId,
      medicineName: targetMedicine.name,
      dose: mtDose || 'Dosis según prospecto',
      totalAnimals: count || 12, // default simulated
      personnel: mtPersonnel
    });

    alert('Tratamiento sanitario masivo registrado con éxito.');
    setMtDose('');
  };

  const handleVaccinationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mvBatch) return alert('Por favor ingrese el número de lote de la vacuna (exigido por guías INSAI de Venezuela).');

    let count = animals.length;
    if (mvGroupType === 'Lote') {
      count = animals.filter(a => a.lot === mvGroupName).length;
    } else if (mvGroupType === 'Potrero') {
      count = animals.filter(a => a.pasture === mvGroupName).length;
    }

    // Proejct next dose (usually aftosa rabies etc is done every 6 months or 1 year)
    const nextDate = new Date(mvDate);
    if (mvVaccineType === 'Aftosa') {
      nextDate.setMonth(nextDate.getMonth() + 6); // 6 Months cycle
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1); // 1 Year cycle
    }
    const nextDoseStr = nextDate.toISOString().split('T')[0];

    onAddMassVaccination({
      date: mvDate,
      vaccineType: mvVaccineType,
      groupType: mvGroupType,
      groupName: mvGroupType === 'Todo' ? 'Rebaño Completo' : mvGroupName,
      totalAnimals: count || 45,
      batchNumber: mvBatch,
      nextDoseDate: nextDoseStr
    });

    alert(`Vacunación masiva agendada. Próxima dosis requerida el ${nextDoseStr}.`);
    setMvBatch('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex bg-white p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('tratamientos')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'tratamientos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
          Tratamiento Masivo (De Parasitación / Vitaminación)
        </button>
        <button
          onClick={() => setActiveSubTab('vacunaciones')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'vacunaciones' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Syringe className="w-4.5 h-4.5 text-rose-500" />
          Vacunas Obligatorias (INSAI Cobertura Nacional)
        </button>
      </div>

      {activeSubTab === 'tratamientos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Mass form */}
          <div className="bg-white p-5 rounded-xl border border-slate-202 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
            <h4 className="font-poppins font-bold text-slate-850 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Aplicar Dosificación Lote / Potrero
            </h4>

            <form onSubmit={handleTreatmentSubmit} className="space-y-4">
              {/* Group Type */}
              <div className="space-y-1">
                <label className="text-slate-650 block">Seleccione el Tipo de Grupo</label>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <button
                    type="button"
                    onClick={() => { setMtGroupType('Lote'); setMtGroupName(lotsList[0] || 'Lote Levante Hembras'); }}
                    className={`py-1.5 rounded border font-bold ${mtGroupType === 'Lote' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-205'}`}
                  >
                    Por Lote
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMtGroupType('Potrero'); setMtGroupName(pasturesList[0] || 'Potrero El Copey'); }}
                    className={`py-1.5 rounded border font-bold ${mtGroupType === 'Potrero' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-205'}`}
                  >
                    Por Potrero
                  </button>
                  <button
                    type="button"
                    onClick={() => setMtGroupType('Todo')}
                    className={`py-1.5 rounded border font-bold ${mtGroupType === 'Todo' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-205'}`}
                  >
                    Todo el Rebaño
                  </button>
                </div>
              </div>

              {/* Dynamic group selection dropdown */}
              {mtGroupType !== 'Todo' && (
                <div className="space-y-1">
                  <label className="text-slate-600 block">Nombre del {mtGroupType}</label>
                  <select
                    value={mtGroupName}
                    onChange={(e) => setMtGroupName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                  >
                    {mtGroupType === 'Lote' ? (
                      lotsList.map(l => <option key={l} value={l}>{l}</option>)
                    ) : (
                      pasturesList.map(p => <option key={p} value={p}>{p}</option>)
                    )}
                  </select>
                </div>
              )}

              {/* Medicine Inventory Selector */}
              <div className="space-y-1">
                <label className="text-slate-600 block">Antiparasitario / Vitaminas / Inyección *</label>
                <select
                  required
                  value={mtMedicineId}
                  onChange={(e) => setMtMedicineId(e.target.value)}
                  className="w-full border border-slate-202 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="">-- Seleccionar fármaco --</option>
                  {medicines.filter(m => m.id !== 'med3').map(m => (
                    <option key={m.id} value={m.id}>{m.name} (Ref: {m.activeIngredient} - Stock: {m.stock} {m.unit})</option>
                  ))}
                </select>
              </div>

              {/* Specific Dose instructions */}
              <div className="space-y-1">
                <label className="text-slate-600 block">Dosis p/ animal y Vía de aplicación</label>
                <input
                  type="text"
                  placeholder="Ej: 5 ml Vía Subcutánea (SC)"
                  className="w-full border border-slate-200 p-2 rounded-lg"
                  value={mtDose}
                  onChange={(e) => setMtDose(e.target.value)}
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-slate-600 block">Fecha de aplicación</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-190 p-2 rounded-lg"
                  value={mtDate}
                  onChange={(e) => setMtDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Personal Ejecutor / Veterinario supervisor</label>
                <input
                  type="text"
                  className="w-full border border-slate-190 p-2 rounded-lg font-medium"
                  value={mtPersonnel}
                  onChange={(e) => setMtPersonnel(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 border border-emerald-950 text-white font-bold py-2 rounded-lg transition-all"
              >
                Cargar Tratamiento Grupal
              </button>
            </form>
          </div>

          {/* Right: History register list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm bg-slate-50 flex justify-between items-center">
              <span>Historial de Dosificaciones de Lote Recientes</span>
              <span className="text-[10px] bg-slate-100 text-slate-550 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">Registro Masivo</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {massTreatments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Sin dosificaciones masivas registradas.
                </div>
              ) : (
                [...massTreatments].reverse().map(item => (
                  <div key={item.id} className="p-4 flex items-start justify-between font-semibold text-xs text-slate-700">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-800 font-bold bg-slate-150 px-2.5 py-0.5 rounded-lg">Destino: {item.groupName}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 border border-slate-150 rounded">Afectados: {item.totalAnimals} animales</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">Fármaco: <strong className="text-emerald-800 font-bold">{item.medicineName}</strong> (Dosis: {item.dose})</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">A cargo de: <strong className="font-semibold text-slate-600">{item.personnel}</strong></p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: VACUNAS OBLIGATORIAS GOVERNANMENT */}
      {activeSubTab === 'vacunaciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-710">
            <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Syringe className="w-4 h-4 text-rose-600" />
              Cargar Certificado de Vacunación
            </h4>

            <form onSubmit={handleVaccinationSubmit} className="space-y-4">
              {/* Vaccine Type */}
              <div className="space-y-1">
                <label className="text-slate-650 block font-semibold">Tipo de Vacuna Obligatoria</label>
                <select
                  value={mvVaccineType}
                  onChange={(e) => setMvVaccineType(e.target.value as any)}
                  className="w-full border border-slate-205 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="Aftosa">Fiebre Aftosa (Aftogan / Ciclicidad obligatorio)</option>
                  <option value="Rabia">Rabia Silvestre (Ciclaje anual)</option>
                  <option value="Brucelosis">Calidad Brucelosis (Hembras lactantes Cepas 19 / RB51)</option>
                  <option value="Triple Portal">Triple Portal (Mancha / Edema / Septicemia Hemorrágica)</option>
                  <option value="Carbonoso">Fiebre Carbonosa (Antrax)</option>
                </select>
              </div>

              {/* Group selection */}
              <div className="space-y-1">
                <label className="text-slate-600 block">Lote o Grupo Vacunado</label>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => { setMvGroupType('Todo'); setMvGroupName('Rebaño Completo'); }}
                    className={`py-1.5 rounded border ${mvGroupType === 'Todo' ? 'bg-rose-50 border-rose-250 text-rose-800' : 'bg-white border-slate-200'}`}
                  >
                    Todo el Rebaño
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMvGroupType('Lote'); setMvGroupName(lotsList[0] || 'Lote Levante Hembras'); }}
                    className={`py-1.5 rounded border ${mvGroupType === 'Lote' ? 'bg-rose-50 border-rose-250 text-rose-800' : 'bg-white border-slate-200'}`}
                  >
                    Por Lote
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMvGroupType('Potrero'); setMvGroupName(pasturesList[0] || 'Potrero El Copey'); }}
                    className={`py-1.5 rounded border ${mvGroupType === 'Potrero' ? 'bg-rose-50 border-rose-250 text-rose-800' : 'bg-white border-slate-200'}`}
                  >
                    Por Potrero
                  </button>
                </div>
              </div>

              {mvGroupType !== 'Todo' && (
                <div className="space-y-1">
                  <label className="text-slate-600 block">Nombre del {mvGroupType}</label>
                  <select
                    value={mvGroupName}
                    onChange={(e) => setMvGroupName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                  >
                    {mvGroupType === 'Lote' ? (
                      lotsList.map(l => <option key={l} value={l}>{l}</option>)
                    ) : (
                      pasturesList.map(p => <option key={p} value={p}>{p}</option>)
                    )}
                  </select>
                </div>
              )}

              {/* Batch / Lote de vacuna - Exigido para el Sigat de INSAI en Venezuela */}
              <div className="space-y-1">
                <label className="text-slate-600 block">Lote de Vacuna / Frasco Número *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: BATCH-LT9055-2026"
                  className="w-full border border-slate-200 p-2 rounded-lg font-bold font-mono outline-none"
                  value={mvBatch}
                  onChange={(e) => setMvBatch(e.target.value)}
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-slate-600 block">Fecha de inoculación</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-180 p-2 rounded-lg"
                  value={mvDate}
                  onChange={(e) => setMvDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-700 hover:bg-rose-800 border border-rose-950 text-white font-bold py-2 rounded-lg transition-all text-xs tracking-wide shadow-xs flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Registrar Vacunación Masiva
              </button>
            </form>
          </div>

          {/* Right History list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="border-b border-slate-105 p-4 font-poppins font-bold text-slate-805 text-sm bg-slate-50 flex items-center justify-between">
              <span>Certificaciones Sanitarias (INSAI Gacetas)</span>
              <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold font-mono">Control Epidemiológico</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {massVaccinations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs text-[11px]">
                  Sin vacunas masivas registradas en el período.
                </div>
              ) : (
                [...massVaccinations].reverse().map(item => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-50 transition-all font-semibold text-xs text-slate-700">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-rose-50 border border-rose-100 text-rose-850 px-2.5 py-0.5 text-[10px] rounded-lg font-bold">Vacuna: {item.vaccineType}</span>
                        <span className="text-slate-450 text-[10px]">Destino: <strong className="text-slate-600">{item.groupName}</strong> ({item.totalAnimals} Cabezas)</span>
                      </div>
                      <p className="text-[11px] leading-tight">Número de Lote / Registro INSAI: <strong className="font-bold font-mono text-slate-800">{item.batchNumber}</strong></p>
                      
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-normal">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Suministrado exitosamente en corral de embudo.</span>
                      </div>
                    </div>

                    <div className="text-right mt-2 sm:mt-0 flex flex-col justify-between items-end shrink-0 select-none">
                      <span className="text-[10px] text-slate-400 font-mono">Inoculado: {item.date}</span>
                      <span className="text-[10px] text-rose-800 bg-rose-50/50 border border-rose-100 px-2 py-0.5 rounded font-mono font-bold mt-1">
                        Siguente dosis due: {item.nextDoseDate}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
