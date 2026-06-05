/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Animal,
  MilkLog,
  MastitisLog,
  WeightRecord,
  Medicine,
  TreatmentLog,
  Task,
  MassTreatment,
  MassVaccination,
  BreedingSeason,
  BullEvaluation,
  BuffaloProduction,
  SmallRuminantLog,
  FarmParams,
  Transaction
} from './types';

// INITIAL DATA - Highly contextual to Venezuelan livestock farming (Carora, Girolando, Brahman, Murrah, etc.)
const INITIAL_FARM_PARAMS: FarmParams = {
  farmName: "Hacienda La Esmeralda (Barinas, Venezuela)",
  climateZone: "Llanos Occidentales (Bosque Seco Tropical)",
  temperatureMax: 33,
  temperatureMin: 23,
  season: "Lluvia", // En junio el invierno/lluvia está plenamente activo en los llanos
  precipitation: 1650,
  dryMatterYield: 14.5, // Ton/Ha/año de pasto estrella y guinea
  stockingRate: 1.8, // 1.8 vacas/hectárea
  dollarRateVes: 45.20, // Tasa promedio de cambio Bs. / USD
  supabaseUrl: "",
  supabaseAnonKey: "",
  supabaseStatus: "No Configurado"
};

const INITIAL_ANIMALS: Animal[] = [
  // VACAS LECHERAS
  {
    id: "a1",
    tag: "012",
    name: "Mariposa",
    breed: "Carora Puro",
    category: "Vaca",
    sex: "F",
    birthDate: "2020-04-12",
    birthWeight: 38,
    currentWeight: 495,
    status: "Activo",
    pregnancyStatus: "Preñada",
    lactationStatus: "En Lactancia",
    lot: "Lote Ordeño A",
    pasture: "Potrero El Copey",
    fatherTag: "CAR-099",
    motherTag: "M-321-Carora",
    asocebuNumber: "VE-CAR-8499",
    geneticsScore: "92/100 (Excelente Raza Carora)",
    weaningWeight205: 195,
    weight540: 380
  },
  {
    id: "a2",
    tag: "088",
    name: "Guayabera",
    breed: "Girolando F1",
    category: "Vaca",
    sex: "F",
    birthDate: "2021-02-18",
    birthWeight: 36,
    currentWeight: 470,
    status: "Activo",
    pregnancyStatus: "Vacía",
    lactationStatus: "En Lactancia",
    lot: "Lote Ordeño A",
    pasture: "Potrero El Copey",
    fatherTag: "HOL-F1-03",
    motherTag: "GYR-55"
  },
  {
    id: "a3",
    tag: "104",
    name: "Barinas",
    breed: "Guzerá x Carora",
    category: "Vaca",
    sex: "F",
    birthDate: "2019-11-05",
    birthWeight: 40,
    currentWeight: 512,
    status: "Activo",
    pregnancyStatus: "Preñada",
    lactationStatus: "En Lactancia",
    lot: "Lote Ordeño A",
    pasture: "Potrero El Copey",
    fatherTag: "GUZ-PATRON-40"
  },
  {
    id: "a4",
    tag: "115",
    name: "Campesina",
    breed: "Pardo Suizo",
    category: "Vaca",
    sex: "F",
    birthDate: "2021-08-30",
    birthWeight: 37,
    currentWeight: 460,
    status: "Activo",
    pregnancyStatus: "Por confirmar",
    lactationStatus: "Seca",
    lot: "Lote Escoteras",
    pasture: "Potrero El Caño"
  },
  // NOVILLAS & BECERRAS
  {
    id: "a5",
    tag: "204",
    name: "Orquídea",
    breed: "Senepol x Brahman",
    category: "Novilla",
    sex: "F",
    birthDate: "2023-05-15",
    birthWeight: 32,
    currentWeight: 310,
    status: "Activo",
    pregnancyStatus: "Vacía",
    lot: "Lote Levante Hembras",
    pasture: "Potrero La Sabana"
  },
  {
    id: "a6",
    tag: "305",
    name: "Acuarela",
    breed: "Girolando 5/8",
    category: "Becerra",
    sex: "F",
    birthDate: "2025-01-10",
    birthWeight: 30,
    currentWeight: 145,
    status: "Activo",
    lot: "Cuna / Becerros",
    pasture: "Potrero Las Palmeras"
  },
  // TOROS / REPRODUCTORES
  {
    id: "a7",
    tag: "901",
    name: "Catire",
    breed: "Senepol Puro",
    category: "Toro",
    sex: "M",
    birthDate: "2018-09-01",
    birthWeight: 42,
    currentWeight: 750,
    status: "Activo",
    lot: "Lote Reproductores",
    pasture: "Potrero El Caño",
    asocebuNumber: "VE-SEN-0199",
    fatherTag: "SEN-KING-USA",
    motherTag: "SEN-REINA-92"
  },
  {
    id: "a8",
    tag: "902",
    name: "Rey Guzerá",
    breed: "Guzerá Puro",
    category: "Toro",
    sex: "M",
    birthDate: "2019-03-24",
    birthWeight: 45,
    currentWeight: 810,
    status: "Activo",
    lot: "Lote Reproductores",
    pasture: "Potrero La Laguna",
    asocebuNumber: "VE-GUZ-4512",
    fatherTag: "GUZ-ALELUYA-05"
  },
  // NOVILLOS DE CEBA
  {
    id: "a9",
    tag: "451",
    name: "Novillo 451",
    breed: "Brahman Gris",
    category: "Novillo",
    sex: "M",
    birthDate: "2023-11-12",
    birthWeight: 35,
    currentWeight: 445,
    status: "Activo",
    lot: "Lote Ceba Novillos",
    pasture: "Potrero El Estero"
  },
  {
    id: "a10",
    tag: "452",
    name: "Novillo 452",
    breed: "Brahman Blanco x Senepol",
    category: "Novillo",
    sex: "M",
    birthDate: "2023-10-31",
    birthWeight: 34,
    currentWeight: 462,
    status: "Activo",
    lot: "Lote Ceba Novillos",
    pasture: "Potrero El Estero"
  },
  // BUFALOS (Criabúfalo)
  {
    id: "ab1",
    tag: "B10",
    name: "Zuliana",
    breed: "Búfala Murrah",
    category: "Búfala",
    sex: "F",
    birthDate: "2021-09-14",
    birthWeight: 45,
    currentWeight: 580,
    status: "Activo",
    pregnancyStatus: "Preñada",
    lactationStatus: "En Lactancia",
    lot: "Lote Bufalina Ordeño",
    pasture: "Potrero Bajo Húmedo"
  },
  {
    id: "ab2",
    tag: "B11",
    name: "Apureña",
    breed: "Búfala Mediterránea",
    category: "Búfala",
    sex: "F",
    birthDate: "2022-01-05",
    birthWeight: 43,
    currentWeight: 535,
    status: "Activo",
    pregnancyStatus: "Vacía",
    lactationStatus: "En Lactancia",
    lot: "Lote Bufalina Ordeño",
    pasture: "Potrero Bajo Húmedo"
  }
];

