/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Clipboard, 
  Activity, 
  UserPlus, 
  GitPullRequest,
  Check,
  Percent,
  FileText
} from 'lucide-react';
import { Animal } from '../types';

interface AnimalsViewProps {
  animals: Animal[];
  onAddAnimal: (animal: Omit<Animal, 'id'>) => void;
  onUpdateAnimal: (animal: Animal) => void;
  onDeleteAnimal: (id: string) => void;
}

export default function AnimalsView({ animals, onAddAnimal, onUpdateAnimal, onDeleteAnimal }: AnimalsViewProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'reproductores'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  // Form states for registering code
  const [formTag, setFormTag] = useState('');
  const [formName, setFormName] = useState('');
  const [formBreed, setFormBreed] = useState('Carora Puro');
  const [formCategory, setFormCategory] = useState<'Vaca' | 'Novilla' | 'Becerra' | 'Toro' | 'Novillo' | 'Becerro' | 'Búfala' | 'Búfalo' | 'Cabra' | 'Oveja'>('Vaca');
  const [formSex, setFormSex] = useState<'M' | 'F'>('F');
  const [formBirthDate, setFormBirthDate] = useState('2024-01-01');
  const [formBirthWeight, setFormBirthWeight] = useState(35);
  const [formWeight, setFormWeight] = useState(400);
  const [formLot, setFormLot] = useState('Lote Ordeño A');
  const [formPasture, setFormPasture] = useState('Potrero El Copey');
  // Pedigree fields
  const [formFather, setFormFather] = useState('');
  const [formMother, setFormMother] = useState('');
  const [formAsocebu, setFormAsocebu] = useState('');
  const [formGenClass, setFormGenClass] = useState('');

  // Search and filter logic
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = 
      animal.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || animal.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTag) return alert("Por favor ingresar número o arete de manera obligatoria.");
    
    onAddAnimal({
      tag: formTag,
      name: formName || `Cattle-${formTag}`,
      breed: formBreed,
      category: formCategory,
      sex: formSex,
      birthDate: formBirthDate,
      birthWeight: Number(formBirthWeight),
      currentWeight: Number(formWeight),
      status: 'Activo',
      pregnancyStatus: formSex === 'F' && (formCategory === 'Vaca' || formCategory === 'Novilla' || formCategory === 'Búfala') ? 'Vacía' : undefined,
      lactationStatus: formSex === 'F' && (formCategory === 'Vaca' || formCategory === 'Búfala') ? 'Seca' : undefined,
      lot: formLot,
      pasture: formPasture,
      fatherTag: formFather || undefined,
      motherTag: formMother || undefined,
      asocebuNumber: formAsocebu || undefined,
      geneticsScore: formGenClass || undefined
    });

    // Reset fields
    setFormTag('');
    setFormName('');
    setFormFather('');
    setFormMother('');
    setFormAsocebu('');
    setFormGenClass('');
    setActiveTab('list');
  };

  const togglePregnancy = (animal: Animal) => {
    const statuses: ('Vacía' | 'Preñada' | 'Por confirmar')[] = ['Vacía', 'Preñada', 'Por confirmar'];
    const currentIdx = statuses.indexOf(animal.pregnancyStatus || 'Vacía');
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    
    onUpdateAnimal({
      ...animal,
      pregnancyStatus: nextStatus
    });
    if (selectedAnimal?.id === animal.id) {
      setSelectedAnimal({ ...selectedAnimal, pregnancyStatus: nextStatus });
    }
  };

  const toggleLactation = (animal: Animal) => {
    const nextStatus: 'En Lactancia' | 'Seca' = animal.lactationStatus === 'En Lactancia' ? 'Seca' : 'En Lactancia';
    onUpdateAnimal({
      ...animal,
      lactationStatus: nextStatus
    });
    if (selectedAnimal?.id === animal.id) {
      setSelectedAnimal({ ...selectedAnimal, lactationStatus: nextStatus });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search and Navigation Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Lista de Ganado
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'add' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Nuevo Registro Individual
          </button>
          <button 
            onClick={() => setActiveTab('reproductores')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'reproductores' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Reporte de Reproducción Hembras
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por arete, nombre, raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-semibold">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-1.5 border-none outline-none text-slate-700 font-semibold cursor-pointer bg-transparent"
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Vaca">Vaca</option>
                <option value="Novilla">Novilla</option>
                <option value="Becerra">Becerra</option>
                <option value="Toro">Toro</option>
                <option value="Novillo">Novillo</option>
                <option value="Becerro">Becerro</option>
                <option value="Búfala">Búfala</option>
                <option value="Búfalo">Búfalo</option>
                <option value="Cabra">Cabra</option>
                <option value="Oveja">Oveja</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Table List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="border-b border-slate-100 p-4 font-poppins font-bold text-slate-800 text-sm bg-slate-50">
              Inventario de Ganado ({filteredAnimals.length} animales filtrados)
            </div>
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredAnimals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Sin registros que coincidan con la búsqueda.
                </div>
              ) : (
                filteredAnimals.map(animal => (
                  <div 
                    key={animal.id} 
                    onClick={() => setSelectedAnimal(animal)}
                    className={`p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all ${selectedAnimal?.id === animal.id ? 'bg-emerald-50/40 border-l-4 border-emerald-600' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 font-mono font-bold flex items-center justify-center text-slate-600 text-xs relative border border-slate-200">
                        #{animal.tag}
                        {animal.pregnancyStatus === 'Preñada' && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 border border-white text-[8px] flex items-center justify-center text-white font-bold" title="Preñada">P</span>
                        )}
                        {animal.lactationStatus === 'En Lactancia' && (
                          <span className="absolute -bottom-1 -right-0 w-3.5 h-3.5 rounded-full bg-indigo-500 border border-white text-[8px] flex items-center justify-center text-white font-bold" title="Lactancia">L</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{animal.name}</span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-semibold">{animal.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 mt-1">Raza: <strong className="font-semibold text-slate-600">{animal.breed}</strong> | Lote: <strong className="font-semibold text-slate-600">{animal.lot}</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-700">{animal.currentWeight} Kg</p>
                        <p className="text-[10px] text-slate-400 font-mono">Potrero: {animal.pasture}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("¿Estás seguro de eliminar este animal del inventario?")) {
                            onDeleteAnimal(animal.id);
                            if (selectedAnimal?.id === animal.id) setSelectedAnimal(null);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Selected Animal Details Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit sticky top-24">
            {selectedAnimal ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-sidebar border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono tracking-wider">Detalles de la Ficha</span>
                    <h3 className="font-poppins font-bold text-slate-800 text-base">{selectedAnimal.name} (Arete #{selectedAnimal.tag})</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded font-bold">{selectedAnimal.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Categoría</span>
                    <strong className="font-semibold text-slate-800">{selectedAnimal.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Raza</span>
                    <strong className="font-semibold text-slate-800">{selectedAnimal.breed}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Peso Reciente</span>
                    <strong className="font-semibold text-slate-800">{selectedAnimal.currentWeight} Kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Ubicación Potrero</span>
                    <strong className="font-semibold text-slate-800">{selectedAnimal.pasture}</strong>
                  </div>
                </div>

                {/* Pedigree Block */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                  <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-1">
                    <GitPullRequest className="w-3.5 h-3.5 text-slate-500" />
                    Ascendencia & Certificados (ASOCEBU)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Padre o Pajuela:</span>
                      <span className="font-medium text-slate-700">{selectedAnimal.fatherTag || 'Sin registrar'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Madre:</span>
                      <span className="font-medium text-slate-700">{selectedAnimal.motherTag || 'Sin registrar'}</span>
                    </div>
                    <div className="col-span-2 border-t border-slate-200 mt-1 pt-1">
                      <span className="text-slate-400 block">Registro Oficial / Puntaje:</span>
                      <span className="font-semibold text-emerald-800">{selectedAnimal.asocebuNumber ? `${selectedAnimal.asocebuNumber} (${selectedAnimal.geneticsScore})` : 'Sin registro oficial ASOCEBU'}</span>
                    </div>
                  </div>
                </div>

                {/* Female Exclusive reproductive parameters */}
                {(selectedAnimal.sex === 'F' && (selectedAnimal.category === 'Vaca' || selectedAnimal.category === 'Novilla' || selectedAnimal.category === 'Búfala')) && (
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-pink-500" />
                      Estado Reproductivo & Lactancia
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-pink-50/50 border border-pink-100 p-2.5 rounded-lg">
                        <span className="text-[10px] text-pink-800 block font-semibold mb-1">Estado de Preñez</span>
                        <p className="text-xs font-bold text-pink-905">{selectedAnimal.pregnancyStatus || 'Vacía'}</p>
                        <button 
                          onClick={() => togglePregnancy(selectedAnimal)}
                          className="mt-1.5 w-full text-center bg-pink-100 hover:bg-pink-200 text-pink-800 py-1 rounded text-[9px] font-bold transition-all"
                        >
                          Cambiar Estado
                        </button>
                      </div>

                      {(selectedAnimal.category === 'Vaca' || selectedAnimal.category === 'Búfala') && (
                        <div className="bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg">
                          <span className="text-[10px] text-indigo-800 block font-semibold mb-1">Estado Lactancia</span>
                          <p className="text-xs font-bold text-indigo-905">{selectedAnimal.lactationStatus || 'Seca'}</p>
                          <button 
                            onClick={() => toggleLactation(selectedAnimal)}
                            className="mt-1.5 w-full text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-1 rounded text-[9px] font-bold transition-all"
                          >
                            Alternar Lactancia
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
                <Clipboard className="h-10 w-10 text-slate-300" />
                <span>Selecciona un animal para ver su ficha completa, genealogía y modificar sus estatus.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPONENT: REGISTER FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleCreateSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-poppins font-bold text-slate-800 text-base">Nuevo Registro Individual de Ganado</h3>
            <p className="text-xs text-slate-400">Registre un animal individual agregando su arete y detalles de pedigrí.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            {/* Tag / Arete */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Número de Arete o Marca *</label>
              <input
                type="text"
                required
                placeholder="Ej: 088, 120"
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Nombre del Animal</label>
              <input
                type="text"
                placeholder="Ej: Mariposa, Catire, Campesina"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Breed Selection */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Raza Predominante</label>
              <select
                value={formBreed}
                onChange={(e) => setFormBreed(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
              >
                <option value="Carora Puro">Carora Puro (Raza Criolla Venezolana)</option>
                <option value="Girolando F1">Girolando F1 (Holstein x Gyr)</option>
                <option value="Brahman Gris">Brahman Gris</option>
                <option value="Senepol Puro">Senepol Puro</option>
                <option value="Guzerá Puro">Guzerá Puro</option>
                <option value="Pardo Suizo">Pardo Suizo</option>
                <option value="Mosaico Criollo">Mosaico Criollo Venezolano</option>
                <option value="Búfala Murrah">Búfala Murrah (Búfalos)</option>
                <option value="Búfala Mediterránea">Búfala Mediterránea</option>
                <option value="Alpina / Saanen">Cabra (Alpina / Saanen)</option>
                <option value="Santa Inés">Oveja Santa Inés</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Categoría Ganadera</label>
              <select
                value={formCategory}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setFormCategory(cat);
                  // Auto apply sex
                  if (['Vaca', 'Novilla', 'Becerra', 'Búfala'].includes(cat)) {
                    setFormSex('F');
                  } else if (['Toro', 'Novillo', 'Becerro', 'Búfalo'].includes(cat)) {
                    setFormSex('M');
                  }
                }}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
              >
                <option value="Vaca">Vaca (Hembra adulta)</option>
                <option value="Novilla">Novilla (Hembra joven p/servicio)</option>
                <option value="Becerra">Becerra (Hembra lactante)</option>
                <option value="Toro">Toro (Reproductor)</option>
                <option value="Novillo">Novillo (Macho m/18 meses ceba)</option>
                <option value="Becerro">Becerro (Macho lactante)</option>
                <option value="Búfala">Búfala</option>
                <option value="Búfalo">Búfalo</option>
                <option value="Cabra">Cabra</option>
                <option value="Oveja">Oveja</option>
              </select>
            </div>

            {/* Sex selection */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Sexo</label>
              <div className="flex gap-4 p-2 bg-slate-50 rounded-lg">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={formSex === 'F'} onChange={() => setFormSex('F')} />
                  <span>Hembra (H)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={formSex === 'M'} onChange={() => setFormSex('M')} />
                  <span>Macho (M)</span>
                </label>
              </div>
            </div>

            {/* BirthDate */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formBirthDate}
                onChange={(e) => setFormBirthDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Current Weight */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Peso Actual (Kg)</label>
              <input
                type="number"
                value={formWeight}
                onChange={(e) => setFormWeight(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Birth Weight */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Peso al Nacer (Kg)</label>
              <input
                type="number"
                value={formBirthWeight}
                onChange={(e) => setFormBirthWeight(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Lot Location */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Lote Asignado</label>
              <select
                value={formLot}
                onChange={(e) => setFormLot(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium bg-white"
              >
                <option value="Lote Ordeño A">Lote Ordeño A</option>
                <option value="Lote Escoteras">Lote Escoteras (Horras)</option>
                <option value="Lote Levante Hembras">Lote Levante Hembras</option>
                <option value="Lote Ceba Novillos">Lote Ceba Novillos (Engorde)</option>
                <option value="Cuna / Becerros">Cuna / Becerros</option>
                <option value="Lote Bufalina Ordeño">Lote Bufalina Ordeño</option>
              </select>
            </div>

            {/* Pasture Location */}
            <div className="space-y-1">
              <label className="text-slate-600 block">Potrero de Pastoreo</label>
              <input
                type="text"
                placeholder="Ej: Potrero El Copey, La Sabana"
                value={formPasture}
                onChange={(e) => setFormPasture(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* GENETICS PEDIGREE EXTRA SEGMENT (Highly valued in associations) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              Genealogía & ASOCEBU (Opcional)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 font-semibold block">Arete/Identificación del Padre o Sire Pajuela</label>
                <input
                  type="text"
                  placeholder="Ej: SEN-KING-05"
                  value={formFather}
                  onChange={(e) => setFormFather(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-semibold block">Arete/Identificación de la Madre</label>
                <input
                  type="text"
                  placeholder="Ej: M-321-Carora"
                  value={formMother}
                  onChange={(e) => setFormMother(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-semibold block">Número de Registro ASOCEBU / Asociación</label>
                <input
                  type="text"
                  placeholder="Ej: VE-CAR-8499"
                  value={formAsocebu}
                  onChange={(e) => setFormAsocebu(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-semibold block">Puntaje Lineal o Clasificación Genética</label>
                <input
                  type="text"
                  placeholder="Ej: 92/100, Muy Buena (MB)"
                  value={formGenClass}
                  onChange={(e) => setFormGenClass(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              REGISTRAR
            </button>
          </div>
        </form>
      )}

      {/* COMPONENT: REPRODUCTIVE INFOS (HEMBRAS REPORT) */}
      {activeTab === 'reproductores' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-xl">
            <div>
              <h3 className="font-poppins font-bold text-slate-800 text-base">Informe Reproductivo y Lactancia (Hembras)</h3>
              <p className="text-xs text-slate-400">Control de vacas lactando, secas, vacías y preñadas en ordeño.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold">
              <div className="bg-pink-100/50 border border-pink-200 text-pink-800 px-4 py-2 rounded-lg">
                <p className="text-[10px] text-pink-600 uppercase font-mono">Total Preñadas</p>
                <strong className="text-base font-bold">{animals.filter(a => a.pregnancyStatus === 'Preñada').length}</strong>
              </div>
              <div className="bg-indigo-100/50 border border-indigo-200 text-indigo-800 px-4 py-2 rounded-lg">
                <p className="text-[10px] text-indigo-600 uppercase font-mono">En Lactancia</p>
                <strong className="text-base font-bold">{animals.filter(a => a.lactationStatus === 'En Lactancia').length}</strong>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500 font-medium">
              <thead className="text-[10px] text-slate-400 uppercase font-mono bg-slate-50">
                <tr>
                  <th className="p-3">Arete</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Raza</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Preñez</th>
                  <th className="p-3">Lactancia</th>
                  <th className="p-3">Lote / Potrero</th>
                  <th className="p-3 text-center">Configurar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {animals.filter(a => a.sex === 'F').map(animal => (
                  <tr key={animal.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-3 font-mono font-bold text-slate-900">#{animal.tag}</td>
                    <td className="p-3 font-bold">{animal.name}</td>
                    <td className="p-3 text-slate-500">{animal.breed}</td>
                    <td className="p-3">{animal.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                        animal.pregnancyStatus === 'Preñada' 
                          ? 'bg-pink-100 text-pink-800' 
                          : animal.pregnancyStatus === 'Por confirmar'
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {animal.pregnancyStatus || 'Vacía'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                        animal.lactationStatus === 'En Lactancia' 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {animal.lactationStatus || 'Seca'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-400">
                      {animal.lot} <span className="block text-[10px] font-mono">{animal.pasture}</span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => togglePregnancy(animal)}
                          className="bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 px-2 py-1 rounded-[4px] text-[9px] font-bold transition-all"
                          title="Alternar Preñez"
                        >
                          Preñez
                        </button>
                        {(animal.category === 'Vaca' || animal.category === 'Búfala') && (
                          <button 
                            onClick={() => toggleLactation(animal)}
                            className="bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-1 rounded-[4px] text-[9px] font-bold transition-all"
                            title="Alternar Lactancia"
                          >
                            Lactar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
