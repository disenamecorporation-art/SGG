/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Animal {
  id: string;
  tag: string; // Arete o Número
  name: string;
  breed: string; // Raza: Carora, Senepol, Girolando, Brahman, Bufala Murrah, etc.
  category: 'Vaca' | 'Novilla' | 'Becerra' | 'Toro' | 'Novillo' | 'Becerro' | 'Búfala' | 'Búfalo' | 'Cabra' | 'Oveja';
  sex: 'M' | 'F';
  birthDate: string;
  birthWeight: number; // kg
  currentWeight: number; // kg
  weaningWeight?: number; // kg
  weight12Months?: number; // kg
  status: 'Activo' | 'Vendido' | 'Muerto';
  pregnancyStatus?: 'Vacía' | 'Preñada' | 'Por confirmar';
  reproductionStatus?: 'Donante' | 'Receptora' | 'Transferencia' | 'Descarte' | 'Normal';
  lactationStatus?: 'Seca' | 'En Lactancia';
  lot: string; // Lote (ej: Lote A, Ordeño 1, Escoteras, Ceba)
  pasture: string; // Potrero (ej: Potrero El Copey, La Laguna)
  // Datos Genéticos & Registro ASOCEBU
  fatherTag?: string;
  motherTag?: string;
  asocebuNumber?: string; // Registro oficial
  geneticsScore?: string; // Evaluación lineal o % Pureza
  
  // Pedigrí Completo
  pedigree?: Pedigree;
}

export interface Pedigree {
  // 1a Gen (Padres)
  parents: { fatherId: string; motherId: string };
  // 2a Gen (Abuelos)
  grandParents: {
    paternalGrandFather: string;
    paternalGrandMother: string;
    maternalGrandFather: string;
    maternalGrandMother: string;
  };
  // 3a Gen (Bisabuelos)
  greatGrandParents: {
    paternalGreatGrandFather1: string;
    paternalGreatGrandMother1: string;
    paternalGreatGrandFather2: string;
    paternalGreatGrandMother2: string;
    maternalGreatGrandFather1: string;
    maternalGreatGrandMother1: string;
    maternalGreatGrandFather2: string;
    maternalGreatGrandMother2: string;
  };
}

export interface MilkLog {
  id: string;
  date: string;
  animalId: string;
  tag: string;
  morningYield: number; // kg
  afternoonYield: number; // kg
  totalYield: number; // kg
}

export interface MastitisLog {
  id: string;
  date: string;
  animalId: string;
  tag: string;
  // Cuartos afectados
  quadrants: {
    LF: boolean; // Anterior Izquierdo (Left Front)
    RF: boolean; // Anterior Derecho (Right Front)
    LR: boolean; // Posterior Izquierdo (Left Rear)
    RR: boolean; // Posterior Derecho (Right Rear)
  };
  grade: 'Negativo' | 'Traza' | 'Grado 1' | 'Grado 2' | 'Grado 3';
  treatmentApplied: string;
}

export interface WeightRecord {
  id: string;
  date: string;
  animalId: string;
  tag: string;
  weight: number; // kg
  adg: number; // Ganancia Diaria Promedio (Average Daily Gain) kg/día
}

export interface Medication {
  id: string;
  name: string;
  activeIngredient: string; // Principio Activo (ej: Ivermectina, Oxitetraciclina)
  stock: number; // Cantidad disponible
  unit: 'ml' | 'Dosis' | 'Frasco' | 'Kg';
  withdrawalPeriod: number; // Días de retiro (leche/carne)
  category: string;
  description?: string;
}

export interface Breed {
  id: string;
  name: string;
  species: 'Bovino' | 'Bufalino' | 'Caprino' | 'Ovino';
}

export interface AnimalCategory {
  id: string;
  name: string;
  species: 'Bovino' | 'Bufalino' | 'Caprino' | 'Ovino';
}

export interface OtherProductService {
  id: string;
  name: string;
  type: 'Costo' | 'Venta';
  amount: number;
}

export interface MedicalTask {
  month: 'ENE' | 'FEB' | 'MAR' | 'ABR' | 'MAY' | 'JUN' | 'JUL' | 'AGO' | 'SEP' | 'OCT' | 'NOV' | 'DIC';
  vaccineOrMedicationName: string;
}

