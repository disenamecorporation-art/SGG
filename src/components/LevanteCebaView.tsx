/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, Scale, Plus, BarChart2, Award, Calendar, ChevronRight } from 'lucide-react';
import { Animal, WeightRecord } from '../types';

interface LevanteCebaProps {
  animals: Animal[];
  weightRecords: WeightRecord[];
  onAddWeightRecord: (record: Omit<WeightRecord, 'id'>) => void;
  onUpdateAnimalWeight: (animalId: string, currentWeight: number) => void;
}

export default function LevanteCebaView({ animals, weightRecords, onAddWeightRecord, onUpdateAnimalWeight }: LevanteCebaProps) {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
  const [formWeight, setFormWeight] = useState<number>(400);
  const [formDate, setFormDate] = useState<string>('2026-06-03');
  const [activeTab, setActiveTab] = useState<'records' | 'trends'>('records');

  // Filter growing and fattening classes
  const cebaClasses = ['Novillo', 'Becerro', 'Novilla', 'Becerra'];
  const growingAnimals = animals.filter(a => cebaClasses.includes(a.category));

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId) return alert('Por favor seleccione un animal.');

    const targetAnimal = animals.find(a => a.id === selectedAnimalId);
    if (!targetAnimal) return;

    // Retrieve previous logs for ADG calculation
    const animalLogs = weightRecords
      .filter(w => w.animalId === selectedAnimalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let computedAdg = 0.0;
    if (animalLogs.length > 0) {
      const prevLog = animalLogs[0];
      const weightDiff = formWeight - prevLog.weight;
      const daysDiff = Math.max(
        1, 
        Math.round((new Date(formDate).getTime() - new Date(prevLog.date).getTime()) / (1000 * 60 * 60 * 24))
      );
      computedAdg = Number((weightDiff / daysDiff).toFixed(2));
    } else {
      // Base calculated against animal's birth weight
      const birthWeight = targetAnimal.birthWeight || 35;
      const weightDiff = formWeight - birthWeight;
      const daysDiff = Math.max(
        1,
        Math.round((new Date(formDate).getTime() - new Date(targetAnimal.birthDate).getTime()) / (1000 * 60 * 60 * 24))
      );
      computedAdg = Number((weightDiff / daysDiff).toFixed(2));
    }

    onAddWeightRecord({
      animalId: selectedAnimalId,
      tag: targetAnimal.tag,
      date: formDate,
      weight: formWeight,
      adg: computedAdg
    });

    onUpdateAnimalWeight(selectedAnimalId, formWeight);
    alert(`Weigh log registered successfully. calculated ADG: ${computedAdg} Kg/day.`);
    
    // reset
    setFormWeight(400);
  };

  // Get records grouped by date or sorted
  const sortedRecords = [...weightRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ADG index
  const getAdgStatusBadge = (adg: number) => {
    if (adg <= 0) return { label: 'Sin ganancia', class: 'bg-slate-100 text-slate-500' };
    if (adg < 0.5) return { label: 'Bajo Rendimiento', class: 'bg-amber-150 text-amber-800' };
    if (adg < 0.75) return { label: 'Rendimiento Óptimo', class: 'bg-emerald-100 text-emerald-800' };
    return { label: 'Excelente Engorde 🌟', class: 'bg-emerald-800 text-white font-semibold' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Stat row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gradient-to-br from-emerald-950 to-emerald-900 p-6 rounded-2xl text-white shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] text-emerald-300 font-bold uppercase font-mono tracking-wider">Lote de Engorde Ceba</span>
          <p className="text-3xl font-poppins font-bold">{animals.filter(a => a.lot === 'Lote Ceba Novillos').length} <span className="text-xs text-emerald-250 font-medium">Novillos gordos</span></p>
          <span className="text-xs text-emerald-200">Pastoreo rotacional en pastos llaneros</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-emerald-300 font-bold uppercase font-mono tracking-wider">Ganancia Media del Rebaño</span>
          <p className="text-3xl font-poppins font-bold">0.68 <span className="text-xs text-emerald-250 font-medium">Kg / día ADG</span></p>
          <span className="text-xs text-emerald-200">Meta recomendada: {'>'} 0.65 Kg/día</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-emerald-300 font-bold uppercase font-mono tracking-wider">Último Control de Pesaje</span>
          <p className="text-2xl font-poppins font-bold">01 de Junio, 2026</p>
          <span className="text-xs text-emerald-200">Próximo pesaje: programado 01 de Julio</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Weight logger form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
          <form onSubmit={handleWeightSubmit} className="space-y-4">
            <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              Registrar Pesaje de Control
            </h4>

            {/* Select Animal */}
            <div className="space-y-1 text-xs font-semibold">
              <label className="text-slate-600 block">Animal p/ Pesaje (Ceba y Levante) *</label>
              <select
                value={selectedAnimalId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedAnimalId(id);
                  const active = animals.find(a => a.id === id);
                  if (active) setFormWeight(active.currentWeight);
                }}
                className="w-full border border-slate-205 rounded-lg p-2 font-medium bg-white"
              >
                <option value="">-- Seleccionar animal --</option>
                {growingAnimals.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    Arete #{animal.tag} - {animal.name} ({animal.category} | {animal.breed}) - {animal.currentWeight} Kg
                  </option>
                ))}
              </select>
            </div>

            {/* Input Weight */}
            <div className="space-y-1 text-xs font-semibold">
              <label className="text-slate-600 block">Peso Registrado en Romana (Kg) *</label>
              <input
                type="number"
                min="20"
                max="1200"
                required
                value={formWeight}
                onChange={(e) => setFormWeight(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Input Date */}
            <div className="space-y-1 text-xs font-semibold">
              <label className="text-slate-600 block">Fecha del Control de Pesaje</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-850 hover:bg-emerald-900 text-white font-bold py-2 rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Guardar en Romana
            </button>
          </form>
        </div>

        {/* Right column: weights history logs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm bg-slate-50 flex items-center justify-between">
            <span>Historial y Evolución de Pesos Recientes</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">ADG = kg/día</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {sortedRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay pesajes registrados todavía.
              </div>
            ) : (
              sortedRecords.map((rec) => {
                const badg = getAdgStatusBadge(rec.adg);
                return (
                  <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all font-semibold text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-600 border border-slate-200">
                        #{rec.tag}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800 font-bold">Arete #{rec.tag}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded ${badg.class}`}>{badg.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Fecha de pesaje: {rec.date}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{rec.weight} Kg</p>
                      <p className="text-[10px] text-emerald-600 font-mono flex items-center justify-end gap-0.5 mt-0.5">
                        <TrendingUp className="w-3 h-3" />
                        Ganancia: <strong className="font-bold">+{rec.adg} kg/día</strong>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Breeding / Fattening benchmark guidance block */}
      <div className="bg-white rounded-xl border border-slate-205 p-5 mt-4">
        <h3 className="font-poppins font-bold text-slate-800 text-xs uppercase mb-3 flex items-center gap-1.5 font-mono tracking-wider">
          <Award className="w-4 h-4 text-amber-500" />
          Tabla de Referencia ADG (Ganancia Diaria de Peso en Venezuela)
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          La ganancia diaria de peso varía según la alimentación por suplementación, época climática (seca/lluvia) y rusticidad racial (cebúes vs cruzados sintéticos).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
          <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-lg">
            <span className="text-[10px] text-rose-700 uppercase font-mono block">Menor a 0.50 Kg / día</span>
            <p className="text-slate-800 mt-1">Rendimiento Deficiente</p>
            <span className="text-[10px] text-slate-400 font-medium">Revisar carga parasitaria, calidad del pasto o requerimientos minerales.</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-lg">
            <span className="text-[10px] text-amber-700 uppercase font-mono block">0.50 a 0.65 Kg / día</span>
            <p className="text-slate-800 mt-1">Nivel Normal de Campo</p>
            <span className="text-[10px] text-slate-400 font-medium">Pastoreo tradicional de llanura sin suplementos extras o en época seca.</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-lg">
            <span className="text-[10px] text-emerald-700 uppercase font-mono block">Mayor a 0.65 Kg / día</span>
            <p className="text-slate-800 mt-1">Nivel Excelente de Ceba</p>
            <span className="text-[10px] text-slate-400 font-medium">Cruzamientos de vigor híbrido (Brahman x Senepol), buen invierno y sales minerales.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