// REGISTRO DE LECHE (LITROS O KG)
const INITIAL_MILK_LOGS: MilkLog[] = [
  { id: "m1", date: "2026-06-03", animalId: "a1", tag: "012", morningYield: 11.5, afternoonYield: 8.0, totalYield: 19.5 },
  { id: "m2", date: "2026-06-03", animalId: "a2", tag: "088", morningYield: 9.0, afternoonYield: 6.5, totalYield: 15.5 },
  { id: "m3", date: "2026-06-03", animalId: "a3", tag: "104", morningYield: 8.5, afternoonYield: 5.5, totalYield: 14.0 },
  { id: "m4", date: "2026-06-02", animalId: "a1", tag: "012", morningYield: 12.0, afternoonYield: 8.2, totalYield: 20.2 },
  { id: "m5", date: "2026-06-02", animalId: "a2", tag: "088", morningYield: 9.5, afternoonYield: 6.0, totalYield: 15.5 },
  { id: "m6", date: "2026-06-02", animalId: "a3", tag: "104", morningYield: 8.0, afternoonYield: 6.0, totalYield: 14.0 }
];

// MASTITIS
const INITIAL_MASTITIS_LOGS: MastitisLog[] = [
  {
    id: "mas1",
    date: "2026-05-28",
    animalId: "a2",
    tag: "088",
    quadrants: { LF: false, RF: true, LR: false, RR: false },
    grade: "Traza",
    treatmentApplied: "Lavado antiséptico y monitoreo"
  },
  {
    id: "mas2",
    date: "2026-06-01",
    animalId: "a3",
    tag: "104",
    quadrants: { LF: false, RF: false, LR: true, RR: false },
    grade: "Grado 1",
    treatmentApplied: "Tratamiento intramamario - Masticilina"
  }
];