export interface MedicalPlan {
  id: string;
  year: number;
  tasks: MedicalTask[];
}

export interface TreatmentLog {
  id: string;
  date: string;
  animalId: string;
  tag: string;
  medicineId: string;
  medicineName: string;
  dose: string;
  withdrawalEnd: string; // Fecha fin de retiro
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  category: 'Vacunación' | 'Tratamiento' | 'Servicio' | 'Ordeño' | 'Otros';
  priority: 'Alta' | 'Media' | 'Baja';
}

// NUEVOS TIPOS: Sanidad Masiva
export interface MassTreatment {
  id: string;
  date: string;
  groupType: 'Lote' | 'Potrero' | 'Todo';
  groupName: string; // Nombre del Lote o Potrero aplicador
  medicineId: string;
  medicineName: string;
  dose: string;
  totalAnimals: number;
  personnel: string;
}

export interface MassVaccination {
  id: string;
  date: string;
  vaccineType: 'Aftosa' | 'Rabia' | 'Brucelosis' | 'Triple Portal' | 'Carbonoso';
  groupType: 'Lote' | 'Potrero' | 'Todo';
  groupName: string;
  totalAnimals: number;
  batchNumber: string; // Lote de la vacuna
  nextDoseDate: string;
}

// NUEVOS TIPOS: Reproducción
export interface BreedingSeason {
  id: string;
  name: string; // ej: Temporada Invierno 2026
  startDate: string;
  endDate: string;
  breedingType: 'IA' | 'Monta Natural';
  sireId: string; // Toro o Pajuela
  sireTag: string; // Nombre/Tag del Reproductor
  cowsCount: number;
  palpationsCount: number;
  pregnanciesConfirmed: number;
}

export interface BullEvaluation {
  id: string;
  date: string;
  bullId: string;
  bullTag: string;
  andrologyScore: number; // % (ej: 85%)
  libidoRating: 'Excelente' | 'Bueno' | 'Regular' | 'Pobre';
  matingCount: number; // Servicios registrados
  conceptionRate: number; // % éxito
  scrotalCircumference: number; // cm
  notes: string;
}

// NUEVOS TIPOS: Raza / Asociaciones
export interface BuffaloProduction {
  id: string;
  date: string;
  totalBuffaloes: number;
  milkingBuffaloes: number;
  dailyYieldKg: number; // Promedio diario total kg
  averageFat: number; // % Grasa (típico 7-9%)
  averageProtein: number; // % Proteína (típico 3.8-4.5%)
  cheeseProjectionKg: number; // Estimado de Queso (Queso de mano, llanero, etc)
}

export interface SmallRuminantLog {
  id: string;
  date: string;
  species: 'Cabra' | 'Oveja';
  breed: string; // ej: Alpine, Saanen, Santa Inés, Bergamasca
  actionType: 'Leche' | 'Pesaje' | 'Parto Múltiple';
  tag: string;
  milkYield?: number; // Kg/litros
  weight?: number; // Kg
  prolificacyCount?: number; // Crías nacidas (1, 2, 3, etc)
  notes: string;
}

// NUEVOS TIPOS: Parámetros y Finanzas
export interface FarmParams {
  farmName: string;
  climateZone: string; // ej: Bosque Seco Tropical, Llanos Centro-Orientales
  temperatureMax: number;
  temperatureMin: number;
  season: 'Lluvia' | 'Sequía';
  precipitation: number; // mm/año
  dryMatterYield: number; // Ton/Ha/año de Materia Seca (pasturas)
  stockingRate: number; // U.A./Ha (Unidad Animal por Hectárea)
  dollarRateVes: number; // Tipo de cambio Bs. / USD (ej: 45.0)
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseStatus?: 'No Configurado' | 'Conectado' | 'Fallo de Conexión';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string; // ej: Venta Leche, Venta Carne, Compra Alimento, Medicinas, Combustible, Nómina
  description: string;
  amountUsd: number;
  amountVes: number;
}

export interface Publication {
  id: string;
  animalId: string;
  type: 'Venta' | 'Servicio' | 'Donación';
  priceUsd: number;
  contactNumber: string;
  description: string;
  active: boolean;
}
