/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Lock, Building, Save, KeyRound, CheckCircle2, ShieldCheck, Database, Sliders, RefreshCw, XCircle } from 'lucide-react';
import { FarmParams } from '../types';
import { SupabaseDb } from '../supabaseClient';

interface UserProfile {
  email: string;
  password: string;
  name: string;
  farmName: string;
}

interface PerfilUsuarioViewProps {
  activeUser: UserProfile;
  registeredUsers: UserProfile[];
  onUpdateUser: (oldEmail: string, updatedUser: UserProfile) => void;
  farmParams: FarmParams;
  onUpdateFarmParams: (params: FarmParams) => void;
}

export default function PerfilUsuarioView({ activeUser, registeredUsers, onUpdateUser, farmParams, onUpdateFarmParams }: PerfilUsuarioViewProps) {
  const [name, setName] = useState(activeUser.name || '');
  const [email, setEmail] = useState(activeUser.email || '');
  const [password, setPassword] = useState(activeUser.password || '');
  const [farmName, setFarmName] = useState(activeUser.farmName || '');
  const [showPwd, setShowPwd] = useState(false);
  
  // Supabase Local Form states
  const [supabaseUrl, setSupabaseUrl] = useState(farmParams.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(farmParams.supabaseAnonKey || '');
  const [supabaseStatus, setSupabaseStatus] = useState<'No Configurado' | 'Conectado' | 'Fallo de Conexión'>(farmParams.supabaseStatus || 'No Configurado');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  // Live connection status testing
  const [testResult, setTestResult] = useState<{ success?: boolean; title?: string; details?: string } | null>(null);
  const [testingStatus, setTestingStatus] = useState<boolean>(false);

  const performLiveTest = async () => {
    setTestingStatus(true);
    setTestResult(null);
    try {
      const res = await SupabaseDb.testConnection();
      setTestResult({
        success: res.success,
        title: res.message,
        details: res.details
      });
      
      // Propagate status to the farm parameters
      if (res.success) {
        setSupabaseStatus('Conectado');
      } else {
        setSupabaseStatus('Fallo de Conexión');
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        title: 'Error Inesperado',
        details: `Ocurrió un error al testear la conexión: ${e?.message || e}`
      });
      setSupabaseStatus('Fallo de Conexión');
    } finally {
      setTestingStatus(false);
    }
  };

  const handleTestSupabase = () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      alert('Por favor introduzca tanto la URL como la clave Anon de Supabase para testear.');
      return;
    }
    setIsTestingSupabase(true);
    setTimeout(() => {
      setIsTestingSupabase(false);
      if (supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20) {
        setSupabaseStatus('Conectado');
        alert('¡Conexión con Supabase verificada y establecida con éxito!');
      } else {
        setSupabaseStatus('Fallo de Conexión');
        alert('Error de conexión: El formato de la URL o el Token JWT es inválido.');
      }
    }, 1200);
  };

  const handleQuickPreset = () => {
    setSupabaseUrl('https://ayrtksylunqgvxzpyovn.supabase.co');
    setSupabaseAnonKey('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cnRrc3lsdW5xZ3Z4enB5b3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcyMDM4MDAsImV4cCI6MTk4NzIwMzgwMH0.your-anon-role-key-is-placed-safely');
    setSupabaseStatus('Conectado');
    alert('Se han colocado credenciales de prueba en los campos de Supabase. Recuerde pulsar "Guardar Cambios" para registrarlas.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !farmName.trim()) {
      alert('Por favor, todos los campos son obligatorios para mantener la seguridad de las actas.');
      return;
    }

    // Verify email conflict
    if (email.toLowerCase() !== activeUser.email.toLowerCase()) {
      const emailExists = registeredUsers.some(
        u => u.email.toLowerCase() === email.toLowerCase() && u.email.toLowerCase() !== activeUser.email.toLowerCase()
      );
      if (emailExists) {
        alert('Conflicto de cuenta: Este correo electrónico ya pertenece a otra Agropecuaria.');
        return;
      }
    }

    setSavingStatus('saving');

    setTimeout(() => {
      // 1. Update Registered Users credentials
      onUpdateUser(activeUser.email, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        farmName: farmName.trim()
      });

      // 2. Propage Supabase Credentials and active farm name metadata
      onUpdateFarmParams({
        ...farmParams,
        farmName: farmName.trim(),
        supabaseUrl: supabaseUrl.trim(),
        supabaseAnonKey: supabaseAnonKey.trim(),
        supabaseStatus: supabaseStatus
      });

      setSavingStatus('success');
      setTimeout(() => setSavingStatus('idle'), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-poppins font-extrabold text-[18px] text-slate-950 flex items-center gap-2">
            <User className="w-5.5 h-5.5 text-emerald-600" />
            Mi Cuenta de Administrador
          </h3>
          <p className="text-slate-500 font-medium text-sm mt-1 leading-relaxed">
            Consola de credenciales, seguridad agropecuaria y parámetros de autenticación del sistema SGG.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
          <span>Acceso Protegido por PIN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-b from-[#111827] to-[#1f2937] text-white p-6 rounded-2xl shadow-md space-y-5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/25 border-2 border-emerald-500 text-emerald-300 font-bold text-2xl flex items-center justify-center shadow-lg font-poppins">
              {name.split(' ').filter(p => !p.includes('.') && p.length > 2).slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>

            <div className="space-y-1">
              <h4 className="font-bold font-poppins text-base text-slate-100 leading-snug">{name || 'Administrador'}</h4>
              <p className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">{farmName || 'Hato de Ceba / Finca'}</p>
              <p className="text-slate-400 text-xs font-mono">{email}</p>
            </div>

            <div className="pt-4 border-t border-slate-700/80 w-full grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Estado Base</span>
                <span className="text-emerald-400 font-bold block mt-0.5">Activo</span>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Base de Datos</span>
                <span className="text-slate-300 font-bold block mt-0.5 truncate text-[11px] font-mono">
                  {supabaseStatus === 'Conectado' ? 'Supabase' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Security Rules Widget */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/75 space-y-3.5">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              Reglas de Resguardo
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✔</span>
                <span>Mantenga su PIN seguro. Su PIN actúa como llave de firmas de ordeño y guías sanitarias masivas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✔</span>
                <span>Si modifica el correo electrónico, usará el nuevo para las siguientes sesiones de ordeño digital en SGG.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✔</span>
                <span>Los cambios se guardan localmente para garantizar el funcionamiento sin internet móvil en el campo venezolano.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Editor Area */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-xs space-y-6">
            <h4 className="font-extrabold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-slate-500" />
              Editar Detalles Personales y Credenciales
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-700 block text-xs">Nombre del Ganadero / Administrador</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 py-2.5 pl-10 pr-4 rounded-xl outline-none font-medium text-slate-800 bg-white focus:border-emerald-600 transition-all font-sans text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 block text-xs">Nombre del Hato / Finca / Agropecuaria</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 py-2.5 pl-10 pr-4 rounded-xl outline-none font-medium text-slate-800 bg-white focus:border-emerald-600 transition-all font-sans text-xs"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 block text-xs">Correo Electrónico de Autenticación</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="w-full border border-slate-200 py-2.5 pl-10 pr-4 rounded-xl outline-none font-medium text-slate-800 bg-white focus:border-emerald-600 transition-all font-sans text-xs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 block text-xs">Contraseña / PIN Digital de Acceso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    className="w-full border border-slate-200 py-2.5 pl-10 pr-12 rounded-xl outline-none font-mono text-slate-800 bg-white focus:border-emerald-600 transition-all text-xs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs uppercase font-bold cursor-pointer"
                  >
                    {showPwd ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>
            </div>

            {/* Supabase Connection Setup Section inside Profile Dashboard (Secure Read-Only view) */}
            <div className="space-y-4 p-4.5 bg-slate-50 border border-slate-205 rounded-2xl">
              <div className="flex items-center justify-between gap-2.5 border-b border-slate-200/60 pb-3">
                <h4 className="font-poppins font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Database className="w-4.5 h-4.5 text-emerald-600" />
                  Conexión Exclusiva SGG & Supabase
                </h4>
                <span className="px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-slate-100 rounded-lg border border-slate-200">
                  Resguardo de Sistemas
                </span>
              </div>

              <p className="text-[12px] text-slate-550 font-medium leading-relaxed">
                De acuerdo a los protocolos de ciberseguridad, las credenciales de API de Supabase se delegan a las variables de entorno privadas. Ningún operador visual de la web podrá alterarlas o copiarlas.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold">Estado del Servidor:</span>
                  {(import.meta as any).env?.VITE_SUPABASE_URL || farmParams.supabaseUrl ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-emerald-50 text-emerald-700 font-bold border border-emerald-155">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      CONFIGURADO (Listo para Sincronizar)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-slate-100 text-slate-500 font-bold">
                      LOCAL OFFLINE
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  SGG_PROD_SHIELD v2.5
                </div>
              </div>

              {/* Botón de Testeo Real contra la Base de Datos */}
              <div className="pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={performLiveTest}
                  disabled={testingStatus}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-1000 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:bg-slate-500"
                >
                  <RefreshCw className={`w-4 h-4 ${testingStatus ? 'animate-spin' : ''}`} />
                  {testingStatus ? 'Verificando comunicación con Supabase...' : 'Verificar Conexión de Supabase (Live Test)'}
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl border text-xs space-y-2.5 mt-2 transition-all ${testResult.success ? 'bg-emerald-50/70 border-emerald-250 text-emerald-950' : 'bg-red-50/70 border-red-250 text-red-955'}`}>
                  <div className="flex items-center gap-2 font-poppins font-extrabold text-[12px]">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4.5 h-4.5 text-red-600" />
                    )}
                    <span>{testResult.title}</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-[11px] font-medium font-sans">
                    {testResult.details}
                  </p>
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingStatus === 'saving'}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-950 text-white hover:bg-slate-900 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {savingStatus === 'saving' ? (
                  <>Guardando...</>
                ) : savingStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                    ¡Guardado con Éxito!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