// HISTORIAL DE PESOS
const INITIAL_WEIGHT_RECORDS: WeightRecord[] = [
  // Levante y Ceba Novillo 451
  { id: "w1", date: "2026-04-01", animalId: "a9", tag: "451", weight: 405, adg: 0.0 },
  { id: "w2", date: "2026-05-01", animalId: "a9", tag: "451", weight: 426, adg: 0.70 },
  { id: "w3", date: "2026-06-01", animalId: "a9", tag: "451", weight: 445, adg: 0.63 },
  // Novillo 452
  { id: "w4", date: "2026-04-01", animalId: "a10", tag: "452", weight: 420, adg: 0.0 },
  { id: "w5", date: "2026-05-01", animalId: "a10", tag: "452", weight: 442, adg: 0.73 },
  { id: "w6", date: "2026-06-01", animalId: "a10", tag: "452", weight: 462, adg: 0.67 }
];

// INVENTARIO DE MEDICAMENTOS veterinarios comunes en Venezuela (Fever, desparasitante, vacunas)
const INITIAL_MEDICINES: Medicine[] = [
  { id: "med1", name: "Ivermectina 1%", activeIngredient: "Ivermectina", stock: 450, unit: "ml", withdrawalPeriod: 35 },
  { id: "med2", name: "Oxitetraciclina L.A.", activeIngredient: "Oxitetraciclina", stock: 200, unit: "ml", withdrawalPeriod: 28 },
  { id: "med3", name: "Masticilina Forte", activeIngredient: "Cefalosporina intramamaria", stock: 12, unit: "Dosis", withdrawalPeriod: 3 },
  { id: "med4", name: "Complejo AD3E (Vit-O-Mineral)", activeIngredient: "Vitaminas liposolubles", stock: 350, unit: "ml", withdrawalPeriod: 0 },
  { id: "med5", name: "Aftogan (Vacuna)", activeIngredient: "Virus inactivado de Fiebre Aftosa", stock: 50, unit: "Dosis", withdrawalPeriod: 0 }
];

const INITIAL_TREATMENT_LOGS: TreatmentLog[] = [
  {
    id: "t1",
    date: "2026-05-25",
    animalId: "a1",
    tag: "012",
    medicineId: "med4",
    medicineName: "Complejo AD3E (Vit-O-Mineral)",
    dose: "10 ml IM",
    withdrawalEnd: "2026-05-25",
    notes: "Vitamina de soporte pre-parto"
  },
  {
    id: "t2",
    date: "2026-06-01",
    animalId: "a3",
    tag: "104",
    medicineId: "med3",
    medicineName: "Masticilina Forte",
    dose: "1 jer/cuarto",
    withdrawalEnd: "2026-06-04",
    notes: "Aplicado en cuarto posterior izquierdo por Mastitis"
  }
];

// TAREAS / CALENDARIO
const INITIAL_TASKS: Task[] = [
  { id: "tk1", title: "Vacunación Fiebre Aftosa Ciclo I", dueDate: "2026-06-15", completed: false, category: "Vacunación", priority: "Alta" },
  { id: "tk2", title: "Palpación Lote de Vacas El Copey", dueDate: "2026-06-10", completed: false, category: "Servicio", priority: "Media" },
  { id: "tk3", title: "Pesaje Mensual Lote Levante", dueDate: "2026-06-05", completed: true, category: "Otros", priority: "Baja" },
  { id: "tk4", title: "Registrar dosis Ivermectina Novillos", dueDate: "2026-06-02", completed: true, category: "Tratamiento", priority: "Media" }
];

// TRANSACCIONES FINANCIERAS
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx1", date: "2026-06-01", type: "income", category: "Venta Leche", description: "Venta de 1200 litros a Quesera El Samán", amountUsd: 480, amountVes: 21696 },
  { id: "tx2", date: "2026-05-30", type: "expense", category: "Nómina", description: "Pago quincenal obreros (3 ordeñadores)", amountUsd: 300, amountVes: 13560 },
  { id: "tx3", date: "2026-05-28", type: "expense", category: "Medicinas", description: "Compra vacunas aftosa y ivermectina", amountUsd: 120, amountVes: 5424 },
  { id: "tx4", date: "2026-05-25", type: "income", category: "Venta Carne", description: "Venta de 2 novillos gordos de ceba", amountUsd: 1480, amountVes: 66896 }
];

// NUEVOS DATOS (Sanidad Masiva)
const INITIAL_MASS_TREATMENTS: MassTreatment[] = [
  {
    id: "mt1",
    date: "2026-05-20",
    groupType: "Lote",
    groupName: "Lote Levante Hembras",
    medicineId: "med1",
    medicineName: "Ivermectina 1%",
    dose: "5 ml por animal (SC)",
    totalAnimals: 15,
    personnel: "Ramón Pérez (Encargado)"
  }
];

