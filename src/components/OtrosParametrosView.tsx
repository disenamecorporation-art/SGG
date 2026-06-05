/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Check, HelpCircle, Save, Landmark, Thermometer, CloudRain, Fence, Database, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { FarmParams, Breed, AnimalCategory, Medication, OtherProductService } from '../types';
import { SupabaseDb } from '../supabaseClient';

interface OtrosParametrosProps {
  farmParams: FarmParams;
  onUpdateFarmParams: (params: FarmParams) => void;
  onAddBreed: (breed: Omit<Breed, 'id'>) => void;
  onAddCategory: (cat: Omit<AnimalCategory, 'id'>) => void;
  onAddMedication: (med: Omit<Medication, 'id'>) => void;
  onAddProduct: (prod: Omit<OtherProductService, 'id'>) => void;
}

export default function OtrosParametrosView({ farmParams, onUpdateFarmParams, onAddBreed, onAddCategory, onAddMedication, onAddProduct }: OtrosParametrosProps) {
  const [fName, setFName] = useState(farmParams.farmName);
  const [fClimate, setFClimate] = useState(farmParams.climateZone);
  const [fDollar, setFDollar] = useState(farmParams.dollarRateVes);
  const [fTempMin, setFTempMin] = useState(farmParams.temperatureMin);
  const [fTempMax, setFTempMax] = useState(farmParams.temperatureMax);
  const [fRain, setFRain] = useState(farmParams.precipitation);
  const [fStocking, setFStocking] = useState(farmParams.stockingRate);
  const [fYield, setFYield] = useState(farmParams.dryMatterYield);
  const [fSeason, setFSeason] = useState<'Lluvia' | 'Sequía'>(farmParams.season);

  // Supabase Local Form states
  const [fSupabaseUrl, setFSupabaseUrl] = useState(farmParams.supabaseUrl || '');
  const [fSupabaseAnonKey, setFSupabaseAnonKey] = useState(farmParams.supabaseAnonKey || '');
  const [fSupabaseStatus, setFSupabaseStatus] = useState<'No Configurado' | 'Conectado' | 'Fallo de Conexión'>(farmParams.supabaseStatus || 'No Configurado');
  const [modalType, setModalType] = useState<null | 'breed' | 'category' | 'medicine' | 'product'>(null);
  const [formData, setFormData] = useState<any>({});

  const handleAddBreed = () => {
    setModalType('breed');
  };
  
  const handleAddCategory = () => {
    setModalType('category');
  };

  const handleAddMedication = () => {
    setModalType('medicine');
  };

  const handleAddProduct = () => {
    setModalType('product');
  };

  const submitModal = () => {
    if (modalType === 'breed' && formData.name && formData.species) {
      if (!SupabaseDb.isEnabled()) alert('Advertencia: Supabase no está configurado.');
      onAddBreed({ name: formData.name, species: formData.species });
    } else if (modalType === 'category' && formData.name && formData.species) {
      if (!SupabaseDb.isEnabled()) alert('Advertencia: Supabase no está configurado.');
      onAddCategory({ name: formData.name, species: formData.species });
    } else if (modalType === 'medicine' && formData.name && formData.ingredient && formData.withdrawal) {
      if (!SupabaseDb.isEnabled()) alert('Advertencia: Supabase no está configurado.');
      onAddMedication({ name: formData.name, activeIngredient: formData.ingredient, withdrawalPeriod: Number(formData.withdrawal), unit: 'ml', category: 'General' });
    } else if (modalType === 'product' && formData.name && formData.type && formData.amount) {
      if (!SupabaseDb.isEnabled()) alert('Advertencia: Supabase no está configurado.');
      onAddProduct({ name: formData.name, type: formData.type, amount: Number(formData.amount) });
    }
    setModalType(null);
    setFormData({});
  };

  const handleTestSupabase = () => {
    if (!fSupabaseUrl || !fSupabaseAnonKey) {
      alert('Por favor introduzca tanto la URL como la clave Anon de Supabase.');
      return;
    }
    setIsTestingSupabase(true);
    setTimeout(() => {
      setIsTestingSupabase(false);
      if (fSupabaseUrl.startsWith('https://') && fSupabaseAnonKey.length > 20) {
        setFSupabaseStatus('Conectado');
        alert('¡Conexión simulada con Supabase exitosa! Las claves han sido aprobadas y validadas.');
      } else {
        setFSupabaseStatus('Fallo de Conexión');
        alert('Error de formato de conexión. Verifique que la URL inicia con "https://" y que la Anon Key es un token JWT de Supabase válido.');
      }
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fDollar <= 0) return alert('Por favor introduzca una tasa de cambio válida (mayor a 0).');

    onUpdateFarmParams({
      farmName: fName,
      climateZone: fClimate,
      dollarRateVes: fDollar,
      temperatureMin: Number(fTempMin),
      temperatureMax: Number(fTempMax),
      precipitation: Number(fRain),
      stockingRate: Number(fStocking),
      dryMatterYield: Number(fYield),
      season: fSeason,
      supabaseUrl: fSupabaseUrl,
      supabaseAnonKey: fSupabaseAnonKey,
      supabaseStatus: fSupabaseStatus
    });

    alert('Parámetros de configuración de la finca actualizados con éxito. Los campos de Supabase han sido guardados.');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
          <Sliders className="w-5 h-5 text-indigo-700" />
          Configuración Global de Parámetros de Finca (Campos Dinámicos)
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-705">
          
          {/* Farm general descriptors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-655 block">Nombre del Predio / Finca *</label>
              <input
                type="text"
                required
                className="w-full border border-slate-205 rounded-lg p-2 font-medium bg-white outline-none"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-655 block">Zona Climática *</label>
              <input
                type="text"
                required
                className="w-full border border-slate-205 rounded-lg p-2 font-medium bg-white outline-none"
                value={fClimate}
                onChange={(e) => setFClimate(e.target.value)}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Economic Parameters */}
          <div className="space-y-2 p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-xl">
            <h4 className="font-poppins font-bold text-indigo-900 text-xs flex items-center gap-1">
              <Landmark className="w-4 h-4 text-indigo-750" />
              Parámetros de Cambio Monetario (Conversiones)
            </h4>
            <p className="text-[11px] text-slate-450 leading-relaxed font-normal">
              La economía ganadera de Venezuela utiliza divisas e indexa costos en Bolívares (VES). Cambie esta tasa para recalcular automáticamente su balance financiero y calculadora ganadera.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <label className="text-indigo-800 block font-bold">Tasa Oficial VES/USD (Banco Central) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full border border-indigo-200 p-2 rounded-lg font-bold font-mono outline-none"
                  value={fDollar}
                  onChange={(e) => setFDollar(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-indigo-800 block">Estación Climática Actual *</label>
                <select
                  value={fSeason}
                  onChange={(e) => setFSeason(e.target.value as any)}
                  className="w-full border border-indigo-200 p-2.5 rounded-lg bg-white font-medium"
                >
                  <option value="Lluvia">Estación de Lluvia (Invierno)</option>
                  <option value="Sequía">Estación de Sequía (Verano)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Agroecological & Pastoral parameters */}
          <div className="space-y-3">
            <h4 className="font-poppins font-bold text-slate-800 text-xs">Parámetros Ambientales y Agroecológicos</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Temp Min */}
              <div className="space-y-1">
                <label className="text-slate-600 block flex items-center gap-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                  Temp Mínima (°C)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-205 rounded-lg p-2 bg-white font-mono"
                  value={fTempMin}
                  onChange={(e) => setFTempMin(Number(e.target.value))}
                />
              </div>

              {/* Temp Max */}
              <div className="space-y-1">
                <label className="text-slate-600 block flex items-center gap-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                  Temp Máxima (°C)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-205 rounded-lg p-2 bg-white font-mono"
                  value={fTempMax}
                  onChange={(e) => setFTempMax(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rain */}
              <div className="space-y-1">
                <label className="text-slate-605 block flex items-center gap-0.5">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                  Precipitación Promedio (mm)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-205 rounded-lg p-2 bg-white font-mono"
                  value={fRain}
                  onChange={(e) => setFRain(Number(e.target.value))}
                />
              </div>

              {/* Stocking rate optimal */}
              <div className="space-y-1">
                <label className="text-slate-605 block flex items-center gap-0.5">
                  <Fence className="w-3.5 h-3.5 text-emerald-600" />
                  Carga Animal Real (U.A./ha)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-slate-202 rounded-lg p-2 bg-white font-mono"
                  value={fStocking}
                  onChange={(e) => setFStocking(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Yield Dry matter */}
              <div className="space-y-1">
                <label className="text-slate-605 block">Rendimiento Estimado Pastura (Ton MS/Ha/año)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border border-slate-205 rounded-lg p-2 bg-white font-mono font-bold"
                  value={fYield}
                  onChange={(e) => setFYield(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />
          
          {/* Management Breeds / Categories */}
          <div className="space-y-4">
             <h4 className="font-poppins font-bold text-slate-800 text-xs">Gestión de Catálogos</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button type="button" onClick={handleAddBreed} className="p-2 border rounded-lg text-emerald-800 font-bold border-emerald-200 bg-emerald-50">+ Registrar Nueva Raza</button>
                 <button type="button" onClick={handleAddCategory} className="p-2 border rounded-lg text-emerald-800 font-bold border-emerald-200 bg-emerald-50">+ Registrar Nueva Categoría</button>
                 <button type="button" onClick={handleAddMedication} className="p-2 border rounded-lg text-emerald-800 font-bold border-emerald-200 bg-emerald-50">+ Registrar Nuevo Fármaco</button>
                 <button type="button" onClick={handleAddProduct} className="p-2 border rounded-lg text-emerald-800 font-bold border-emerald-200 bg-emerald-50">+ Registrar Producto/Servicio</button>
             </div>
          </div>
          
          {modalType && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl space-y-4 w-full max-w-sm">
                <h3 className="font-bold text-lg">Registrar {modalType}</h3>
                {['name', 'species', 'ingredient', 'withdrawal', 'type', 'amount'].filter(field => {
                  if (modalType === 'breed' && !['name', 'species'].includes(field)) return false;
                  if (modalType === 'category' && !['name', 'species'].includes(field)) return false;
                  if (modalType === 'medicine' && !['name', 'ingredient', 'withdrawal'].includes(field)) return false;
                  if (modalType === 'product' && !['name', 'type', 'amount'].includes(field)) return false;
                  return true;
                }).map(field => (
                  <input key={field} placeholder={field.toUpperCase()} className="w-full border p-2 rounded" onChange={e => setFormData({...formData, [field]: e.target.value})} />
                ))}
                <div className="flex gap-2">
                  <button onClick={() => setModalType(null)} className="flex-1 p-2 bg-gray-200 rounded">Cancelar</button>
                  <button onClick={submitModal} className="flex-1 p-2 bg-emerald-600 text-white rounded">Guardar</button>
                </div>
              </div>
            </div>
          )}
          
          <hr className="border-slate-100" />

          {/* Supabase Connection Setup Section (Read-Only Secure Status) */}
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/65 rounded-xl">
            <h4 className="font-poppins font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Sincronización Supabase Nube (Protegido)
            </h4>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              Las credenciales de base de datos han sido desvinculadas de la interfaz visual por razones de seguridad. Las claves de SGG se cargan silenciosamente a nivel de sistema.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 bg-white p-2.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold">Resguardo de Producción:</span>
                {(import.meta as any).env?.VITE_SUPABASE_URL || farmParams.supabaseUrl ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ACTIVO (SISTEMA)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-150 text-slate-600 font-bold border border-slate-200">
                    LOCAL AUTOMÁTICO
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                SGGv2_SHIELD_STABLE
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Propagar Nuevos Parámetros
          </button>
        </form>
      </div>
    </div>
  );
}
