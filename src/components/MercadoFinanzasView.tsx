/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  Coins, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Download, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Tag
} from 'lucide-react';
import { Transaction, FarmParams, Animal, Publication, OtherProductService } from '../types';

interface MercadoFinanzasProps {
  subSection: 'mercado' | 'finanzas';
  transactions: Transaction[];
  farmParams: FarmParams;
  animals: Animal[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onAddPublication: (pub: Omit<Publication, 'id'>) => void;
}

export default function MercadoFinanzasView({ subSection, transactions, farmParams, animals, onAddTransaction, onAddPublication }: MercadoFinanzasProps) {
  // --- STATE FOR MERCADO ---
  const [calcWeight, setCalcWeight] = useState<number>(450);
  const [calcCategory, setCalcCategory] = useState<string>('novillo_ceba');
  
  // Publication State
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [pubType, setPubType] = useState<'Venta' | 'Servicio' | 'Donación'>('Venta');
  const [pubPrice, setPubPrice] = useState<number>(500);
  const [pubContact, setPubContact] = useState('');
  const [pubDescription, setPubDescription] = useState('');

  const handlePubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId) return alert('Por favor seleccione un animal.');
    
    onAddPublication({
      animalId: selectedAnimalId,
      type: pubType,
      priceUsd: pubPrice,
      contactNumber: pubContact,
      description: pubDescription,
      active: true
    });
    alert('Publicación creada con éxito.');
    setSelectedAnimalId('');
    setPubPrice(500);
    setPubDescription('');
  };
  
  // Product Management
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState<'Costo' | 'Venta'>('Costo');
  const [productAmount, setProductAmount] = useState<number>(0);
  const [products, setProducts] = useState<OtherProductService[]>([]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || productAmount <= 0) return alert('Por favor llene todos los campos.');
    
    setProducts([...products, { id: 'prod_' + Date.now(), name: productName, type: productType, amount: productAmount }]);
    alert('Producto/Servicio registrado.');
    setProductName('');
    setProductAmount(0);
  };
  
  // Simulated Venezuelan Live prices list (per Kg en pie o producto)
  const marketRates: { [key: string]: { label: string, priceUsd: number, unit: string, trend: 'up' | 'down' | 'equal' } } = {
    novillo_ceba: { label: 'Novillo de Ceba (En Pie)', priceUsd: 1.85, unit: 'Kg', trend: 'up' },
    vaca_gorda: { label: 'Vaca Gorda de Descarte (En Pie)', priceUsd: 1.35, unit: 'Kg', trend: 'equal' },
    toro_reproductor: { label: 'Toro de Descarte (En Pie)', priceUsd: 1.50, unit: 'Kg', trend: 'down' },
    becerro_levante: { label: 'Becerro de Levante (Desmamado)', priceUsd: 2.10, unit: 'Kg', trend: 'up' },
    leche_boca_corral: { label: 'Leche Caliente (Puerta de Corral)', priceUsd: 0.38, unit: 'Litro', trend: 'equal' },
    queso_llanero: { label: 'Queso Llanero Blanco (Quesera)', priceUsd: 3.20, unit: 'Kg', trend: 'up' }
  };

  const getCalculatedPriceUsd = () => {
    const rate = marketRates[calcCategory]?.priceUsd || 0;
    return calcWeight * rate;
  };

  // --- STATE FOR FINANCES LOG ---
  const [txDate, setTxDate] = useState('2026-06-03');
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txCategory, setTxCategory] = useState('Venta Leche');
  const [txDesc, setTxDesc] = useState('');
  const [txAmountUsd, setTxAmountUsd] = useState<number>(100);

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txAmountUsd <= 0) return alert('Por favor ingrese un monto válido.');

    onAddTransaction({
      date: txDate,
      type: txType,
      category: txCategory,
      description: txDesc || `${txCategory} - Registro manual`,
      amountUsd: txAmountUsd,
      amountVes: Number((txAmountUsd * farmParams.dollarRateVes).toFixed(2))
    });

    alert('Transacción cargada en el libro diario de la finca.');
    // reset
    setTxDesc('');
    setTxAmountUsd(100);
  };

  // Totals calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amountUsd, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amountUsd, 0);
  const netEarnings = totalIncome - totalExpense;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* SECTION 1: MERCADO GANADERO */}
      {subSection === 'mercado' && (
        <div className="space-y-6">
          {/* Market banner */}
          <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-amber-500/20 text-amber-350 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-bold">
                Pizarra de Precios Referenciales (Junio 2026) 📊
              </span>
              <h3 className="font-poppins font-bold text-2xl tracking-tight mt-1">Precios de Ganado en Pie en Venezuela</h3>
              <p className="text-slate-205 text-sm max-w-xl font-medium">
                Monitoreo estimado según transacciones promedio registradas en subastas del Zulia, Barinas, Apure y Guárico.
              </p>
            </div>
            <div className="absolute right-4 bottom-4 text-amber-500/10 pointer-events-none">
              <Coins className="w-44 h-44" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Rate Grid boards */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Precios de Referencia del Día</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(marketRates).map(key => {
                  const item = marketRates[key];
                  return (
                    <div key={key} className="p-4 bg-slate-50 border border-slate-150 rounded-xl hover:shadow-xs transition-all flex items-center justify-between font-semibold text-xs text-slate-700">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">{item.label}</span>
                        <p className="text-base font-bold font-poppins text-slate-800">
                          ${item.priceUsd.toFixed(2)} <span className="text-xs font-sans text-slate-400 font-medium">/ {item.unit}</span>
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Est: {(item.priceUsd * farmParams.dollarRateVes).toFixed(2)} Bs./{item.unit}
                        </span>
                      </div>

                      {/* Direction Icon */}
                      <span className={`p-2 rounded-lg font-bold text-xs ${
                        item.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : item.trend === 'down' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.trend === 'up' ? '▲ Alza' : item.trend === 'down' ? '▼ Baja' : '■ Estable'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Quick Converter & Seller */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-6">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-slate-500" />
                Calculadora Cambiaria Ganadera
              </h4>

              <div className="space-y-3.5 text-xs font-semibold">
                {/* Choose category */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Tipo o Categoría del animal</label>
                  <select
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                  >
                    <option value="novillo_ceba">Novillo de Ceba ($1.85 / Kg)</option>
                    <option value="vaca_gorda">Vaca Gorda ($1.35 / Kg)</option>
                    <option value="toro_reproductor">Toro de Descarte ($1.50 / Kg)</option>
                    <option value="becerro_levante">Becerro de Levante ($2.10 / Kg)</option>
                    <option value="queso_llanero">Queso Blanco Llanero ($3.20 / Kg)</option>
                  </select>
                </div>

                {/* Input weight */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Cantidad o Peso (Kg / Litros)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full border border-slate-205 rounded-lg p-2 font-medium outline-none"
                    placeholder="Ej: Peso total 450 Kg"
                  />
                </div>

                {/* Quick results display box */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center space-y-2">
                  <p className="text-[10px] uppercase font-mono text-emerald-800 font-bold tracking-wider">Valor Estimado del Lote</p>
                  
                  <h3 className="text-3xl font-poppins font-bold text-emerald-900 tracking-tight leading-none">
                    ${getCalculatedPriceUsd().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
              
              {/* Vender Animal Formulario */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-poppins font-bold text-slate-800 text-sm pb-3 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    Vender Animal / Publicar
                </h4>
                <form onSubmit={handlePubSubmit} className="space-y-3 text-xs font-semibold">
                    <select value={selectedAnimalId} onChange={(e) => setSelectedAnimalId(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2">
                        <option value="">Seleccionar Animal...</option>
                        {animals.map(a => <option key={a.id} value={a.id}>{a.tag} ({a.breed})</option>)}
                    </select>
                    <select value={pubType} onChange={(e) => setPubType(e.target.value as any)} className="w-full border border-slate-200 rounded-lg p-2">
                        <option value="Venta">Venta</option>
                        <option value="Servicio">Servicio</option>
                        <option value="Donación">Donación</option>
                    </select>
                    <input type="number" placeholder="Precio USD" value={pubPrice} onChange={(e) => setPubPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2" />
                    <input type="text" placeholder="Teléfono" value={pubContact} onChange={(e) => setPubContact(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2" />
                    <textarea placeholder="Descripción del animal..." value={pubDescription} onChange={(e) => setPubDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 h-20" />
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-2 rounded-lg">REGISTRAR PUBLICACIÓN</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CONTROL FINANCIERO / EGRESOS E INGRESOS */}
      {subSection === 'finanzas' && (
        <div className="space-y-6">
          {/* Quick statement metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Income */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold font-mono tracking-wider">Ingresos Totales (Leyenda)</span>
                <p className="text-2xl font-poppins font-bold text-emerald-700">+${totalIncome.toLocaleString()}</p>
                <span className="text-xs text-slate-450 font-medium">Por leche, carne, búfalos</span>
              </div>
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg"><ArrowUpRight className="w-6 h-6" /></div>
            </div>

            {/* Expenses */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold font-mono tracking-wider">Egresos Totales (Costos)</span>
                <p className="text-2xl font-poppins font-bold text-rose-600">-${totalExpense.toLocaleString()}</p>
                <span className="text-xs text-slate-450 font-medium">Por nómina, vacunas, repuestos</span>
              </div>
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg"><ArrowDownRight className="w-6 h-6" /></div>
            </div>

            {/* Net Balance */}
            <div className="bg-white p-5 rounded-xl border border-emerald-100 flex items-center justify-between shadow-xs ring-4 ring-emerald-50 bg-[#fbfdfc]">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] text-emerald-800 font-bold font-mono tracking-wider">Utilidad Neta (Balance)</span>
                <p className={`text-2xl font-poppins font-bold ${netEarnings >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
                  ${netEarnings.toLocaleString()}
                </p>
                <span className="text-xs font-bold text-emerald-650">Equi: {(netEarnings * farmParams.dollarRateVes).toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs.</span>
              </div>
              <div className="bg-emerald-800 text-white p-3 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Transaction ledger List */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm bg-slate-50 flex justify-between items-center">
                <span>Libro de Control de Flujo de Caja</span>
                <span className="text-[10px] font-mono font-semibold text-slate-450">Tasa: Bs. {farmParams.dollarRateVes.toFixed(2)}</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Libro contable vacío. Comience agregando una operación de caja.
                  </div>
                ) : (
                  [...transactions].reverse().map(tx => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all font-semibold text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-800 font-bold">{tx.description}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-mono">{tx.category}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {tx.date}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">~ {tx.amountVes.toLocaleString()} Bs.</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Quick Transaction Register Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-6">
              <h4 className="font-poppins font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Registrar Operación Contable
              </h4>

              <form onSubmit={handleTxSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Type */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Tipo de Movimiento</label>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <button
                      type="button"
                      onClick={() => setTxType('income')}
                      className={`py-2 rounded-lg font-bold border ${
                        txType === 'income' ? 'bg-emerald-50 border-emerald-350 text-emerald-800' : 'bg-white border-slate-205 text-slate-500'
                      }`}
                    >
                      Ingreso (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxType('expense')}
                      className={`py-2 rounded-lg font-bold border ${
                        txType === 'expense' ? 'bg-rose-50 border-rose-350 text-rose-800' : 'bg-white border-slate-205 text-slate-500'
                      }`}
                    >
                      Egreso (-)
                    </button>
                  </div>
                </div>

                {/* Category selection */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Categoría de Costo o Venta</label>
                  {txType === 'income' ? (
                    <select
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                    >
                      <option value="Venta Leche">Venta Leche</option>
                      <option value="Venta Queso">Venta Queso Blanco/Bufalina</option>
                      <option value="Venta Carne">Venta de Carne (Animales en Roma)</option>
                      <option value="Venta Cabritos">Venta de Cabras / Ovejas / Genéticos</option>
                      <option value="Inversión">Otros Ingresos / Aportes</option>
                    </select>
                  ) : (
                    <select
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
                    >
                      <option value="Nómina">Nómina / Pago Obreros / Ordeñadores</option>
                      <option value="Medicinas">Medicinas / Vacunas caniles y potrero</option>
                      <option value="Alimento">Alimento Concentrado / Sales Minerales</option>
                      <option value="Combustible">Combustible (Gasoil p/Tractor / Motobomba)</option>
                      <option value="Mantenimiento">Mantenimiento de Cercas / Pasturas / Romana</option>
                    </select>
                  )}
                </div>

                {/* Amount in USD */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Monto total en Divisas (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold font-sans text-slate-400">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full border border-slate-200 rounded-lg p-2 pl-7 font-bold outline-none"
                      placeholder="Ej: valor 150"
                      value={txAmountUsd}
                      onChange={(e) => setTxAmountUsd(Number(e.target.value))}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Calculado en Bs: ~ {(txAmountUsd * farmParams.dollarRateVes).toLocaleString()} Bs.
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Detalle de la Transacción</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Pago quincenal Ramón Pérez, Venta de leche del 03 de Junio"
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium outline-none"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                  />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-slate-600 block">Fecha</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Cargar Transacción
                </button>
              </form>
              
              {/* Productos / Servicios form */}
              <div className="border-t border-slate-100 pt-5 mt-5">
                <h4 className="font-poppins font-bold text-slate-800 text-sm pb-3 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-blue-600" />
                    Registrar Otros Productos/Servicios
                </h4>
                <form onSubmit={handleProductSubmit} className="space-y-3 text-xs font-semibold">
                    <input type="text" placeholder="Nombre" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2" />
                    <select value={productType} onChange={(e) => setProductType(e.target.value as any)} className="w-full border border-slate-200 rounded-lg p-2">
                        <option value="Costo">Costo</option>
                        <option value="Venta">Venta</option>
                    </select>
                    <input type="number" placeholder="Monto" value={productAmount} onChange={(e) => setProductAmount(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2" />
                    <button type="submit" className="w-full bg-blue-800 text-white font-bold py-2 rounded-lg">REGISTRAR PRODUCTO/SERVICIO</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