const INITIAL_MASS_VACCINATIONS: MassVaccination[] = [
  {
    id: "mv1",
    date: "2026-05-10",
    vaccineType: "Aftosa",
    groupType: "Todo",
    groupName: "Rebaño Completo",
    totalAnimals: 48,
    batchNumber: "AFT-2026-94X",
    nextDoseDate: "2026-11-10"
  },
  {
    id: "mv2",
    date: "2026-05-12",
    vaccineType: "Rabia",
    groupType: "Lote",
    groupName: "Lote Levante Hembras",
    totalAnimals: 15,
    batchNumber: "RAB-771",
    nextDoseDate: "2027-05-12"
  }
];

// NUEVOS DATOS (Reproducción)
const INITIAL_BREEDING_SEASONS: BreedingSeason[] = [
  {
    id: "bs1",
    name: "Temporada de Lluvias 2026",
    startDate: "2026-05-15",
    endDate: "2026-08-15",
    breedingType: "Monta Natural",
    sireId: "a7",
    sireTag: "Toro Catire (#901)",
    cowsCount: 18,
    palpationsCount: 6,
    pregnanciesConfirmed: 4
  }
];

const INITIAL_BULL_EVALUATIONS: BullEvaluation[] = [
  {
    id: "be1",
    date: "2026-04-10",
    bullId: "a7",
    bullTag: "Toro Catire (#901)",
    andrologyScore: 92,
    libidoRating: "Excelente",
    matingCount: 24,
    conceptionRate: 78,
    scrotalCircumference: 41.5,
    notes: "Excelente motilidad masiva e individual. Sin anomalías en testículos ni epidídimo."
  },
  {
    id: "be2",
    date: "2026-04-11",
    bullId: "a8",
    bullTag: "Rey Guzerá (#902)",
    andrologyScore: 88,
    libidoRating: "Bueno",
    matingCount: 15,
    conceptionRate: 72,
    scrotalCircumference: 39.0,
    notes: "Apto para monta de campo. Libido adecuado."
  }
];

// NUEVOS DATOS (Razas / Asociaciones)
const INITIAL_BUFFALO_PRODUCTION: BuffaloProduction[] = [
  { id: "bp1", date: "2026-06-03", totalBuffaloes: 12, milkingBuffaloes: 8, dailyYieldKg: 48.0, averageFat: 7.8, averageProtein: 4.1, cheeseProjectionKg: 9.6 },
  { id: "bp2", date: "2026-06-02", totalBuffaloes: 12, milkingBuffaloes: 8, dailyYieldKg: 46.5, averageFat: 7.7, averageProtein: 4.2, cheeseProjectionKg: 9.2 }
];

const INITIAL_SMALL_RUMINANT_LOGS: SmallRuminantLog[] = [
  { id: "sr1", date: "2026-06-01", species: "Cabra", breed: "Alpina", actionType: "Leche", tag: "C-01", milkYield: 3.2, notes: "Excelente producción matutina" },
  { id: "sr2", date: "2026-06-02", species: "Oveja", breed: "Santa Inés", actionType: "Parto Múltiple", tag: "O-22", prolificacyCount: 2, notes: "Nacieron 2 corderos viables de 3.1kg y 2.9kg" },
  { id: "sr3", date: "2026-06-03", species: "Cabra", breed: "Saanen", actionType: "Pesaje", tag: "C-44", weight: 44, notes: "Control de crecimiento a los 18 meses" }
];

