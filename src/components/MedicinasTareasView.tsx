/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sliders, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Activity, 
  Layers, 
  CheckSquare, 
  Square,
  Clock,
  Briefcase
} from 'lucide-react';
import { Medicine, TreatmentLog, Task, Animal } from '../types';

interface MedicinasTareasProps {
  subSection: 'medicinas' | 'tareas';
  animals: Animal[];
  medicines: Medicine[];
  treatmentLogs: TreatmentLog[];
  tasks: Task[];
  onAddTreatment: (log: Omit<TreatmentLog, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function MedicinasTareasView({
  subSection,
  animals,
  medicines,
  treatmentLogs,
  tasks,
  onAddTreatment,
  onAddTask,
  onToggleTask,
  onDeleteTask
}: MedicinasTareasProps) {
  
  // --- MEDICINES TAB STATES & LOGIC ---
  const [formCowId, setFormCowId] = useState('');
  const [formMedicineId, setFormMedicineId] = useState('');
  const [formDose, setFormDose] = useState('');
  const [formDate, setFormDate] = useState('2026-06-03');
  const [formNotes, setFormNotes] = useState('');

  // --- TASKS TAB STATES & LOGIC ---
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-06-03');
  const [taskCategory, setTaskCategory] = useState<'Vacunación' | 'Tratamiento' | 'Servicio' | 'Ordeño' | 'Otros'>('Vacunación');
  const [taskPriority, setTaskPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');

  const handleTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCowId || !formMedicineId) return alert('Por favor complete los campos obligatorios (*).');

    const targetAnimal = animals.find(a => a.id === formCowId);
    const targetMedicine = medicines.find(m => m.id === formMedicineId);
    if (!targetAnimal || !targetMedicine) return;

    // Calculate withdrawal expiration date
    const treatDate = new Date(formDate);
    treatDate.setDate(treatDate.getDate() + (targetMedicine.withdrawalPeriod || 0));
    const finRetiroStr = treatDate.toISOString().split('T')[0];

    onAddTreatment({
      animalId: formCowId,
      tag: targetAnimal.tag,
      medicineId: formMedicineId,
      medicineName: targetMedicine.name,
      dose: formDose || 'Dosis recomendada',
      date: formDate,
      withdrawalEnd: finRetiroStr,
      notes: formNotes
    });

    alert(`Tratamiento cargado con éxito. Período de retiro expira el ${finRetiroStr} (${targetMedicine.withdrawalPeriod} días).`);
    
    // reset
    setFormCowId('');
    setFormMedicineId('');
    setFormDose('');
    setFormNotes('');
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return alert('Escriba un título para la tarea.');

    onAddTask({
      title: taskTitle,
      dueDate: taskDueDate,
      completed: false,
      category: taskCategory,
      priority: taskPriority
    });

    alert('Tarea agendada en el calendario de la finca.');
    setTaskTitle('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* SECTION 1: MEDICINAS E INVENTARIO */}
      {subSection === 'medicinas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form to Apply treatment */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              Aplicar Fármaco Individual
            </h4>

            <form onSubmit={handleTreatmentSubmit} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600 block">Animal Tratado *</label>
                <select
                  required
                  value={formCowId}
                  onChange={(e) => setFormCowId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="">-- Seleccionar Ganado --</option>
                  {animals.map(a => (
                    <option key={a.id} value={a.id}>Arete #{a.tag} - {a.name} ({a.category})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Medicamento Veterinario *</label>
                <select
                  required
                  value={formMedicineId}
                  onChange={(e) => setFormMedicineId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="">-- Seleccionar Remedio --</option>
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Retiro: {m.withdrawalPeriod} d | Principio: {m.activeIngredient})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Dosis y Vía de Administración</label>
                <input
                  type="text"
                  placeholder="Ej: 5 ml Vía Subcutánea (SC)"
                  className="w-full border border-slate-200 p-2 rounded-lg font-medium outline-none"
                  value={formDose}
                  onChange={(e) => setFormDose(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Fecha de Aplicación</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-200 p-2 rounded-lg"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Observaciones Clínicas / Diagnóstico</label>
                <textarea
                  placeholder="Diagnóstico: Fiebre de lodo, parásitos internos, herida de ubre posterior."
                  className="w-full border border-slate-200 p-2 rounded-lg font-medium outline-none h-16 resize-none"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-850 hover:bg-emerald-900 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs text-xs tracking-wide"
              >
                <Sliders className="w-4 h-4" />
                Registrar Tratamiento
              </button>
            </form>
          </div>

          {/* Right Columns: Medicines Inventory alongside Logs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Medicine list inventory */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Inventario Fármaco de Corral</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-2 py-0.5">Fórmula local</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                {medicines.map(med => (
                  <div key={med.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-start gap-2.5">
                    <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg mt-0.5"><Activity className="w-4 h-4" /></div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 leading-tight">{med.name}</p>
                      <span className="text-[10px] text-slate-400 block font-normal tracking-wide">Principio: {med.activeIngredient}</span>
                      <p className="text-[11px] mt-1 text-emerald-700">Stock: <strong className="font-bold">{med.stock} {med.unit}</strong></p>
                      <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block">
                        Retiro: {med.withdrawalPeriod} d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatment historical Logs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm bg-slate-50 flex items-center justify-between">
                <span>Tratamientos Aplicados en Campo</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">Vigilancia de Ordeño</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto font-semibold text-xs text-slate-700">
                {treatmentLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs text-[11px]">
                    No hay tratamientos veterinarios registrados.
                  </div>
                ) : (
                  [...treatmentLogs].reverse().map(log => {
                    const todayTime = new Date('2026-06-03').getTime();
                    const retreatTime = new Date(log.withdrawalEnd).getTime();
                    const isRetreatInEffect = retreatTime >= todayTime;

                    return (
                      <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-slate-50/50 transition-all gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-800 font-bold">Vaca / Macho #{log.tag}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{log.medicineName}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-tight">Dosis: <strong className="text-slate-700 font-semibold">{log.dose}</strong> | Diagnóstico: <span className="text-slate-450 italic">"{log.notes}"</span></p>
                          <span className="text-[10px] text-slate-400 block font-normal font-mono">Aplicado el: {log.date}</span>
                        </div>

                        <div className="text-right flex flex-col justify-between items-end">
                          <span className="text-[10px] text-slate-400 font-mono">Expira retiro: {log.withdrawalEnd}</span>
                          {isRetreatInEffect ? (
                            <span className="text-[9px] bg-rose-50 border border-rose-105 text-rose-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 mt-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                              Retiro Leche Activo
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md mt-1.5 flex items-center gap-0.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Leche Liberada
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
      )}

      {/* SECTION 2: TAREAS, ALERTAS Y CALENDARIO */}
      {subSection === 'tareas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Task Calendar Adder */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-700" />
              Agendar Tarea de Corral
            </h4>

            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600 block">Título de la actividad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Vacunación Aftosa, Chequeo tacto"
                  className="w-full border border-slate-200 p-2 rounded-lg font-medium outline-none"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">Categoría Ganadera</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="w-full border border-slate-205 rounded-lg p-2 font-medium bg-white"
                >
                  <option value="Vacunación">Vacunación Masiva / Estacional</option>
                  <option value="Tratamiento">Tratamiento Veterinario</option>
                  <option value="Servicio">Servicios / Palpaciones / IA</option>
                  <option value="Ordeño">Control de Leche</option>
                  <option value="Otros">Mantenimiento / Compras finca</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-600 block">Prioridad</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full border border-slate-202 rounded-lg p-2 font-medium bg-white"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 block">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 p-2 rounded-lg"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-705 hover:bg-indigo-805 text-white bg-emerald-800 hover:bg-emerald-900 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm text-xs"
              >
                <Plus className="w-4 h-4" />
                Agendar Tarea
              </button>
            </form>
          </div>

          {/* Right: Task manager check board block */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm flex justify-between items-center">
              <span>Calendario de Actividades Coordinadas</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded font-bold font-mono">
                {tasks.filter(t => !t.completed).length} Pendientes
              </span>
            </div>

            <div className="divide-y divide-slate-150 max-h-[440px] overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Sin tareas en el calendario. ¡Todo bajo control!
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={`p-4 flex items-center justify-between transition-all hover:bg-slate-50/50 ${task.completed ? 'bg-slate-50/20 opacity-70' : ''}`}>
                    <div className="flex items-center gap-3">
                      {/* Check Toggler */}
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          task.completed ? 'bg-emerald-800 border-emerald-900 text-white' : 'bg-white border-slate-205 text-slate-400 hover:border-emerald-500 shadow-xs'
                        }`}
                      >
                        {task.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <div className="w-2.5 h-2.5"></div>}
                      </button>

                      <div className="text-xs font-semibold">
                        <p className={`font-bold transition-all ${task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${
                            task.priority === 'Alta' 
                              ? 'bg-rose-100 text-rose-800' 
                              : task.priority === 'Media' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-sm font-medium">{task.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-semibold text-xs">
                      <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Límite: {task.dueDate}
                      </span>
                      <button 
                        onClick={() => {
                          if (confirm('¿Eliminar esta tarea de su agenda?')) onDeleteTask(task.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
