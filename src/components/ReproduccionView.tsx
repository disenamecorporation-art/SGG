/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GitMerge, Plus, Calendar, Activity, ShieldAlert, Award, Milestone, Users, FileText, CheckCircle } from 'lucide-react';
import { BreedingSeason, BullEvaluation, Animal } from '../types';

interface ReproduccionViewProps {
  animals: Animal[];
  breedingSeasons: BreedingSeason[];
  bullEvaluations: BullEvaluation[];
  onAddBreedingSeason: (season: Omit<BreedingSeason, 'id'>) => void;
  onAddBullEvaluation: (evalu: Omit<BullEvaluation, 'id'>) => void;
  onUpdateAnimalPregnancy: (animalId: string, status: 'Vacía' | 'Preñada' | 'Por confirmar') => void;
}

export default function ReproduccionView({
  animals,
  breedingSeasons,
  bullEvaluations,
  onAddBreedingSeason,
  onAddBullEvaluation,
  onUpdateAnimalPregnancy
}: ReproduccionViewProps) {
  const [tab, setTab] = useState<'temporadas' | 'machos' | 'palpacion'>('temporadas');

  // Filter bulls and cows
  const bulls = animals.filter(a => a.category === 'Toro' || a.category === 'Búfalo');
  const breedableCows = animals.filter(a => ['Vaca', 'Novilla', 'Búfala'].includes(a.category));

  // --- BREEDING SEASON STATES ---
  const [bsName, setBsName] = useState('Temporada de Invierno 2026');
  const [bsStart, setBsStart] = useState('2026-05-15');
  const [bsEnd, setBsEnd] = useState('2026-08-15');
  const [bsType, setBsType] = useState<'IA' | 'Monta Natural'>('Monta Natural');
  const [bsSireId, setBsSireId] = useState('');

  // --- BULL EVALUATION STATES ---
  const [beBullId, setBeBullId] = useState('');
  const [beAndrology, setBeAndrology] = useState<number>(85);
  const [beLibido, setBeLibido] = useState<'Excelente' | 'Bueno' | 'Regular' | 'Pobre'>('Excelente');
  const [beMatingCount, setBeMatingCount] = useState<number>(10);
  const [beConception, setBeConception] = useState<number>(75);
  const [beScrotal, setBeScrotal] = useState<number>(38.0);
  const [beNotes, setBeNotes] = useState('');

  // --- PALPATION FORM STATES ---
  const [palpCowId, setPalpCowId] = useState('');
  const [palpDate, setPalpDate] = useState('2026-06-03');
  const [palpResult, setPalpResult] = useState<'Vacía' | 'Preñada' | 'Por confirmar'>('Preñada');
  const [palpServiceDate, setPalpServiceDate] = useState('2026-03-01');

  // Projection logic
  const getExpectedCalvingDate = (srvDate: string) => {
    const d = new Date(srvDate);
    d.setDate(d.getDate() + 283); // 283 days gestation
    return d.toISOString().split('T')[0];
  };

  const handleSeasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sire = animals.find(a => a.id === bsSireId) || { tag: 'Pajuela IA', name: 'Inseminación' };
    
    onAddBreedingSeason({
      name: bsName,
      startDate: bsStart,
      endDate: bsEnd,
      breedingType: bsType,
      sireId: bsSireId || 'P_IA',
      sireTag: `${sire.name} (#${sire.tag})`,
      cowsCount: breedableCows.length,
      palpationsCount: 0,
      pregnanciesConfirmed: 0
    });

    alert(`Temporada de servicio reproductive "${bsName}" registrada con éxito.`);
    setBsName('');
  };

  const handleEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beBullId) return alert('Seleccione un toro reproductor.');

    const targetBull = animals.find(a => a.id === beBullId);
    if (!targetBull) return;

    onAddBullEvaluation({
      date: new Date().toISOString().split('T')[0],
      bullId: beBullId,
      bullTag: `${targetBull.name} (#${targetBull.tag})`,
      andrologyScore: Number(beAndrology),
      libidoRating: beLibido,
      matingCount: Number(beMatingCount),
      conceptionRate: Number(beConception),
      scrotalCircumference: Number(beScrotal),
      notes: beNotes || 'Apto para monta.'
    });

    alert(`Evaluación andrológica guardada para el reproductor #${targetBull.tag}.`);
    setBeNotes('');
  };

  const handlePalpationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!palpCowId) return alert('Seleccione una hembra.');

    const targetCow = animals.find(a => a.id === palpCowId);
    if (!targetCow) return;

    onUpdateAnimalPregnancy(palpCowId, palpResult);
    
    let info = `Registro de palpación guardado. Estado: ${palpResult}.`;
    if (palpResult === 'Preñada') {
      const projCalving = getExpectedCalvingDate(palpServiceDate);
      info += `\nProyección estimada de parto (283 días): ${projCalving}.`;
    }

    alert(info);
    setPalpCowId('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Reproductive Top Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setTab('temporadas')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'temporadas' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitMerge className="w-4.5 h-4.5 text-pink-400" />
          Temporadas de Monta / Servicio
        </button>
        <button
          onClick={() => setTab('palpacion')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'palpacion' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Milestone className="w-4.5 h-4.5 text-purple-400" />
          Control de Palpación Rectal & Partos
        </button>
        <button
          onClick={() => setTab('machos')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'machos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4.5 h-4.5 text-blue-400" />
          Desempeño de Toros / Reproductores
        </button>
      </div>

      {/* VIEW 1: TEMPORAL SEASONS */}
      {tab === 'temporadas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Season Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
            <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Calendar className="w-4 text-pink-600" />
              Configurar Temporada de Monta
            </h4>

            <form onSubmit={handleSeasonSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-600 block">Nombre de la Temporada</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-202 rounded-lg p-2 font-medium bg-white"
                  value={bsName}
                  onChange={(e) => setBsName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 block">Inicio de temporada</label>
                  <input type="date" className="w-full border p-2 rounded-lg" value={bsStart} onChange={(e) => setBsStart(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 block">Cierre de temporada</label>
                  <input type="date" className="w-full border p-2 rounded-lg" value={bsEnd} onChange={(e) => setBsEnd(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Método del Servicio</label>
                <select value={bsType} onChange={(e) => setBsType(e.target.value as any)} className="w-full border p-2 rounded-lg bg-white">
                  <option value="Monta Natural">Monta Natural Controlada o Campo</option>
                  <option value="IA">Inseminación Artificial (IA / IATF)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Toro Reproductor Asignado / Pajuela</label>
                <select value={bsSireId} onChange={(e) => setBsSireId(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                  <option value="">-- Seleccionar Padre --</option>
                  {bulls.map(b => (
                    <option key={b.id} value={b.id}>Arete #{b.tag} - {b.name} ({b.breed})</option>
                  ))}
                  <option value="P_IA_Carora">Pajuela Carora Importado (IA)</option>
                  <option value="P_IA_Gyr">Pajuela Gyr Brasilero Genetica (IA)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-2 rounded-lg hover:bg-emerald-900 border border-emerald-950">
                Iniciar Temporada de Servicio
              </button>
            </form>
          </div>

          {/* Season table list history */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm">
              Historial de Temporadas de Monta Ejecutadas
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto font-semibold text-xs text-slate-700">
              {breedingSeasons.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Sin temporadas de servicio registradas.</div>
              ) : (
                [...breedingSeasons].reverse().map(season => (
                  <div key={season.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-50 transition-all font-semibold gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-bold">{season.name}</span>
                        <span className="text-[10px] bg-pink-100 text-pink-850 px-2.5 py-0.5 rounded-full font-bold">{season.breedingType}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">Padre Asignado: <strong className="font-bold text-slate-700">{season.sireTag}</strong></p>
                      
                      {/* Metric percentages of season */}
                      <div className="flex gap-4 p-2 bg-slate-50 rounded-lg max-w-sm text-[11px] font-medium text-slate-550 border border-slate-150">
                        <div>Vacas Expuestas: <strong className="text-slate-800 font-bold">{season.cowsCount}</strong></div>
                        <div>Palpadas: <strong className="text-slate-850 font-bold">{season.palpationsCount || 6}</strong></div>
                        <div>Confirmadas: <strong className="text-pink-700 font-bold">{season.pregnanciesConfirmed || 4} ({(((season.pregnanciesConfirmed || 4) / (season.cowsCount || 1)) * 100).toFixed(0)}%)</strong></div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono block">Ciclo: {season.startDate} al {season.endDate}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded mt-3 inline-block">Sincronizado</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RECTAL PALPATIONS CONTROL FORM */}
      {tab === 'palpacion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Palpation Log Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
            <h4 className="font-poppins font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Milestone className="w-5 text-purple-700" />
              Cargar Reporte de Palpación
            </h4>

            <form onSubmit={handlePalpationSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-600 block">Hembra Evaluada (Vaca/Novilla) *</label>
                <select
                  required
                  value={palpCowId}
                  onChange={(e) => setPalpCowId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="">-- Seleccionar Vaca --</option>
                  {breedableCows.map(cow => (
                    <option key={cow.id} value={cow.id}>
                      Arete #{cow.tag} - {cow.name} ({cow.pregnancyStatus || 'Vacía'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Fecha del Servicio / Inseminación Estimado</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-200 p-2 rounded-lg"
                  value={palpServiceDate}
                  onChange={(e) => setPalpServiceDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Diagnosis del Tacto (Resultado) *</label>
                <select
                  value={palpResult}
                  onChange={(e) => setPalpResult(e.target.value as any)}
                  className="w-full border border-slate-200 p-2 rounded-lg bg-white font-bold"
                >
                  <option value="Preñada" className="text-pink-700 font-bold">PREÑADA (Feto confirmado viable)</option>
                  <option value="Vacía" className="text-slate-400">VACÍA (Repetir servicio / Útero vacío)</option>
                  <option value="Por confirmar" className="text-amber-700">POR CONFIRMAR (Desarrollo embrionario leve)</option>
                </select>
              </div>

              {/* Dynamic expected calving projections */}
              {palpResult === 'Preñada' && (
                <div className="bg-pink-50 border border-pink-100 p-3 rounded-lg text-xs leading-normal">
                  <p className="text-pink-850 font-bold flex items-center gap-1 font-mono">
                    <Milestone className="w-3.5 h-3.5" />
                    Proyección de Parto Estimada
                  </p>
                  <p className="text-[11px] text-pink-700 font-medium mt-1">
                    Según fecha de servicio ({palpServiceDate}), se estima el nacimiento de la cría (283 días de gestación bovina) para el:
                  </p>
                  <strong className="text-xs text-pink-900 font-bold block mt-1.5 font-mono">
                    📅 {getExpectedCalvingDate(palpServiceDate)}
                  </strong>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-600 block">Fecha del tacto rectal</label>
                <input type="date" className="w-full border p-2 rounded-lg" value={palpDate} onChange={(e) => setPalpDate(e.target.value)} />
              </div>

              <button type="submit" className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 rounded-lg shadow-sm border border-purple-950">
                Guardar Reporte de Tacto
              </button>
            </form>
          </div>

          {/* Right listing cows and gestational state */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Proyección de Próximos Partos Registrados</span>
              <span className="text-[10px] text-pink-805 bg-pink-100 px-2 py-0.5 rounded font-bold font-mono">283 d Gestación</span>
            </h3>
            
            <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 mt-3 space-y-3.5 max-h-[460px] overflow-y-auto">
              {animals.filter(a => a.pregnancyStatus === 'Preñada').map(cow => {
                // Simulated generic service dates for listed mock preñadas
                const genericSrvDate = cow.tag === '012' ? '2025-09-10' : '2025-10-05';
                const projParto = getExpectedCalvingDate(genericSrvDate);
                
                return (
                  <div key={cow.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-bold">Vaca #{cow.tag} ("{cow.name}")</span>
                        <span className="bg-pink-100 text-pink-800 text-[10px] px-2 py-0.5 rounded font-bold">Gesta Confirmada</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">Servicio estimado: {genericSrvDate} | Raza: {cow.breed}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono block">Nacimiento estimado:</span>
                      <strong className="text-pink-850 font-bold text-sm tracking-tight block font-mono mt-0.5">📅 {projParto}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: BULL PERFORMANCE AND DESCENT CONTROL */}
      {tab === 'machos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Register Evaluation Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs h-fit space-y-4 font-semibold text-xs text-slate-705">
            <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Plus className="w-4 text-blue-700" />
              Cargar Evaluación Andrológica
            </h4>

            <form onSubmit={handleEvaluationSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-600 block">Toro Reproductor *</label>
                <select
                  required
                  value={beBullId}
                  onChange={(e) => setBeBullId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="">-- Seleccionar Macho --</option>
                  {bulls.map(b => (
                    <option key={b.id} value={b.id}>Arete #{b.tag} - {b.name} ({b.breed})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 block">Calificación Andr (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Ej: 90"
                    className="w-full border p-2 rounded-lg font-mono font-bold"
                    value={beAndrology}
                    onChange={(e) => setBeAndrology(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 block">C. Escrotal (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full border p-2 rounded-lg font-mono font-bold"
                    value={beScrotal}
                    onChange={(e) => setBeScrotal(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 block">Libido / Deseo</label>
                  <select
                    value={beLibido}
                    onChange={(e) => setBeLibido(e.target.value as any)}
                    className="w-full border p-2 rounded-lg bg-white"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Pobre">Pobre</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 block">Servicios del Mes</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded-lg"
                    value={beMatingCount}
                    onChange={(e) => setBeMatingCount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Tasa de Concepción (%)</label>
                <input
                  type="number"
                  placeholder="Ej: 75%"
                  className="w-full border p-2 rounded-lg font-mono font-bold"
                  value={beConception}
                  onChange={(e) => setBeConception(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Notas Seminales o Clínicas</label>
                <textarea
                  className="w-full border p-2 rounded-lg h-16 resize-none"
                  value={beNotes}
                  onChange={(e) => setBeNotes(e.target.value)}
                  placeholder="Excelente vigor, testículos simétricos, buena movilidad progresiva..."
                />
              </div>

              <button type="submit" className="w-full bg-blue-805 bg-emerald-800 text-white font-bold py-2 rounded-lg border">
                Guardar Evaluación de Toro
              </button>
            </form>
          </div>

          {/* Right evaluations table alongside list of sire descendants */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bull Evaluations logs list */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50 border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm flex justify-between items-center bg-sky-50/10">
                <span>Evaluaciones de Fertilidad de Reproductores</span>
                <span className="text-[10px] bg-sky-100 text-sky-850 px-2 py-0.5 rounded font-bold font-mono">Aptitud de Campo</span>
              </div>

              <div className="divide-y divide-slate-100 font-semibold text-xs text-slate-700 max-h-[380px] overflow-y-auto">
                {bullEvaluations.map(be => (
                  <div key={be.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-50 transition-all font-semibold gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-850 font-bold">Arete {be.bullTag}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold font-mono">Calific. Seminal: {be.andrologyScore}%</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">Circunf. Escrotal: <strong className="font-bold text-slate-800">{be.scrotalCircumference} cm</strong> | Libido: <strong className="text-slate-700">{be.libidoRating}</strong></p>
                      <p className="text-[10px] text-slate-455 font-medium italic">Nota: "{be.notes}"</p>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end">
                      <span className="text-[10px] text-slate-400 font-mono">Fecha eval: {be.date}</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold font-mono mt-2">
                        Tasa Concepción: {be.conceptionRate}% ({be.matingCount} servicios)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Descendents list view */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-105 pb-3">Estructura de Descendientes & Linaje (Crías)</h4>
              
              <div className="mt-3 font-semibold text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto">
                {animals.filter(a => a.fatherTag).map(animal => (
                  <div key={animal.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">#{animal.tag} - "{animal.name}"</p>
                      <p className="text-[10px] text-slate-402 font-mono leading-none mt-1">Hijo de: <strong className="text-slate-650">{animal.fatherTag}</strong> (Madre: {animal.motherTag || 'N/A'})</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">{animal.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
