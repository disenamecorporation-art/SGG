/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  Milk, 
  Activity, 
  DollarSign, 
  Coins, 
  FileCheck, 
  Calendar, 
  QrCode, 
  ShieldCheck, 
  GitMerge, 
  Award, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  Sliders,
  Syringe,
  Baby,
  User
} from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  farmName: string;
  onLogout: () => void;
  activeUser: { email: string; name: string; farmName: string };
}

export default function Sidebar({ currentSection, setCurrentSection, farmName, onLogout, activeUser }: SidebarProps) {
  // Collapsible submenus state
  const [openSubmenus, setOpenSubmenus] = useState({
    sanidad: true,
    reproduccion: true,
    razas: true
  });

  const toggleSubmenu = (menu: 'sanidad' | 'reproduccion' | 'razas') => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (id: string) => currentSection === id;

  const activeClasses = "bg-emerald-500/10 text-emerald-400 font-semibold border-l-2 border-emerald-500 rounded-r-lg pl-2.5 shadow-xs";
  const inactiveClasses = "text-slate-400 hover:bg-slate-800 hover:text-white border-l-2 border-transparent pl-3 transition-all";

  return (
    <aside className="w-64 bg-[#111827] text-slate-100 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-center bg-transparent">
        <img 
          src="https://i.postimg.cc/RV43Jcds/SGG-LOGOAPPWEB-FONDOBLANCO.png" 
          alt="SGG Logo" 
          className="h-12 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-3">General</div>
        {/* Dashboard Principal */}
        <button
          onClick={() => setCurrentSection('dashboard')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('dashboard') ? activeClasses : inactiveClasses}`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard Principal</span>
        </button>

        {/* Gestión de Animales */}
        <button
          onClick={() => setCurrentSection('animales')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('animales') ? activeClasses : inactiveClasses}`}
        >
          <Sprout className="h-4 w-4" />
          <span>Gestión de Animales</span>
        </button>

        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-5 mb-2 px-3">Producción</div>
        {/* Levante y Ceba */}
        <button
          onClick={() => setCurrentSection('levante-ceba')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('levante-ceba') ? activeClasses : inactiveClasses}`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Levante y Ceba</span>
        </button>

        {/* Registro Masivo de Leche */}
        <button
          onClick={() => setCurrentSection('registro-masivo')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('registro-masivo') ? activeClasses : inactiveClasses}`}
        >
          <Milk className="h-4 w-4" />
          <span>Ordeño Rápido</span>
        </button>

        {/* Control de Mastitis */}
        <button
          onClick={() => setCurrentSection('mastitis')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('mastitis') ? activeClasses : inactiveClasses}`}
        >
          <Activity className="h-4 w-4" />
          <span>Control de Mastitis</span>
        </button>

        {/* Mercado Ganadero */}
        <button
          onClick={() => setCurrentSection('mercado')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('mercado') ? activeClasses : inactiveClasses}`}
        >
          <Coins className="h-4 w-4" />
          <span>Mercado Ganadero</span>
        </button>

        {/* Finanzas */}
        <button
          onClick={() => setCurrentSection('finanzas')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('finanzas') ? activeClasses : inactiveClasses}`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Control Financiero</span>
        </button>

        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-5 mb-2 px-3">Sanidad</div>
        {/* SUBMENÚ 1: SANIDAD MASIVA */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu('sanidad')}
            className="w-full flex items-center justify-between py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white pl-3 pr-2 transition-all"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Sanidad Masiva</span>
            </div>
            {openSubmenus.sanidad ? <ChevronDown className="h-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
          </button>
          
          {openSubmenus.sanidad && (
            <div className="pl-4 space-y-1 ml-5 border-l border-slate-800">
              <button
                onClick={() => setCurrentSection('tratamiento-masivo')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('tratamiento-masivo') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Tratamiento Masivo
              </button>
              <button
                onClick={() => setCurrentSection('vacunacion-masiva')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('vacunacion-masiva') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Vacunación Obligatoria
              </button>
            </div>
          )}
        </div>

        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-5 mb-2 px-3">Reproducción & Raza</div>
        {/* SUBMENÚ 2: REPRODUCCIÓN */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu('reproduccion')}
            className="w-full flex items-center justify-between py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white pl-3 pr-2 transition-all"
          >
            <div className="flex items-center gap-3">
              <GitMerge className="h-4 w-4 text-pink-400" />
              <span>Reproducción</span>
            </div>
            {openSubmenus.reproduccion ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
          </button>
          
          {openSubmenus.reproduccion && (
            <div className="pl-4 space-y-1 ml-5 border-l border-slate-800">
              <button
                onClick={() => setCurrentSection('temporada-servicio')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('temporada-servicio') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Temporada de Servicio
              </button>
              <button
                onClick={() => setCurrentSection('info-machos')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('info-machos') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Evaluación de Toros
              </button>
            </div>
          )}
        </div>

        {/* SUBMENÚ 3: REGISTROS DE RAZA / ASOC */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu('razas')}
            className="w-full flex items-center justify-between py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white pl-3 pr-2 transition-all"
          >
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Registros de Raza / Asoc</span>
            </div>
            {openSubmenus.razas ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
          </button>
          
          {openSubmenus.razas && (
            <div className="pl-4 space-y-1 ml-5 border-l border-slate-800">
              <button
                onClick={() => setCurrentSection('criabufalo')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('criabufalo') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Criabúfalo (Búfalos)
              </button>
              <button
                onClick={() => setCurrentSection('genetica-cebu')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('genetica-cebu') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Evaluación Cebú (ASOCEBU)
              </button>
              <button
                onClick={() => setCurrentSection('caprino-ovino')}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 ${isActive('caprino-ovino') ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
              >
                Caprino y Ovino
              </button>
            </div>
          )}
        </div>

        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-5 mb-2 px-3">Configuración</div>

        {/* Historial de Tratamientos */}
        <button
          onClick={() => setCurrentSection('medicinas')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('medicinas') ? activeClasses : inactiveClasses}`}
        >
          <Sliders className="h-4 w-4" />
          <span>Fármacos e Inventario</span>
        </button>

        {/* Tareas y Calendario */}
        <button
          onClick={() => setCurrentSection('tareas')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('tareas') ? activeClasses : inactiveClasses}`}
        >
          <Calendar className="h-4 w-4" />
          <span>Tareas y Calendario</span>
        </button>

        {/* Escáner de Chip / QR */}
        <button
          onClick={() => setCurrentSection('scanner')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('scanner') ? activeClasses : inactiveClasses}`}
        >
          <QrCode className="h-4 w-4" />
          <span>Escáner Chip / QR</span>
        </button>

        {/* Mi Perfil */}
        <button
          onClick={() => setCurrentSection('mi-perfil')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('mi-perfil') ? activeClasses : inactiveClasses}`}
        >
          <User className="h-4 w-4 text-emerald-500" />
          <span>Mi Perfil</span>
        </button>

        {/* Otros Parámetros de la Finca */}
        <button
          onClick={() => setCurrentSection('otros-parametros')}
          className={`w-full flex items-center gap-3 py-2.5 rounded-l-none rounded-r-lg text-xs transition-all text-left ${isActive('otros-parametros') ? activeClasses : inactiveClasses}`}
        >
          <Settings className="h-4 w-4" />
          <span>Parámetros Finca</span>
        </button>
      </nav>

      {/* User Segment & Logout */}
      <div className="p-4 border-t border-slate-850 bg-slate-950/60 sticky bottom-0">
        <button
          onClick={() => setCurrentSection('mi-perfil')}
          className="w-full flex items-center gap-2.5 mb-2.5 p-1 rounded-lg hover:bg-slate-800/50 transition-all text-left cursor-pointer group"
          title="Ver Mi Perfil"
        >
          <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-700/85 font-poppins flex items-center justify-center text-xs font-bold text-white border border-emerald-500/20 group-hover:border-emerald-400 transition-all">
            {activeUser?.name ? (
              activeUser.name.split(' ').filter(part => !part.includes('.') && part.length >= 2).slice(0, 2).map(n => n[0]).join('').toUpperCase() || activeUser.name[0].toUpperCase()
            ) : 'CR'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate leading-none mb-0.5 group-hover:text-emerald-400 transition-all">
              {activeUser?.name || 'Ing. Carlos Ruiz'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {activeUser?.email || 'disenamecorporation@gmail.com'}
            </p>
          </div>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-md transition-all cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