// HELPER FOR INITIAL DATA IN-MEMORY AND LOCALSTORAGE PERSISTENCE
export class Database {
  static getFarmParams(): FarmParams {
    try {
      const stored = localStorage.getItem('sgg_farm_params');
      return stored ? JSON.parse(stored) : INITIAL_FARM_PARAMS;
    } catch {
      return INITIAL_FARM_PARAMS;
    }
  }
  static saveFarmParams(data: FarmParams): void {
    try {
      localStorage.setItem('sgg_farm_params', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getAnimals(): Animal[] {
    try {
      const stored = localStorage.getItem('sgg_animals');
      return stored ? JSON.parse(stored) : INITIAL_ANIMALS;
    } catch {
      return INITIAL_ANIMALS;
    }
  }
  static saveAnimals(data: Animal[]): void {
    try {
      localStorage.setItem('sgg_animals', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getMilkLogs(): MilkLog[] {
    try {
      const stored = localStorage.getItem('sgg_milk_logs');
      return stored ? JSON.parse(stored) : INITIAL_MILK_LOGS;
    } catch {
      return INITIAL_MILK_LOGS;
    }
  }
  static saveMilkLogs(data: MilkLog[]): void {
    try {
      localStorage.setItem('sgg_milk_logs', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getMastitisLogs(): MastitisLog[] {
    try {
      const stored = localStorage.getItem('sgg_mastitis_logs');
      return stored ? JSON.parse(stored) : INITIAL_MASTITIS_LOGS;
    } catch {
      return INITIAL_MASTITIS_LOGS;
    }
  }
  static saveMastitisLogs(data: MastitisLog[]): void {
    try {
      localStorage.setItem('sgg_mastitis_logs', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getWeightRecords(): WeightRecord[] {
    try {
      const stored = localStorage.getItem('sgg_weight_records');
      return stored ? JSON.parse(stored) : INITIAL_WEIGHT_RECORDS;
    } catch {
      return INITIAL_WEIGHT_RECORDS;
    }
  }
  static saveWeightRecords(data: WeightRecord[]): void {
    try {
      localStorage.setItem('sgg_weight_records', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getMedicines(): Medicine[] {
    try {
      const stored = localStorage.getItem('sgg_medicines');
      return stored ? JSON.parse(stored) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  }
  static saveMedicines(data: Medicine[]): void {
    try {
      localStorage.setItem('sgg_medicines', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getTreatmentLogs(): TreatmentLog[] {
    try {
      const stored = localStorage.getItem('sgg_treatment_logs');
      return stored ? JSON.parse(stored) : INITIAL_TREATMENT_LOGS;
    } catch {
      return INITIAL_TREATMENT_LOGS;
    }
  }
  static saveTreatmentLogs(data: TreatmentLog[]): void {
    try {
      localStorage.setItem('sgg_treatment_logs', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getTasks(): Task[] {
    try {
      const stored = localStorage.getItem('sgg_tasks');
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  }
  static saveTasks(data: Task[]): void {
    try {
      localStorage.setItem('sgg_tasks', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem('sgg_transactions');
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }
  static saveTransactions(data: Transaction[]): void {
    try {
      localStorage.setItem('sgg_transactions', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getMassTreatments(): MassTreatment[] {
    try {
      const stored = localStorage.getItem('sgg_mass_treatments');
      return stored ? JSON.parse(stored) : INITIAL_MASS_TREATMENTS;
    } catch {
      return INITIAL_MASS_TREATMENTS;
    }
  }
  static saveMassTreatments(data: MassTreatment[]): void {
    try {
      localStorage.setItem('sgg_mass_treatments', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getMassVaccinations(): MassVaccination[] {
    try {
      const stored = localStorage.getItem('sgg_mass_vaccinations');
      return stored ? JSON.parse(stored) : INITIAL_MASS_VACCINATIONS;
    } catch {
      return INITIAL_MASS_VACCINATIONS;
    }
  }
  static saveMassVaccinations(data: MassVaccination[]): void {
    try {
      localStorage.setItem('sgg_mass_vaccinations', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getBreedingSeasons(): BreedingSeason[] {
    try {
      const stored = localStorage.getItem('sgg_breeding_seasons');
      return stored ? JSON.parse(stored) : INITIAL_BREEDING_SEASONS;
    } catch {
      return INITIAL_BREEDING_SEASONS;
    }
  }
  static saveBreedingSeasons(data: BreedingSeason[]): void {
    try {
      localStorage.setItem('sgg_breeding_seasons', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getBullEvaluations(): BullEvaluation[] {
    try {
      const stored = localStorage.getItem('sgg_bull_evaluations');
      return stored ? JSON.parse(stored) : INITIAL_BULL_EVALUATIONS;
    } catch {
      return INITIAL_BULL_EVALUATIONS;
    }
  }
  static saveBullEvaluations(data: BullEvaluation[]): void {
    try {
      localStorage.setItem('sgg_bull_evaluations', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getBuffaloProduction(): BuffaloProduction[] {
    try {
      const stored = localStorage.getItem('sgg_buffalo_production');
      return stored ? JSON.parse(stored) : INITIAL_BUFFALO_PRODUCTION;
    } catch {
      return INITIAL_BUFFALO_PRODUCTION;
    }
  }
  static saveBuffaloProduction(data: BuffaloProduction[]): void {
    try {
      localStorage.setItem('sgg_buffalo_production', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  static getSmallRuminantLogs(): SmallRuminantLog[] {
    try {
      const stored = localStorage.getItem('sgg_small_ruminant_logs');
      return stored ? JSON.parse(stored) : INITIAL_SMALL_RUMINANT_LOGS;
    } catch {
      return INITIAL_SMALL_RUMINANT_LOGS;
    }
  }
  static saveSmallRuminantLogs(data: SmallRuminantLog[]): void {
    try {
      localStorage.setItem('sgg_small_ruminant_logs', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }
}
