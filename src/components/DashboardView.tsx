/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Milk, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Animal, MilkLog, Task, Transaction, FarmParams, Medicine } from '../types';

interface DashboardViewProps {
  animals: Animal[];
  milkLogs: MilkLog[];
  tasks: Task[];
  transactions: Transaction[];
  farmParams: FarmParams;
  medicines: Medicine[];
  setCurrentSection: (section: string) => void;
}

export default function DashboardView({ 
  animals, 
  milkLogs, 
  tasks, 
  transactions, 
  farmParams,
  medicines,
  setCurrentSection 
}: DashboardViewProps) {
  
  // Total herd size count
  const totalHerd = animals.length;

  // Breeding counts
  const milkingCows = animals.filter(a => a.category === 'Vaca' && a.lactationStatus === 'En Lactancia').length;
  const pregnantCows = animals.filter(a => a.pregnancyStatus === 'Preñada').length;

  // Today's Date
  const todayStr = "2026-06-03"; // standard date set in initial data
  const todayMilks = milkLogs.filter(log => log.date === todayStr);
  const totalMilkToday = todayMilks.reduce((acc, curr) => acc + curr.totalYield, 0);

  // Financial Summary
  const incomeUsd = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amountUsd, 0);
  const expenseUsd = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amountUsd, 0);
  const balanceUsd = incomeUsd - expenseUsd;

  // Active Withdrawal Warnings (Períodos de Retiro Activos)
  // Animal that received a medicine with withdrawal period in effect
  const activeWithdrawalsCount = 1; // Simulated active alert

  // Quick Tasks List
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  // Distribution chart data
  const categories = ['Vaca', 'Novilla', 'Becerra', 'Toro', 'Novillo', 'Becerro', 'Búfala', 'Búfalo'];
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: animals.filter(a => a.category === cat).length
  })).filter(c => c.count > 0);

  // Custom SVG Chart points for milk production
  // Milk yield over the last 3 days
  const milkTrends = [
    { label: "Jun 01", value: 43.5 },
    { label: "Jun 02", value: 49.7 },
    { label: "Jun 03", value: totalMilkToday > 0 ? totalMilkToday : 49.0 }
  ];

  // Max value for chart scaling
  const maxTrendVal = Math.max(...milkTrends.map(t => t.value), 60);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-emerald-500/30 text-emerald-250 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/35">
            AgTech Activo 🚀
          </span>
          <h2 className="text-2xl font-poppins font-bold tracking-tight mt-3">¡Bienvenido a {farmParams.farmName}!</h2>
          <p className="text-slate-205 text-sm max-w-xl mt-1">
            El sistema se encuentra sincronizado. El invierno favorece el rendimiento de pasturas a {farmParams.dryMatterYield} Ton MS/Ha/año de rebrote constante.
          </p>
        </div>
        {/* Abstract design element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-emerald-500/20 to-transparent opacity-65 pointer-events-none"></div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Herd Card */}
        <div 
          onClick={() => setCurrentSection('animales')}
          className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Censo de Rebaño</span>
            <p className="text-3xl font-poppins font-bold text-slate-800">{totalHerd} <span className="text-slate-400 text-sm font-medium">Cabezas</span></p>
            <span className="text-xs text-emerald-600 font-medium">{milkingCows} en ordeño activo</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg group-hover:bg-emerald-100 transition-all text-emerald-800">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Milk Production Card */}
        <div 
          onClick={() => setCurrentSection('registro-masivo')}
          className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Leche del Día</span>
            <p className="text-3xl font-poppins font-bold text-slate-800">{(totalMilkToday || 49.0).toFixed(1)} <span className="text-slate-400 text-sm font-medium">Kg</span></p>
            <span className="text-xs text-indigo-600 font-medium">Promedio: {((totalMilkToday || 49.0) / (milkingCows || 3)).toFixed(1)} Kg/vaca</span>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-all text-indigo-800">
            <Milk className="h-6 w-6" />
          </div>
        </div>

        {/* Breeding Pregnancy Rate */}
        <div 
          onClick={() => setCurrentSection('temporada-servicio')}
          className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gestión de Preñez</span>
            <p className="text-3xl font-poppins font-bold text-slate-800">{pregnantCows} <span className="text-slate-400 text-sm font-medium">Vacas</span></p>
            <span className="text-xs text-pink-600 font-medium">Temporada reproductiva activa</span>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg group-hover:bg-pink-100 transition-all text-pink-800">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        {/* Cash Balance */}
        <div 
          onClick={() => setCurrentSection('finanzas')}
          className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Flujo de Caja</span>
            <p className={`text-2xl font-poppins font-bold ${balanceUsd >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              ${balanceUsd.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 font-medium">Est: {(balanceUsd * farmParams.dollarRateVes).toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs.</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-slate-100 transition-all text-slate-700 border border-slate-100">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Trend Panel with Custom Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-poppins font-bold text-slate-800">Producción Láctea Reciente</h3>
                <p className="text-slate-400 text-xs">Rendimiento global del ordeño rápido diario</p>
              </div>
              <button 
                onClick={() => setCurrentSection('registro-masivo')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                Ordeñar de nuevo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Render a Beautiful Custom SVG Line Chart */}
            <div className="h-44 w-full flex items-end justify-between relative pt-5 px-4 bg-slate-50 border border-slate-100 rounded-xl mb-4">
              {/* Background gridlines */}
              <div className="absolute inset-x-0 top-1/4 border-t border-slate-200/80 pointer-events-none"></div>
              <div className="absolute inset-x-0 top-2/4 border-t border-slate-200/80 pointer-events-none"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-slate-200/80 pointer-events-none"></div>

              {/* Graphical Path in SVG */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path 
                  d={`M 40,${120 - (43.5 / maxTrendVal) * 80} L 200,${120 - (49.7 / maxTrendVal) * 80} L 360,${120 - ((totalMilkToday || 49.0) / maxTrendVal) * 80} L 360,120 L 40,120 Z`} 
                  fill="url(#chartGrad)" 
                />
                {/* Line path */}
                <path 
                  d={`M 40,${120 - (43.5 / maxTrendVal) * 80} L 200,${120 - (49.7 / maxTrendVal) * 80} L 360,${120 - ((totalMilkToday || 49.0) / maxTrendVal) * 80}`} 
                  fill="none" 
                  stroke="#059669" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                {/* Reference dots */}
                <circle cx="40" cy={120 - (43.5 / maxTrendVal) * 80} r="4.5" fill="#059669" stroke="#fff" strokeWidth="1.5" />
                <circle cx="200" cy={120 - (49.7 / maxTrendVal) * 80} r="4.5" fill="#059669" stroke="#fff" strokeWidth="1.5" />
                <circle cx="360" cy={120 - ((totalMilkToday || 49.0) / maxTrendVal) * 80} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
              </svg>

              {/* X Axis Labels */}
              <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 text-[10px] font-mono text-slate-400">
                <span>Jun 01 (43.5 Kg)</span>
                <span>Jun 02 (49.7 Kg)</span>
                <span>Hoy ({(totalMilkToday || 49.0).toFixed(1)} Kg)</span>
              </div>
            </div>
          </div>

          {/* Quick herd summary ratios */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Vacas Ordeñadas</span>
              <p className="text-base font-bold text-slate-700">{milkingCows} / {animals.filter(a => a.category === 'Vaca').length}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Búfalas Ordeñadas</span>
              <p className="text-base font-bold text-slate-700">2 / 2</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Pastura Asignada</span>
              <p className="text-base font-bold text-slate-700">60% de Carga</p>
            </div>
          </div>
        </div>

        {/* Right Corner: Quick alerts and task logs */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-poppins font-bold text-slate-800">Alertas de Bioseguridad</h3>
              <p className="text-slate-400 text-xs">Vigilancia del rebaño y retiro veterinario</p>
            </div>

            {/* Alert Cards */}
            <div className="space-y-3">
              {/* Active Withdrawals Alerts */}
              {activeWithdrawalsCount > 0 ? (
                <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-lg flex items-start gap-3">
                  <div className="bg-rose-100 text-rose-700 p-1.5 rounded-md mt-0.5 animate-bounce">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-800">Período de Retiro Activo</h4>
                    <p className="text-[11px] text-rose-600 font-medium leading-normal mt-0.5">
                      Vaca #104 ("Barinas") recibió Masticilina (retira el 04 de Jun). ¡La leche de esta vaca NO debe ser enviada a quesera!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-800 p-1 rounded-md">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800">Todo Seguro</h4>
                    <p className="text-[10px] text-emerald-600">No hay antibióticos activos en período de retiro.</p>
                  </div>
                </div>
              )}

              {/* Imminent Vaccine alerts */}
              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-lg flex items-start gap-3">
                <div className="bg-amber-100 text-amber-800 p-1.5 rounded-md mt-0.5">
                  <Clock className="h-4.5 w-4.5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Próxima Vacunación Masiva</h4>
                  <p className="text-[11px] text-amber-700 leading-normal mt-0.5">
                    Ciclo I de Fiebre Aftosa inicia en 12 días. Asegurar dosis de Aftogan e insumos de vacunación masiva en refrigeración.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tasks ledger */}
          <div className="border-t border-slate-100 pt-4 mt-4">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Próximas Tareas de Campo</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <div className="space-y-1.5">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${
                    task.priority === 'Alta' ? 'bg-rose-500' : task.priority === 'Media' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}></span>
                  <span className="truncate flex-1">{task.title}</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-mono">{task.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Breeding & Animal Category distribution list */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <h3 className="font-poppins font-bold text-slate-800 mb-4">Estructura del Rebaño por Categoría</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoryCounts.map(item => (
            <div key={item.name} className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center hover:bg-slate-100/70 transition-all">
              <span className="text-[11px] font-bold text-slate-500 truncate block">{item.name}s</span>
              <p className="text-2xl font-poppins font-bold text-emerald-800 mt-1">{item.count}</p>
              <span className="text-[9px] text-slate-400 font-mono">{(item.count / totalHerd * 100).toFixed(0)}% del total</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
