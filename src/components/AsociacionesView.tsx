/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Plus, Layers, Milk, TrendingUp, Sparkles, AlertCircle, Calendar, Users, HelpCircle } from 'lucide-react';
import { BuffaloProduction, SmallRuminantLog, Animal } from '../types';

interface AsociacionesViewProps {
  animals: Animal[];
  buffaloProduction: BuffaloProduction[];
  smallRuminantLogs: SmallRuminantLog[];
  onAddBuffaloProd: (prod: Omit<BuffaloProduction, 'id'>) => void;
  onAddSmallRuminantLog: (log: Omit<SmallRuminantLog, 'id'>) => void;
}

export default function AsociacionesView({
  animals,
  buffaloProduction,
  smallRuminantLogs,
  onAddBuffaloProd,
  onAddSmallRuminantLog
}: AsociacionesViewProps) {
  const [activeSegment, setActiveSegment] = useState<'criabufalo' | 'cebu' | 'caprino_ovino'>('criabufalo');

  // --- CRIABÚFALO FORM STATES ---
  const [bDate, setBDate] = useState('2026-06-03');
  const [bDailyKg, setBDailyKg] = useState<number>(45.0);
  const [bMilking, setBMilking] = useState<number>(8);
  const [bFat, setBFat] = useState<number>(7.8);
  const [bProtein, setBProtein] = useState<number>(4.1);

  // --- CEBÚ FORM STATES ---
  const [cebuAnimalId, setCebuAnimalId] = useState('');
  const [cebuAsocebu, setCebuAsocebu] = useState('');
  const [cebuScore, setCebuScore] = useState('94/100 (Excelente)');
  const [cebuWean205, setCebuWean205] = useState<number>(205);
  const [cebuWeight540, setCebuWeight540] = useState<number>(390);

  // --- CAPRINO & OVINO STATES ---
  const [srDate, setSrDate] = useState('2026-06-03');
  const [srSpecies, setSrSpecies] = useState<'Cabra' | 'Oveja'>('Cabra');
  const [srBreed, setSrBreed] = useState('Alpina');
  const [srActionType, setSrActionType] = useState<'Leche' | 'Pesaje' | 'Parto Múltiple'>('Leche');
  const [srTag, setSrTag] = useState('');
  const [srValue, setSrValue] = useState<number>(3.5); // liters, kg, or offspring count
  const [srNotes, setSrNotes] = useState('');

  // Extract Cebú animals (Brahman, Guzerá, Nelore)
  const cebuBreeds = ['Brahman Gris', 'Guzerá Puro', 'Brahman Blanco x Senepol'];
  const cebuAnimals = animals.filter(a => cebuBreeds.includes(a.breed) || a.category === 'Toro' || a.category === 'Novillo');

  // --- CALCULATORS FOR BUFFALO CHEESE ---
  // Buffalo milk is highly dense in solids. Typically, 1 Kg of mozzarella or "Queso de Mano"
  // needs only 5 Liters of buffalo milk, whereas standard cow milk needs 8-10 Liters!
  // Formula: Cheese Projection = (daily yield Kg * 0.20) because fat/solids ratio yields ~20%.
  const getCheeseYieldProjection = (yieldKg: number) => {
    return Number((yieldKg * 0.20).toFixed(2));
  };

  const handleBuffaloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = animals.filter(a => a.category === 'Búfala' || a.category === 'Búfalo').length;

    onAddBuffaloProd({
      date: bDate,
      totalBuffaloes: count || 12,
      milkingBuffaloes: bMilking,
      dailyYieldKg: bDailyKg,
      averageFat: bFat,
      averageProtein: bProtein,
      cheeseProjectionKg: getCheeseYieldProjection(bDailyKg)
    });

    alert('Registro Criabúfalo de ordeño y sólidos guardado correctamente.');
  };

  const handleCebuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cebuAnimalId) return alert('Por favor seleccione un animal Cebú.');

    // Find animal and update genetically directly
    const target = animals.find(a => a.id === cebuAnimalId);
    if (target) {
      target.asocebuNumber = cebuAsocebu;
      target.geneticsScore = cebuScore;
      target.weaningWeight205 = cebuWean205;
      target.weight540 = cebuWeight540;
      alert(`Ficha Cebú actualizada para #${target.tag} con registro ASOCEBU ${cebuAsocebu} y calibración de pesos.`);
    }
  };

  const handleSmallRuminantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srTag) return alert('Ingrese la identificación de la cabra o oveja.');

    onAddSmallRuminantLog({
      date: srDate,
      species: srSpecies,
      breed: srBreed,
      actionType: srActionType,
      tag: srTag,
      milkYield: srActionType === 'Leche' ? srValue : undefined,
      weight: srActionType === 'Pesaje' ? srValue : undefined,
      prolificacyCount: srActionType === 'Parto Múltiple' ? Math.round(srValue) : undefined,
      notes: srNotes || `${srActionType} - Registro de control`
    });

    alert(`Registro de ${srSpecies} guardado con éxito.`);
    setSrTag('');
    setSrNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Sub menu segment selection row */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveSegment('criabufalo')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'criabufalo' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Milk className="w-4.5 h-4.5 text-blue-450" />
          Métricas Criabúfalo (Búfalos)
        </button>
        <button
          onClick={() => setActiveSegment('cebu')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'cebu' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4.5 h-4.5 text-yellow-500" />
          Evaluación Cebú (ASOCEBU)
        </button>
        <button
          onClick={() => setActiveSegment('caprino_ovino')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'caprino_ovino' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4.5 h-4.5 text-orange-500" />
          Control Caprino y Ovino
        </button>
      </div>

      {/* SEGMENT 1: METRICAS CRIABÚFALO */}
      {activeSegment === 'criabufalo' && (
        <div className="space-y-6">
          {/* Banner */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-start gap-3.5">
            <div className="bg-blue-105 text-blue-700 p-2.5 rounded-xl">
              <Milk className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-slate-850 text-sm">Control Criabúfalo de Venezuela</h3>
              <p className="text-xs text-blue-650 font-medium leading-normal mt-0.5 max-w-2xl">
                La leche de búfala cuenta con sólidos y grasas de hasta 8%, permitiendo un rendimiento quesero excepcional (relación 5L de leche por 1 Kg de Queso llanero o tren). Registre aquí los sólidos y proyecte su producción bufalina.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-700" />
                Registrar Ordeño Bufalino Diario
              </h4>

              <form onSubmit={handleBuffaloSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-650 block">Fecha</label>
                  <input type="date" className="w-full border p-2 rounded-lg" value={bDate} onChange={(e) => setBDate(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-650 block">Búfalas en Ordeño</label>
                    <input type="number" className="w-full border p-2 rounded-lg font-bold" value={bMilking} onChange={(e) => setBMilking(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-605 block">Rendimiento Diario (Kg)</label>
                    <input type="number" step="0.1" className="w-full border p-2 rounded-lg font-bold" value={bDailyKg} onChange={(e) => setBDailyKg(Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-650 block">Grasa (%) (Avg 7-9%)</label>
                    <input type="number" step="0.1" className="w-full border p-2 rounded-lg font-bold" value={bFat} onChange={(e) => setBFat(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-605 block">Proteína (%) (Avg 4%)</label>
                    <input type="number" step="0.1" className="w-full border p-2 rounded-lg font-bold" value={bProtein} onChange={(e) => setBProtein(Number(e.target.value))} />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-105 p-3.5 rounded-lg">
                  <p className="text-blue-805 font-bold flex items-center gap-1">Proyección Quesera Estimada</p>
                  <p className="text-[10px] text-blue-650 mt-1">Con rendimiento de sólidos e indicador del 20%, se estiman:</p>
                  <strong className="text-base font-bold text-blue-900 block mt-1.5 font-mono">
                    🧀 {getCheeseYieldProjection(bDailyKg)} Kg de Queso Blanco / de Mano
                  </strong>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 rounded-lg text-xs">
                  Guardar Registro Bufalino
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50 border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm flex justify-between items-center bg-blue-50/10">
                <span>Controles de Leche y Queso Criabúfalo Históricos</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-bold font-mono">Calidad Bufalina</span>
              </div>

              <div className="divide-y divide-slate-100 font-semibold text-xs text-slate-705 max-h-[460px] overflow-y-auto">
                {buffaloProduction.map(bp => (
                  <div key={bp.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-50 transition-all font-semibold gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-bold">Ordeño de {bp.milkingBuffaloes} Búfalas</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-bold font-mono">Grasa: {bp.averageFat}% | Prot: {bp.averageProtein}%</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">Producción total diaria: <strong className="font-bold text-slate-800">{bp.dailyYieldKg} Kg</strong></p>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {bp.date}
                      </span>
                      <span className="text-[10px] text-emerald-850 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold font-mono mt-2">
                        Queso Proyectado: {bp.cheeseProjectionKg} Kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 2: ASOCEBU GENETICA CEBU */}
      {activeSegment === 'cebu' && (
        <div className="space-y-6 animate-fade-in">
          {/* Banner */}
          <div className="bg-yellow-50 border border-yellow-105 p-5 rounded-xl flex items-start gap-3.5">
            <div className="bg-yellow-100 text-yellow-800 p-2.5 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-slate-850 text-sm">Registro de Evaluación Genética Cebú (ASOCEBU)</h3>
              <p className="text-xs text-yellow-750 font-medium leading-normal mt-0.5 max-w-2xl">
                Los animales puros de registro (Brahman, Guzerá o Nelore) inscritos en ASOCEBU Venezuela requieren el pesaje estandarizado a los 205 días (fórmula ajustada de peso al destete) y el pesaje a los 540 días para registrar la ganancia post-destete.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
              <h4 className="font-poppins font-bold text-slate-850 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-semibold text-emerald-800" />
                Matricular en Registro ASOCEBU
              </h4>

              <form onSubmit={handleCebuSubmit} className="space-y-4 text-xs">
                {/* Select animal */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Animal p/ Certificación Cebú *</label>
                  <select
                    required
                    value={cebuAnimalId}
                    onChange={(e) => {
                      setCebuAnimalId(e.target.value);
                      const t = animals.find(a => a.id === e.target.value);
                      if (t) {
                        setCebuAsocebu(t.asocebuNumber || '');
                        setCebuScore(t.geneticsScore || '90/100');
                        setCebuWean205(t.weaningWeight205 || 205);
                        setCebuWeight540(t.weight540 || 380);
                      }
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                  >
                    <option value="">-- Seleccionar vacuno p/ pedigrí --</option>
                    {cebuAnimals.map(a => (
                      <option key={a.id} value={a.id}>Arete #{a.tag} - {a.name} ({a.breed} | {a.currentWeight} Kg)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-650 block">Número de Registro ASOCEBU</label>
                  <input
                    type="text"
                    placeholder="Ej: VE-BR-45099"
                    className="w-full border p-2 rounded-lg font-bold font-mono text-slate-800 outline-none"
                    value={cebuAsocebu}
                    onChange={(e) => setCebuAsocebu(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-650 block">Puntaje de Clasificación Lineal</label>
                  <input
                    type="text"
                    placeholder="Ej: 94/100, Tipo Avanzado (TA)"
                    className="w-full border p-2 rounded-lg font-medium outline-none"
                    value={cebuScore}
                    onChange={(e) => setCebuScore(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 font-semibold">
                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border">
                    <label className="text-slate-500 block leading-tight text-[10px]">Peso Ajustado Destete 205 días (Kg)</label>
                    <input type="number" className="w-full border p-1 rounded font-mono font-bold text-center mt-1 outline-none" value={cebuWean205} onChange={(e) => setCebuWean205(Number(e.target.value))} />
                  </div>

                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border">
                    <label className="text-slate-505 block leading-tight text-[10px]">Peso Ajustado 18 meses 540 d (Kg)</label>
                    <input type="number" className="w-full border p-1 rounded font-mono font-bold text-center mt-1 outline-none" value={cebuWeight540} onChange={(e) => setCebuWeight540(Number(e.target.value))} />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 border text-white font-bold py-2 rounded-lg text-xs">
                  Guardar en Genealogía ASOCEBU
                </button>
              </form>
            </div>

            {/* List and lineal calibration charts */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-205 p-5 shadow-xs space-y-4">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                <span>Récord de Calibración de Pesos de Rebaño Puro</span>
                <span className="text-[10px] text-yellow-600 bg-yellow-100 font-bold rounded px-2.5 py-0.5">Estatutos ASOCEBU</span>
              </h4>

              <div className="divide-y font-semibold text-xs text-slate-705 max-h-[380px] overflow-y-auto space-y-3.5">
                {animals.filter(a => a.asocebuNumber).map(cb => {
                  // Calculate expected daily weight gain between weaning 205 and 18 months 540 d
                  const growthDays = 540 - 205; // 335 days
                  const netGain = (cb.weight540 || 390) - (cb.weaningWeight205 || 205);
                  const postWeanGainRate = postWeanGainRateCalc(cb);

                  return (
                    <div key={cb.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-800 font-bold">Arete #{cb.tag} | "{cb.name}" ({cb.breed})</strong>
                          <span className="bg-yellow-100 text-yellow-800 text-[10.5px] px-2 py-0.5 rounded font-bold font-mono">Reg: {cb.asocebuNumber}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Clasificación lineal: <strong className="text-slate-600">{cb.geneticsScore}</strong> | Destete (205d): <strong className="text-slate-650">{cb.weaningWeight205} kg</strong> | Edad 18m: <strong className="text-slate-650">{cb.weight540} kg</strong>
                        </p>
                      </div>

                      <div className="text-right font-mono whitespace-nowrap bg-white border border-slate-100 p-2 rounded-lg">
                        <span className="text-[9px] text-slate-400 block font-sans font-semibold">Crecimiento Post-Destete:</span>
                        <strong className="text-emerald-800 font-bold block">+{postWeanGainRate} Kg/día</strong>
                        <span className="text-[8px] text-slate-402">Calibración {growthDays} días</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 3: CAPRINOS Y OVINOS (CABRAS/OVEJAS) */}
      {activeSegment === 'caprino_ovino' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
            <h4 className="font-poppins font-bold text-slate-850 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-800" />
              Cargar Control de Caprino / Ovino
            </h4>

            <form onSubmit={handleSmallRuminantSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <button
                  type="button"
                  onClick={() => { setSrSpecies('Cabra'); setSrBreed('Alpina'); }}
                  className={`py-2 rounded border font-bold ${srSpecies === 'Cabra' ? 'bg-orange-50 border-orange-300 text-orange-850' : 'bg-white border-slate-205 text-slate-500'}`}
                >
                  Cabra (Caprino)
                </button>
                <button
                  type="button"
                  onClick={() => { setSrSpecies('Oveja'); setSrBreed('Santa Inés'); }}
                  className={`py-2 rounded border font-bold ${srSpecies === 'Oveja' ? 'bg-orange-50 border-orange-300 text-orange-850' : 'bg-white border-slate-205 text-slate-500'}`}
                >
                  Oveja (Ovino)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 font-semibold text-xs">
                <div className="space-y-1">
                  <label className="text-slate-650 block">Raza o Variedad</label>
                  <input type="text" className="w-full border p-2 rounded-lg font-medium" value={srBreed} onChange={(e) => setSrBreed(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-650 block">ID Tag / Arete Cabrito</label>
                  <input type="text" placeholder="Ej: C-54, O-12" className="w-full border p-2 rounded-lg font-bold font-mono" value={srTag} onChange={(e) => setSrTag(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-650 block">Tipo de Acción / Control</label>
                <select
                  value={srActionType}
                  onChange={(e) => {
                    const act = e.target.value as any;
                    setSrActionType(act);
                    if (act === 'Leche') setSrValue(3.2);
                    else if (act === 'Pesaje') setSrValue(35);
                    else if (act === 'Parto Múltiple') setSrValue(2);
                  }}
                  className="w-full border p-2 rounded-lg bg-white"
                >
                  <option value="Leche">Producción de Leche (Litros/kg diarios)</option>
                  <option value="Pesaje">Pesaje de Control (Crecentamiento Kg)</option>
                  <option value="Parto Múltiple">Parto Múltiple (Crías nacidas por parto)</option>
                </select>
              </div>

              {/* Dynamic input label based on action type selection */}
              <div className="space-y-1 p-3 bg-orange-50/40 border border-orange-100 rounded-lg">
                <label className="text-slate-650 block font-bold">
                  {srActionType === 'Leche' ? 'Rendimiento de Leche (Litros)' : srActionType === 'Pesaje' ? 'Peso Registrado (Kg)' : 'Cantidad de crías nacidas'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full border p-2 rounded bg-white mt-1.5 font-bold font-mono text-center font-bold"
                  value={srValue}
                  onChange={(e) => setSrValue(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-605 block">Fecha de Registro</label>
                <input type="date" className="w-full border p-2 rounded-lg" value={srDate} onChange={(e) => setSrDate(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Observaciones extras</label>
                <input type="text" className="w-full border p-2 rounded-lg font-medium" value={srNotes} onChange={(e) => setSrNotes(e.target.value)} placeholder="Ej: Nacimiento viable de cabritos machos..." />
              </div>

              <button type="submit" className="w-full bg-slate-905 bg-slate-900 border text-white font-bold py-2 rounded-lg text-xs hover:bg-slate-950 transition-all">
                Cargar Registro de Rumiante
              </button>
            </form>
          </div>

          {/* Right listing history logs of small ruminants */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm flex justify-between items-center bg-orange-50/10">
              <span>Bitácora de Métricas Caprino-Ovinas</span>
              <span className="text-[10px] bg-orange-100 text-orange-850 px-2.5 py-0.5 rounded font-bold font-mono">Pequeños Rumiantes</span>
            </div>

            <div className="divide-y divide-slate-100 font-semibold text-xs text-slate-705 max-h-[460px] overflow-y-auto">
              {smallRuminantLogs.map(item => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-50 transition-all font-semibold gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 text-[9px] rounded font-bold ${
                        item.species === 'Cabra' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {item.species}s ({item.breed})
                      </span>
                      <strong className="text-slate-800 font-bold">Tag #{item.tag}</strong>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Línea: <strong className="text-slate-850">{item.actionType}</strong> - {
                        item.actionType === 'Leche' ? `${item.milkYield} Litros de ordeño` : item.actionType === 'Pesaje' ? `${item.weight} Kg de peso` : `${item.prolificacyCount} crías nacidas (Parto múltiple)`
                      }
                    </p>
                    <p className="text-[10.5px] italic text-slate-450">"{item.notes}"</p>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function postWeanGainRateCalc(cb: Animal): number {
  const growthDays = 540 - 205; // 335 days
  const netGain = (cb.weight540 || 390) - (cb.weaningWeight205 || 205);
  return Number((netGain / growthDays).toFixed(2));
}
