/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CloudRain, Sun, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { FarmParams } from '../types';

interface HeaderProps {
  currentSection: string;
  farmParams: FarmParams;
}

export default function Header({ currentSection, farmParams }: HeaderProps) {
  // Translate section ID to a beautiful Human label
  const getSectionTitle = (id: string): string => {
    switch (id) {
      case 'dashboard': return 'Dashboard Principal';
      case 'animales': return 'Gestión de Rebaño e Informes de Hembras';
      case 'levante-ceba': return 'Levante y Ceba (Fattening & Weight Gain)';
      case 'registro-masivo': return 'Ordeño Rápido (Registro de Leche)';
      case 'mastitis': return 'Control Preventivo de Mastitis';
      case 'mercado': return 'Mercado Ganadero Nacional (Precios USD)';
      case 'finanzas': return 'Administración y Flujo de Caja';
      case 'medicinas': return 'Fármacos Veteranos e Inventario';
      case 'tareas': return 'Tareas Críticas y Calendario de Campo';
      case 'scanner': return 'Escáner Electrónico de Chips y QR';
      case 'tratamiento-masivo': return 'Tratamientos Masivos (Lotes & Potreros)';
      case 'vacunacion-masiva': return 'Vacunación Obligatoria y Estacional';
      case 'temporada-servicio': return 'Gestión de Reproducción y Temporadas de Servicio';
      case 'info-machos': return 'Evaluación y Desempeño de Reproductores (Machos)';
      case 'criabufalo': return 'Criabúfalo (Métricas de Búfalos y Proyecciones)';
      case 'genetica-cebu': return 'Evaluación Genética Cebú (ASOCEBU)';
      case 'caprino-ovino': return 'Control de Caprinos y Ovinos';
      case 'otros-parametros': return 'Parámetros Dinámicos y Métricas de la Finca';
      case 'mi-perfil': return 'Mi Perfil de Administrador';
      default: return 'Gestor Ganadero';
    }
  };

  const getTodayDateString = () => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('es-VE', options);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4.5">
        <img 
          src="https://i.postimg.cc/Pq9pC9Vf/IMAGOTIPO-SSG-WEBLOGO.png" 
          alt="SGG Logo" 
          className="h-10 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="border-l border-slate-200 pl-4.5">
          <h2 className="text-lg font-poppins font-bold text-slate-900 tracking-tight leading-none">{getSectionTitle(currentSection)}</h2>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-2 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTodayDateString()}</span>
          </p>
        </div>
      </div>

      {/* Right Corner Widgets - Farm Status Parameters */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        {/* Climate Season Widget */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] ${
          farmParams.season === 'Lluvia' 
            ? 'bg-blue-50/75 border-blue-100 text-blue-700' 
            : 'bg-amber-50/75 border-amber-100 text-amber-700'
        }`}>
          {farmParams.season === 'Lluvia' ? <CloudRain className="w-3.5 h-3.5 text-blue-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          <span>
            Época: <strong className="font-bold">{farmParams.season}</strong> ({farmParams.temperatureMin}°C - {farmParams.temperatureMax}°C)
          </span>
        </div>

        {/* Currency Rates Widget - Highly relevant for Venezuelan finances */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/75 border border-emerald-100 text-emerald-800 text-[11px]">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Tasa BCV: <strong className="font-bold">{farmParams.dollarRateVes.toFixed(2)} Bs./$</strong>
          </span>
        </div>

        {/* Carga Animal Widget */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50/75 border border-slate-200 text-slate-700 text-[11px]">
          <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Carga: <strong className="font-bold">{farmParams.stockingRate} U.A./Ha</strong>
          </span>
        </div>
      </div>
    </header>
  );
}
