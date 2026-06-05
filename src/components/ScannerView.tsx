/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { QrCode, Scan, Search, CheckCircle2, AlertCircle, RefreshCw, Smartphone, MonitorPlay } from 'lucide-react';
import { Animal } from '../types';

interface ScannerProps {
  animals: Animal[];
}

export default function ScannerView({ animals }: ScannerProps) {
  const [typedTag, setTypedTag] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedAnimal, setScannedAnimal] = useState<Animal | null>(null);
  const [scanError, setScanError] = useState('');

  // Settle scanner search
  const handleScanAction = (tagCode: string) => {
    if (!tagCode) return;
    setIsScanning(true);
    setScannedAnimal(null);
    setScanError('');

    // Simulate electronic antenna signal delay
    setTimeout(() => {
      const match = animals.find(a => a.tag === tagCode.trim());
      setIsScanning(false);
      
      if (match) {
        setScannedAnimal(match);
      } else {
        setScanError(`Código RFID o QR '${tagCode}' no coincide con ningún arete activo en el corral.`);
      }
    }, 1500);
  };

  const triggerCameraMock = () => {
    // Select random animal for quick mockup scan ease
    const randomIdx = Math.floor(Math.random() * animals.length);
    const mockTarget = animals[randomIdx];
    if (mockTarget) {
      setTypedTag(mockTarget.tag);
      handleScanAction(mockTarget.tag);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Scanner Panel Card */}
      <div className="bg-white rounded-xl border border-slate-205 shadow-xs overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-600" />
            <span>Simulador de Bastón RFID / Antena QR</span>
          </div>
          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded font-mono">
            Antena 134.2 KHz Sincronizada
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Visual camera reader mock */}
          <div className="bg-slate-900 rounded-xl p-5 aspect-video flex flex-col items-center justify-center relative overflow-hidden text-center text-xs text-slate-400">
            {/* Pulsing neon crosshair lines representing the lens sensor */}
            <div className="absolute inset-4 border border-emerald-500/10 rounded-lg pointer-events-none"></div>
            
            {/* Dynamic visual scanner line */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-bounce w-full top-0"></div>
            )}

            {isScanning ? (
              <div className="space-y-3 z-10">
                <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin mx-auto" />
                <p className="text-emerald-400 font-bold font-mono tracking-widest animate-pulse">
                  CONEXIÓN CON BASTÓN: LEYENDO TAG CHIP...
                </p>
              </div>
            ) : scannedAnimal ? (
              <div className="space-y-2 text-emerald-400 z-10">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="font-mono font-bold tracking-wider uppercase text-emerald-300">¡LECTURA EXITOSA!</p>
                <p className="text-slate-300">Chip #{scannedAnimal.tag} de Oreja</p>
              </div>
            ) : (
              <div className="space-y-3 z-10 text-slate-300">
                <Smartphone className="h-12 w-12 text-purple-400 mx-auto" />
                <p className="font-poppins font-bold">Lente Automático de Lector</p>
                <p className="text-slate-405 leading-relaxed text-[11px] max-w-xs mx-auto">
                  Acerque el bastón electrónico al arete de la vaca o encienda la cámara del celular.
                </p>
                <button
                  type="button"
                  onClick={triggerCameraMock}
                  className="bg-purple-800 hover:bg-purple-900 border border-purple-750 text-white font-bold py-1.5 px-4 rounded text-[10px] uppercase font-mono tracking-wider transition-all"
                >
                  Gatillar Escaneo de Prueba ⚡
                </button>
              </div>
            )}
          </div>

          {/* Form input controls right corner */}
          <div className="space-y-4 font-semibold text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Búsqueda Directa/Arete Manual</h4>
              <p className="text-[11px] font-normal leading-relaxed text-slate-400 mt-1">
                Escriba el número grabado en el arete plástico (p. ej: "012", "088" o "901") para simular la aproximación física del bastón de lectura.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-slate-500 uppercase font-mono text-[9px] tracking-wider block">ID de Arete o Collar</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: 012"
                  className="flex-1 border border-slate-200 bg-white rounded-lg p-2.5 font-bold outline-none font-mono text-slate-800"
                  value={typedTag}
                  onChange={(e) => setTypedTag(e.target.value)}
                />
                
                <button
                  type="button"
                  onClick={() => handleScanAction(typedTag)}
                  className="bg-purple-800 hover:bg-purple-900 text-white px-4 font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Scan className="w-4 h-4" />
                  Escanear
                </button>
              </div>
            </div>

            {scanError && (
              <p className="text-[11px] leading-relaxed text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg flex items-start gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span>{scanError}</span>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Scanned Profile Render */}
      {scannedAnimal && (
        <div className="bg-emerald-50/20 border border-emerald-300 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-800 font-mono font-bold text-white flex items-center justify-center text-xl shrink-0 shadow-xs ring-4 ring-emerald-100">
            #{scannedAnimal.tag}
          </div>

          <div className="flex-1 space-y-4 font-semibold text-xs text-slate-700">
            <div className="border-b border-emerald-300/40 pb-2">
              <span className="text-[10px] text-emerald-800 uppercase font-mono font-bold">Ficha de Rebaño Identificada</span>
              <h3 className="font-poppins font-bold text-lg text-slate-800 mt-0.5">{scannedAnimal.name} ({scannedAnimal.breed})</h3>
              <p className="text-slate-450 text-[10px] font-mono mt-0.5">Categoría: <strong className="text-slate-600 font-semibold">{scannedAnimal.category}</strong> | Sexo: {scannedAnimal.sex === 'F' ? 'Hembra (H)' : 'Macho (M)'}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Peso Reciente</span>
                <strong className="text-slate-800">{scannedAnimal.currentWeight} Kg</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Lote Asignado</span>
                <strong className="text-destructive text-slate-800">{scannedAnimal.lot}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Potrero Físico</span>
                <strong className="text-slate-800">{scannedAnimal.pasture}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-400 block mb-0.5">Estatus</span>
                <strong className="text-slate-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] text-emerald-800 font-bold">{scannedAnimal.status}</strong>
              </div>
            </div>

            {/* If female render her reproductive cycles */}
            {(scannedAnimal.pregnancyStatus || scannedAnimal.lactationStatus) && (
              <div className="bg-white p-4 rounded-lg border border-emerald-200/60 flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-poppins flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Situación Productiva
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-slate-405 text-[10px] block">Palpación Preñez</span>
                      <strong className="text-slate-800">{scannedAnimal.pregnancyStatus || 'Vacía'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-405 text-[10px] block">Estado Ordeño</span>
                      <strong className="text-slate-800">{scannedAnimal.lactationStatus || 'Seca'}</strong>
                    </div>
                  </div>
                </div>

                {/* Pedigree ASOCEBU certification if logged */}
                {scannedAnimal.asocebuNumber && (
                  <div className="border-t sm:border-t-0 sm:border-l border-emerald-300/45 pt-3 sm:pt-0 sm:pl-4 flex-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Certificado Oficial</span>
                    <p className="text-slate-850 font-bold mt-1 text-emerald-800">{scannedAnimal.asocebuNumber}</p>
                    <span className="text-[10px] text-slate-450 italic font-medium">Clasificación: {scannedAnimal.geneticsScore || 'Apta rebaño'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
