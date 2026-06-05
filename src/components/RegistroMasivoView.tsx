/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Milk, Save, Plus, HelpCircle, Check, Play } from 'lucide-react';
import { Animal, MilkLog } from '../types';

interface RegistroMasivoLecheProps {
  animals: Animal[];
  milkLogs: MilkLog[];
  onAddMilkLogs: (logs: Omit<MilkLog, 'id'>[]) => void;
}

export default function RegistroMasivoView({ animals, milkLogs, onAddMilkLogs }: RegistroMasivoLecheProps) {
  // Select active milking cows (Vacas in lactation status)
  const milkingCows = animals.filter(a => a.category === 'Vaca' && a.lactationStatus === 'En Lactancia');

  const [dateField, setDateField] = useState<string>('2026-06-03');
  
  // Set initial grid entry forms
  // Initialize morning/afternoon records
  const [milkGrid, setMilkGrid] = useState<{[cowId: string]: { morning: string, afternoon: string }}>({});

  // Populate grid form with default estimates based on previous averages or custom templates
  const handleLoadDefaults = () => {
    const initialGrid: typeof milkGrid = {};
    milkingCows.forEach(cow => {
      // Find average or generic numbers
      initialGrid[cow.id] = {
        morning: '8.5',
        afternoon: '6.0'
      };
    });
    setMilkGrid(initialGrid);
  };

  const handleFieldChange = (cowId: string, period: 'morning' | 'afternoon', val: string) => {
    setMilkGrid(prev => ({
      ...prev,
      [cowId]: {
        ...prev[cowId],
        [period]: val
      }
    }));
  };

  const calculateSum = () => {
    let sum = 0;
    Object.keys(milkGrid).forEach(cowId => {
      const morn = parseFloat(milkGrid[cowId]?.morning || '0');
      const aft = parseFloat(milkGrid[cowId]?.afternoon || '0');
      sum += (morn + aft);
    });
    return sum;
  };

  const handleBatchSave = (e: React.FormEvent) => {
    e.preventDefault();
    const recordsToSave: Omit<MilkLog, 'id'>[] = [];
    
    milkingCows.forEach(cow => {
      const morningVal = parseFloat(milkGrid[cow.id]?.morning || '0');
      const afternoonVal = parseFloat(milkGrid[cow.id]?.afternoon || '0');
      
      if (morningVal > 0 || afternoonVal > 0) {
        recordsToSave.push({
          animalId: cow.id,
          tag: cow.tag,
          date: dateField,
          morningYield: morningVal,
          afternoonYield: afternoonVal,
          totalYield: morningVal + afternoonVal
        });
      }
    });

    if (recordsToSave.length === 0) {
      return alert("Debe ingresar rendimientos numéricos mayores a cero para al menos una vaca.");
    }

    onAddMilkLogs(recordsToSave);
    alert(`Se guardaron exitosamente ${recordsToSave.length} registros de ordeño masivo para la fecha ${dateField}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Introduction Guidance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-poppins font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Milk className="w-5 h-5 text-indigo-600" />
            Planilla de Ordeño Rápido (Control Masivo Diario)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Permite ingresar de una vez las pesas de leche individuales AM y PM para todas las vacas registradas como 'En Lactancia'.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleLoadDefaults}
            className="flex-1 md:flex-initial text-center bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-indigo-100 transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-4.5 h-4.5" />
            Cargar Estimados (8.5 AM / 6.0 PM)
          </button>
        </div>
      </div>

      {/* Main entry spreadsheet */}
      <form onSubmit={handleBatchSave} className="bg-white rounded-xl border border-slate-205 overflow-hidden shadow-xs">
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 font-semibold text-xs">
            <label className="text-slate-500 font-bold">Fecha del Ordeño:</label>
            <input
              type="date"
              required
              value={dateField}
              onChange={(e) => setDateField(e.target.value)}
              className="border border-slate-200 bg-white rounded-md p-1.5 font-medium outline-none text-slate-700"
            />
          </div>

          <div className="text-right text-xs font-semibold text-slate-600 bg-indigo-50/50 border border-indigo-100/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span>Suma Total Planilla:</span>
            <strong className="text-indigo-800 font-bold text-sm font-mono">{calculateSum().toFixed(1)} Kg de Leche</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-500 font-medium">
            <thead className="text-[10px] text-slate-400 uppercase font-mono bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4">Arete</th>
                <th className="p-4">Nombre de la Vaca</th>
                <th className="p-4">Raza</th>
                <th className="p-4">Lote / Potrero</th>
                <th className="p-4 bg-indigo-50/20 text-indigo-900">Ordeño Mañana AM (Kg)</th>
                <th className="p-4 bg-amber-50/20 text-amber-900">Ordeño Tarde PM (Kg)</th>
                <th className="p-4 text-slate-800">Total Vaca (Kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {milkingCows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No hay vacas registradas con estado "En Lactancia" en el inventario. Cambie el estado de producción de sus hembras adultas en el módulo "Gestión de Animales" para habilitarlas aquí.
                  </td>
                </tr>
              ) : (
                milkingCows.map(cow => {
                  const cowGrid = milkGrid[cow.id] || { morning: '', afternoon: '' };
                  const morningNum = parseFloat(cowGrid.morning) || 0;
                  const afternoonNum = parseFloat(cowGrid.afternoon) || 0;
                  const individualTotal = morningNum + afternoonNum;

                  return (
                    <tr key={cow.id} className="hover:bg-slate-50/60 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-900">#{cow.tag}</td>
                      <td className="p-4 text-slate-800">{cow.name}</td>
                      <td className="p-4 text-slate-500 font-medium">{cow.breed}</td>
                      <td className="p-4 text-slate-400 font-medium">{cow.lot}</td>
                      
                      {/* AM weight input */}
                      <td className="p-3 bg-indigo-50/10">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="40"
                          placeholder="0.0"
                          value={cowGrid.morning}
                          onChange={(e) => handleFieldChange(cow.id, 'morning', e.target.value)}
                          className="w-28 border border-slate-200 bg-white rounded-md p-1.5 font-bold text-center text-slate-800 outline-none focus:border-indigo-500 font-mono"
                        />
                      </td>

                      {/* PM weight input */}
                      <td className="p-3 bg-amber-50/10">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="40"
                          placeholder="0.0"
                          value={cowGrid.afternoon}
                          onChange={(e) => handleFieldChange(cow.id, 'afternoon', e.target.value)}
                          className="w-28 border border-slate-200 bg-white rounded-md p-1.5 font-bold text-center text-slate-800 outline-none focus:border-amber-500 font-mono"
                        />
                      </td>

                      {/* Line Sum yield */}
                      <td className="p-4 font-mono font-bold text-slate-800 text-sm">
                        {individualTotal.toFixed(1)} <span className="text-[10px] text-slate-400 font-medium font-sans">Kg</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {milkingCows.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 shadow-sm transition-all text-sm tracking-wide"
            >
              <Save className="w-4 h-4" />
              Guardar Todos los Registros
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
