/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, Sparkles, Sprout, Database as DatabaseIcon, RefreshCw, CheckCircle2, XCircle, PlusCircle, ArrowRight, UserPlus, LogIn, Settings, AlertTriangle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AnimalsView from './components/AnimalsView';
import LevanteCebaView from './components/LevanteCebaView';
import RegistroMasivoView from './components/RegistroMasivoView';
import MastitisView from './components/MastitisView';
import MercadoFinanzasView from './components/MercadoFinanzasView';
import MedicinasTareasView from './components/MedicinasTareasView';
import ScannerView from './components/ScannerView';
import SanidadMasivaView from './components/SanidadMasivaView';
import ReproduccionView from './components/ReproduccionView';
import AsociacionesView from './components/AsociacionesView';
import OtrosParametrosView from './components/OtrosParametrosView';
import PerfilUsuarioView from './components/PerfilUsuarioView';
import SanitarioView from './components/SanitarioView';
import ReportesView from './components/ReportesView';

import { Database } from './data';
import { supabase, SupabaseDb } from './supabaseClient';
import {
  Animal,
  MilkLog,
  MastitisLog,
  WeightRecord,
  Medicine,
  TreatmentLog,
  Task,
  Transaction,
  MassTreatment,
  MassVaccination,
  BreedingSeason,
  BullEvaluation,
  BuffaloProduction,
  SmallRuminantLog,
  FarmParams
} from './types';

export default function App() {
  // Authentication Guard & Registration
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [showExtSupabase, setShowExtSupabase] = useState<boolean>(false);

  const [loginEmail, setLoginEmail] = useState('disenamecorporation@gmail.com');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('disenamecorporation@gmail.com');

  // Registration states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFarmName, setRegisterFarmName] = useState('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Custom alert overlay state
  const [appAlert, setAppAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Local Accounts Database (loaded from Supabase Sync, persisting in localStorage for offline resiliency)
  const [registeredUsers, setRegisteredUsers] = useState<{email: string, password: string, name: string, farmName: string}[]>(() => {
    try {
      const cached = localStorage.getItem('sgg_registered_users');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load users from localStorage:", e);
    }
    return [
      { email: 'disenamecorporation@gmail.com', password: '123456', name: 'Ing. Carlos Ruiz', farmName: 'Hacienda La Esmeralda (Barinas, Venezuela)' }
    ];
  });

  // Safe global interceptor for browser alerts to bypass iframe sandbox restrictions
  useEffect(() => {
    window.alert = (message: string) => {
      let title = 'SGG Sistema';
      let type: 'success' | 'error' | 'warning' | 'info' = 'info';

      const lower = (message || '').toLowerCase();
      if (lower.includes('error') || lower.includes('fallo') || lower.includes('incorrecta') || lower.includes('válida') || lower.includes('inválid')) {
        title = 'Error de Operación';
        type = 'error';
      } else if (lower.includes('exitos') || lower.includes('éxito') || lower.includes('guardad') || lower.includes('sincronizad')) {
        title = 'Operación Exitosa';
        type = 'success';
      } else if (lower.includes('por favor') || lower.includes('seleccione') || lower.includes('ingrese') || lower.includes('campos')) {
        title = 'Atención Requerida';
        type = 'warning';
      }

      setAppAlert({
        visible: true,
        title,
        message,
        type
      });
    };
  }, []);

  // Save changes to local accounts to persist registrations
  useEffect(() => {
    try {
      localStorage.setItem('sgg_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn("Could not persist users in localStorage:", e);
    }
  }, [registeredUsers]);

  const activeUser = registeredUsers.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase()) || registeredUsers[0] || {
    email: 'disenamecorporation@gmail.com', password: '123456', name: 'Ing. Carlos Ruiz', farmName: 'Hacienda La Esmeralda (Barinas, Venezuela)'
  };

  // Sync users with Supabase on mount
  useEffect(() => {
    const fetchSyncUsers = async () => {
      if (SupabaseDb.isEnabled()) {
        try {
          const dbUsers = await SupabaseDb.getRegisteredUsers();
          if (dbUsers && dbUsers.length > 0) {
            const mapped = dbUsers.map(u => ({
              email: u.email,
              password: u.password,
              name: u.name,
              farmName: u.farm_name || u.farmName || ''
            }));
            setRegisteredUsers(mapped);
          }
        } catch (e) {
          console.warn("Could not sync users from Supabase:", e);
        }
      }
    };
    fetchSyncUsers();
  }, []);

  // Sync all application collections from Supabase live database on login
  useEffect(() => {
    if (!isLoggedIn || !SupabaseDb.isEnabled()) return;

    const loadCloudData = async () => {
      console.log('Sincronizando colecciones con base de datos Supabase...');
      try {
        const [
          dbAnimals,
          dbMilk,
          dbMastitis,
          dbWeights,
          dbMedicines,
          dbTreatments,
          dbTasks,
          dbTxs,
          dbMassTreat,
          dbMassVac,
          dbBreeds,
          dbBulls,
          dbBuffalo,
          dbRuminants,
          dbBreedsCollection,
          dbCategories,
          dbMedications,
          dbProducts,
          dbSanitaryPlans
        ] = await Promise.all([
          SupabaseDb.fetchCollection('animals', []),
          SupabaseDb.fetchCollection('milk_logs', []),
          SupabaseDb.fetchCollection('mastitis_logs', []),
          SupabaseDb.fetchCollection('weight_records', []),
          SupabaseDb.fetchCollection('medicines', []),
          SupabaseDb.fetchCollection('treatment_logs', []),
          SupabaseDb.fetchCollection('tasks', []),
          SupabaseDb.fetchCollection('transactions', []),
          SupabaseDb.fetchCollection('mass_treatments', []),
          SupabaseDb.fetchCollection('mass_vaccinations', []),
          SupabaseDb.fetchCollection('breeding_seasons', []),
          SupabaseDb.fetchCollection('bull_evaluations', []),
          SupabaseDb.fetchCollection('buffalo_production', []),
          SupabaseDb.fetchCollection('small_ruminant_logs', []),
          SupabaseDb.fetchCollection('breeds', []),
          SupabaseDb.fetchCollection('animal_categories', []),
          SupabaseDb.fetchCollection('medications', []),
          SupabaseDb.fetchCollection('other_products', []),
          SupabaseDb.fetchCollection('sanitary_plans', [])
        ]);

        if (dbAnimals && dbAnimals.length > 0) setAnimals(dbAnimals);
        if (dbMilk && dbMilk.length > 0) setMilkLogs(dbMilk);
        if (dbMastitis && dbMastitis.length > 0) setMastitisLogs(dbMastitis);
        if (dbWeights && dbWeights.length > 0) setWeightRecords(dbWeights);
        if (dbMedicines && dbMedicines.length > 0) setMedicines(dbMedicines);
        if (dbTreatments && dbTreatments.length > 0) setTreatmentLogs(dbTreatments);
        if (dbTasks && dbTasks.length > 0) setTasks(dbTasks);
        if (dbTxs && dbTxs.length > 0) setTransactions(dbTxs);
        if (dbMassTreat && dbMassTreat.length > 0) setMassTreatments(dbMassTreat);
        if (dbMassVac && dbMassVac.length > 0) setMassVaccinations(dbMassVac);
        if (dbBreeds && dbBreeds.length > 0) setBreedingSeasons(dbBreeds);
        if (dbBulls && dbBulls.length > 0) setBullEvaluations(dbBulls);
        if (dbBuffalo && dbBuffalo.length > 0) setBuffaloProduction(dbBuffalo);
        if (dbRuminants && dbRuminants.length > 0) setSmallRuminantLogs(dbRuminants);
        if (dbBreedsCollection && dbBreedsCollection.length > 0) setBreeds(dbBreedsCollection);
        if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);
        if (dbMedications && dbMedications.length > 0) setMedications(dbMedications);
        if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
        if (dbSanitaryPlans && dbSanitaryPlans.length > 0) setSanitaryPlans(dbSanitaryPlans);

      } catch (err) {
        console.warn('Sync notice: Standard memory states active.', err);
      }
    };

    loadCloudData();
  }, [isLoggedIn, currentUserEmail]);

  const onUpdateUser = async (oldEmail: string, updatedUser: {email: string, password: string, name: string, farmName: string}) => {
    const updated = registeredUsers.map(u => u.email.toLowerCase() === oldEmail.toLowerCase() ? updatedUser : u);
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('ganaderia_vzla_registered_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (SupabaseDb.isEnabled()) {
      try {
        await SupabaseDb.saveUser(updatedUser);
      } catch (err) {
        console.error("Could not sync profile change to Supabase:", err);
      }
    }

    setCurrentUserEmail(updatedUser.email);
    onUpdateFarmParams({
      ...farmParams,
      farmName: updatedUser.farmName
    });
  };

  // Navigation Routing States
  const [currentSection, setCurrentSection] = useState<string>('dashboard');

  // Core Database Collections
  const [farmParams, setFarmParams] = useState<FarmParams>(() => Database.getFarmParams());
  const [animals, setAnimals] = useState<Animal[]>(() => Database.getAnimals());
  const [milkLogs, setMilkLogs] = useState<MilkLog[]>(() => Database.getMilkLogs());
  const [mastitisLogs, setMastitisLogs] = useState<MastitisLog[]>(() => Database.getMastitisLogs());
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => Database.getWeightRecords());
  const [medicines, setMedicines] = useState<Medicine[]>(() => Database.getMedicines());
  const [treatmentLogs, setTreatmentLogs] = useState<TreatmentLog[]>(() => Database.getTreatmentLogs());
  const [tasks, setTasks] = useState<Task[]>(() => Database.getTasks());
  const [transactions, setTransactions] = useState<Transaction[]>(() => Database.getTransactions());
  
  // Advanced modules: Sanidad Masiva
  const [massTreatments, setMassTreatments] = useState<MassTreatment[]>(() => Database.getMassTreatments());
  const [massVaccinations, setMassVaccinations] = useState<MassVaccination[]>(() => Database.getMassVaccinations());
  
  // Advanced modules: Reproducción
  const [breedingSeasons, setBreedingSeasons] = useState<BreedingSeason[]>(() => Database.getBreedingSeasons());
  const [bullEvaluations, setBullEvaluations] = useState<BullEvaluation[]>(() => Database.getBullEvaluations());
  const [sanitaryPlans, setSanitaryPlans] = useState<SanitaryPlan[]>([]);
  
  // Advanced modules: Criabúfalo, ASOCEBU & Ruminants
  const [buffaloProduction, setBuffaloProduction] = useState<BuffaloProduction[]>(() => Database.getBuffaloProduction());
  const [smallRuminantLogs, setSmallRuminantLogs] = useState<SmallRuminantLog[]>(() => Database.getSmallRuminantLogs());
  const [publications, setPublications] = useState<Publication[]>([]);
  
  // Catalog Management
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [categories, setCategories] = useState<AnimalCategory[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [products, setProducts] = useState<OtherProductService[]>([]);

  // --- ACTIONS & MUTATORS SINK ---

  const onAddPublication = (pub: Omit<Publication, 'id'>) => {
    const newPub: Publication = { id: 'pub_' + Date.now(), ...pub };
    setPublications([...publications, newPub]);
  };

  const onAddBreed = (breed: Omit<Breed, 'id'>) => {
    const newRecord = { id: 'b_' + Date.now(), ...breed };
    setBreeds([...breeds, newRecord]);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('breeds', newRecord).catch(err => console.error(err));
    }
  };
  const onAddCategory = (cat: Omit<AnimalCategory, 'id'>) => {
    const newRecord = { id: 'c_' + Date.now(), ...cat };
    setCategories([...categories, newRecord]);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('animal_categories', newRecord).catch(err => console.error(err));
    }
  };
  const onAddMedication = (med: Omit<Medication, 'id'>) => {
    const newRecord = { id: 'm_' + Date.now(), ...med };
    setMedications([...medications, newRecord]);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('medications', newRecord).catch(err => console.error(err));
    }
  };
  const onAddProduct = (prod: Omit<OtherProductService, 'id'>) => {
    const newRecord = { id: 'p_' + Date.now(), ...prod };
    setProducts([...products, newRecord]);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('other_products', newRecord).catch(err => console.error(err));
    }
  };

  const onUpdateFarmParams = (params: FarmParams) => {
    setFarmParams(params);
    Database.saveFarmParams(params);
  };

  const onUpdateFormSupabase = (url: string, key: string, status: 'No Configurado' | 'Conectado' | 'Fallo de Conexión') => {
    const updated = {
      ...farmParams,
      supabaseUrl: url,
      supabaseAnonKey: key,
      supabaseStatus: status
    };
    setFarmParams(updated);
    Database.saveFarmParams(updated);
  };

  const onAddAnimal = (animal: Omit<Animal, 'id'>) => {
    const newAnimal: Animal = { id: 'a_' + Date.now(), ...animal };
    const updated = [...animals, newAnimal];
    setAnimals(updated);
    Database.saveAnimals(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('animals', newAnimal).catch(err => console.error(err));
    }
  };

  const onUpdateAnimal = (updatedAnimal: Animal) => {
    const updated = animals.map(a => a.id === updatedAnimal.id ? updatedAnimal : a);
    setAnimals(updated);
    Database.saveAnimals(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('animals', updatedAnimal).catch(err => console.error(err));
    }
  };

  const onDeleteAnimal = (animalId: string) => {
    const updated = animals.filter(a => a.id !== animalId);
    setAnimals(updated);
    Database.saveAnimals(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.deleteRecord('animals', animalId).catch(err => console.error(err));
    }
  };

  const onAddWeightRecord = (record: Omit<WeightRecord, 'id'>) => {
    const newRecord: WeightRecord = { id: 'w_' + Date.now(), ...record };
    const updated = [...weightRecords, newRecord];
    setWeightRecords(updated);
    Database.saveWeightRecords(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('weight_records', newRecord).catch(err => console.error(err));
    }
  };

  const onUpdateAnimalWeight = (animalId: string, currentWeight: number) => {
    const animal = animals.find(a => a.id === animalId);
    const updated = animals.map(a => a.id === animalId ? { ...a, currentWeight } : a);
    setAnimals(updated);
    Database.saveAnimals(updated);
    if (animal && SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('animals', { ...animal, currentWeight }).catch(err => console.error(err));
    }
  };

  const onAddMilkLogs = (newLogs: Omit<MilkLog, 'id'>[]) => {
    const formattedLogs: MilkLog[] = newLogs.map((log, index) => ({
      id: `m_${Date.now()}_${index}`,
      ...log
    }));
    const updated = [...milkLogs, ...formattedLogs];
    setMilkLogs(updated);
    Database.saveMilkLogs(updated);
    if (SupabaseDb.isEnabled()) {
      formattedLogs.forEach(log => {
        SupabaseDb.upsertRecord('milk_logs', log).catch(err => console.error(err));
      });
    }
  };

  const onAddMastitisLog = (log: Omit<MastitisLog, 'id'>) => {
    const newLog: MastitisLog = { id: 'mas_' + Date.now(), ...log };
    const updated = [...mastitisLogs, newLog];
    setMastitisLogs(updated);
    Database.saveMastitisLogs(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('mastitis_logs', newLog).catch(err => console.error(err));
    }
  };

  const onAddTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { id: 'tx_' + Date.now(), ...tx };
    const updated = [...transactions, newTx];
    setTransactions(updated);
    Database.saveTransactions(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('transactions', newTx).catch(err => console.error(err));
    }
  };

  const onAddTreatment = (log: Omit<TreatmentLog, 'id'>) => {
    const newLog: TreatmentLog = { id: 't_' + Date.now(), ...log };
    const updated = [...treatmentLogs, newLog];
    setTreatmentLogs(updated);
    Database.saveTreatmentLogs(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('treatment_logs', newLog).catch(err => console.error(err));
    }
  };

  const onAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { id: 'tk_' + Date.now(), ...task };
    const updated = [...tasks, newTask];
    setTasks(updated);
    Database.saveTasks(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('tasks', newTask).catch(err => console.error(err));
    }
  };

  const onToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    Database.saveTasks(updated);
    if (task && SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('tasks', { ...task, completed: !task.completed }).catch(err => console.error(err));
    }
  };

  const onDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    Database.saveTasks(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.deleteRecord('tasks', taskId).catch(err => console.error(err));
    }
  };

  const onAddMassTreatment = (tx: Omit<MassTreatment, 'id'>) => {
    const newTx: MassTreatment = { id: 'mt_' + Date.now(), ...tx };
    const updated = [...massTreatments, newTx];
    setMassTreatments(updated);
    Database.saveMassTreatments(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('mass_treatments', newTx).catch(err => console.error(err));
    }
  };

  const onAddMassVaccination = (vac: Omit<MassVaccination, 'id'>) => {
    const newVac: MassVaccination = { id: 'mv_' + Date.now(), ...vac };
    const updated = [...massVaccinations, newVac];
    setMassVaccinations(updated);
    Database.saveMassVaccinations(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('mass_vaccinations', newVac).catch(err => console.error(err));
    }
  };

  const onAddBreedingSeason = (season: Omit<BreedingSeason, 'id'>) => {
    const newSeason: BreedingSeason = { id: 'bs_' + Date.now(), ...season };
    const updated = [...breedingSeasons, newSeason];
    setBreedingSeasons(updated);
    Database.saveBreedingSeasons(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('breeding_seasons', newSeason).catch(err => console.error(err));
    }
  };

  const onAddSanitaryPlan = (plan: Omit<SanitaryPlan, 'id'>) => {
    const newPlan: SanitaryPlan = { id: 'sp_' + Date.now(), ...plan };
    setSanitaryPlans([...sanitaryPlans, newPlan]);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('sanitary_plans', newPlan).catch(err => console.error(err));
    }
  };

  const onAddBullEvaluation = (evalu: Omit<BullEvaluation, 'id'>) => {
    const newEvalu: BullEvaluation = { id: 'be_' + Date.now(), ...evalu };
    const updated = [...bullEvaluations, newEvalu];
    setBullEvaluations(updated);
    Database.saveBullEvaluations(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('bull_evaluations', newEvalu).catch(err => console.error(err));
    }
  };

  const onUpdateAnimalPregnancy = (animalId: string, status: 'Vacía' | 'Preñada' | 'Por confirmar') => {
    const animal = animals.find(a => a.id === animalId);
    const updated = animals.map(a => a.id === animalId ? { ...a, pregnancyStatus: status } : a);
    setAnimals(updated);
    Database.saveAnimals(updated);
    if (animal && SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('animals', { ...animal, pregnancyStatus: status }).catch(err => console.error(err));
    }
  };

  const onAddBuffaloProd = (prod: Omit<BuffaloProduction, 'id'>) => {
    const newProd: BuffaloProduction = { id: 'bp_' + Date.now(), ...prod };
    const updated = [...buffaloProduction, newProd];
    setBuffaloProduction(updated);
    Database.saveBuffaloProduction(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('buffalo_production', newProd).catch(err => console.error(err));
    }
  };

  const onAddSmallRuminantLog = (log: Omit<SmallRuminantLog, 'id'>) => {
    const newLog: SmallRuminantLog = { id: 'sr_' + Date.now(), ...log };
    const updated = [...smallRuminantLogs, newLog];
    setSmallRuminantLogs(updated);
    Database.saveSmallRuminantLogs(updated);
    if (SupabaseDb.isEnabled()) {
      SupabaseDb.upsertRecord('small_ruminant_logs', newLog).catch(err => console.error(err));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    
    let user: any = null;
    try {
      if (SupabaseDb.isEnabled()) {
        try {
          // Race the database lookup against a 3.5-second timeout securely
          const dbFetchPromise = supabase!
            .from('registered_users')
            .select('*')
            .eq('email', loginEmail.toLowerCase().trim())
            .maybeSingle();

          let timer: any;
          const timeoutPromise = new Promise<any>((resolve) => {
            timer = setTimeout(() => resolve({ isTimeout: true }), 3500);
          });

          const result = await Promise.race([
            dbFetchPromise.then(res => {
              clearTimeout(timer);
              return res;
            }),
            timeoutPromise
          ]);

          if (result && !result.isTimeout) {
            const data = (result as any)?.data;
            if (data) {
              user = {
                email: data.email,
                password: data.password,
                name: data.name,
                farmName: data.farm_name || data.farmName || ''
              };
              
              if (!registeredUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
                setRegisteredUsers(prev => [...prev, user]);
              }
            }
          } else {
            console.warn("Supabase login query timed out");
          }
        } catch (err) {
          console.error("Supabase direct auth query failed:", err);
        }
      }
      
      if (!user) {
        user = registeredUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.password === loginPassword);
      }
      
      if (user && user.password === loginPassword) {
        setCurrentUserEmail(user.email);
        if (user.farmName) {
          onUpdateFarmParams({
            ...farmParams,
            farmName: user.farmName
          });
        }
        setIsLoggedIn(true);
      } else {
        alert('Credenciales incorrectas. Verifique e intente de nuevo. Si se registró en un dispositivo remoto, compruebe su conexión activa.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) return;
    
    if (!registerEmail || !registerPassword || !registerFarmName || !registerName) {
      alert('Por favor llene todos los campos del registro.');
      return;
    }

    setIsRegistering(true);
    
    try {
      const trimmedEmail = registerEmail.trim();

      const newUser = {
        email: trimmedEmail,
        password: registerPassword.trim(),
        name: registerName.trim(),
        farmName: registerFarmName.trim()
      };

      let registeredInSupabase = false;
      let supabaseErrorMsg = '';

      // Save to Supabase Cloud Database with a 6-second timeout securely
      if (SupabaseDb.isEnabled()) {
        try {
          const dbSavePromise = SupabaseDb.saveUser(newUser);
          
          let timer: any;
          const timeoutPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
            timer = setTimeout(() => resolve({ success: false, error: 'Tiempo de espera agotado (límite de 6s). Verifique sus parámetros o intente de nuevo.' }), 6000);
          });
          
          const result = await Promise.race([
            dbSavePromise.then(res => {
              clearTimeout(timer);
              return res;
            }),
            timeoutPromise
          ]);

          if (result && result.success) {
            registeredInSupabase = true;
          } else {
            supabaseErrorMsg = result?.error || 'Falla de comunicación o API Key no válida';
          }
        } catch (err: any) {
          console.warn("Supabase user register failed:", err);
          supabaseErrorMsg = err?.message || String(err);
        }
      }

      // ALWAYS update local users state so they are registered in the current device
      const filteredUsers = registeredUsers.filter(u => u.email.toLowerCase() !== trimmedEmail.toLowerCase());
      const updated = [...filteredUsers, newUser];
      setRegisteredUsers(updated);

      // Configure newly registered Farm parameters
      onUpdateFarmParams({
        ...farmParams,
        farmName: registerFarmName,
        supabaseStatus: registeredInSupabase ? 'Conectado' : (SupabaseDb.isEnabled() ? 'Fallo de Conexión' : 'No Configurado')
      });

      // Automatically authenticate the newly registered user
      setCurrentUserEmail(trimmedEmail);
      setLoginEmail(trimmedEmail);
      setLoginPassword(registerPassword);
      setIsLoggedIn(true);
      setIsRegisterMode(false);

      if (SupabaseDb.isEnabled()) {
        if (registeredInSupabase) {
          alert('¡Registro exitoso en SGG!');
        } else {
          alert(`¡Cuenta creada y configurada correctamente en SGG!\n\nNota: Sus datos fueron resguardados localmente para garantizar su acceso inmediato.`);
        }
      } else {
        alert('¡Registro exitoso en SGG! Cuenta y datos de finca guardados correctamente.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Switch content section renderer based on routing state currentSection
  const renderViewContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <DashboardView
            animals={animals}
            milkLogs={milkLogs}
            tasks={tasks}
            transactions={transactions}
            farmParams={farmParams}
            medicines={medicines}
            setCurrentSection={setCurrentSection}
          />
        );
      case 'animales':
        return (
          <AnimalsView
            animals={animals}
            onAddAnimal={onAddAnimal}
            onUpdateAnimal={onUpdateAnimal}
            onDeleteAnimal={onDeleteAnimal}
          />
        );
      case 'levante-ceba':
        return (
          <LevanteCebaView
            animals={animals}
            weightRecords={weightRecords}
            onAddWeightRecord={onAddWeightRecord}
            onUpdateAnimalWeight={onUpdateAnimalWeight}
          />
        );
      case 'registro-masivo':
        return (
          <RegistroMasivoView
            animals={animals}
            milkLogs={milkLogs}
            onAddMilkLogs={onAddMilkLogs}
          />
        );
      case 'mastitis':
        return (
          <MastitisView
            animals={animals}
            mastitisLogs={mastitisLogs}
            onAddMastitisLog={onAddMastitisLog}
            medicines={medicines}
          />
        );
      case 'mercado':
        return (
          <MercadoFinanzasView
            subSection="mercado"
            transactions={transactions}
            farmParams={farmParams}
            animals={animals}
            onAddTransaction={onAddTransaction}
            onAddPublication={onAddPublication}
          />
        );
      case 'finanzas':
        return (
          <MercadoFinanzasView
            subSection="finanzas"
            transactions={transactions}
            farmParams={farmParams}
            animals={animals}
            onAddTransaction={onAddTransaction}
            onAddPublication={onAddPublication}
          />
        );
      case 'tratamiento-masivo':
        return (
          <SanidadMasivaView
            animals={animals}
            medicines={medicines}
            massTreatments={massTreatments}
            massVaccinations={massVaccinations}
            onAddMassTreatment={onAddMassTreatment}
            onAddMassVaccination={onAddMassVaccination}
          />
        );
      case 'vacunacion-masiva':
        return (
          <SanidadMasivaView
            animals={animals}
            medicines={medicines}
            massTreatments={massTreatments}
            massVaccinations={massVaccinations}
            onAddMassTreatment={onAddMassTreatment}
            onAddMassVaccination={onAddMassVaccination}
          />
        );
      case 'temporada-servicio':
        return (
          <ReproduccionView
            animals={animals}
            breedingSeasons={breedingSeasons}
            bullEvaluations={bullEvaluations}
            onAddBreedingSeason={onAddBreedingSeason}
            onAddBullEvaluation={onAddBullEvaluation}
            onUpdateAnimalPregnancy={onUpdateAnimalPregnancy}
            onUpdateAnimal={onUpdateAnimal}
          />
        );
      case 'info-machos':
        return (
          <ReproduccionView
            animals={animals}
            breedingSeasons={breedingSeasons}
            bullEvaluations={bullEvaluations}
            onAddBreedingSeason={onAddBreedingSeason}
            onAddBullEvaluation={onAddBullEvaluation}
            onUpdateAnimalPregnancy={onUpdateAnimalPregnancy}
            onUpdateAnimal={onUpdateAnimal}
          />
        );
      case 'criabufalo':
        return (
          <AsociacionesView
            animals={animals}
            buffaloProduction={buffaloProduction}
            smallRuminantLogs={smallRuminantLogs}
            onAddBuffaloProd={onAddBuffaloProd}
            onAddSmallRuminantLog={onAddSmallRuminantLog}
          />
        );
      case 'genetica-cebu':
        return (
          <AsociacionesView
            animals={animals}
            buffaloProduction={buffaloProduction}
            smallRuminantLogs={smallRuminantLogs}
            onAddBuffaloProd={onAddBuffaloProd}
            onAddSmallRuminantLog={onAddSmallRuminantLog}
          />
        );
      case 'caprino-ovino':
        return (
          <AsociacionesView
            animals={animals}
            buffaloProduction={buffaloProduction}
            smallRuminantLogs={smallRuminantLogs}
            onAddBuffaloProd={onAddBuffaloProd}
            onAddSmallRuminantLog={onAddSmallRuminantLog}
          />
        );
      case 'reportes':
        return <ReportesView />;
      case 'plan-sanitario':
        return (
          <SanitarioView
            sanitaryPlans={sanitaryPlans}
            onAddSanitaryPlan={onAddSanitaryPlan}
          />
        );
      case 'medicinas':
        return (
          <MedicinasTareasView
            subSection="medicinas"
            animals={animals}
            medicines={medicines}
            treatmentLogs={treatmentLogs}
            tasks={tasks}
            onAddTreatment={onAddTreatment}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        );
      case 'tareas':
        return (
          <MedicinasTareasView
            subSection="tareas"
            animals={animals}
            medicines={medicines}
            treatmentLogs={treatmentLogs}
            tasks={tasks}
            onAddTreatment={onAddTreatment}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        );
      case 'scanner':
        return <ScannerView animals={animals} />;
      case 'otros-parametros':
        return (
          <OtrosParametrosView
            farmParams={farmParams}
            onUpdateFarmParams={onUpdateFarmParams}
            onAddBreed={onAddBreed}
            onAddCategory={onAddCategory}
            onAddMedication={onAddMedication}
            onAddProduct={onAddProduct}
          />
        );
      case 'mi-perfil':
        return (
          <PerfilUsuarioView
            activeUser={activeUser}
            registeredUsers={registeredUsers}
            onUpdateUser={onUpdateUser}
            farmParams={farmParams}
            onUpdateFarmParams={onUpdateFarmParams}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Sección {currentSection} en desarrollo.
          </div>
        );
    }
  };

  // RENDER APP
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* If LOGGED OUT template render */}
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 to-slate-900 bg-cover bg-center">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-6.5 shadow-2xl border border-white/20 space-y-4">
            
            {/* Upper Emblem and Brand */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex p-0.5 bg-white rounded-lg">
                <img 
                  src="https://i.postimg.cc/Pq9pC9Vf/IMAGOTIPO-SSG-WEBLOGO.png" 
                  alt="SGG Logo" 
                  className="h-16 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="font-poppins font-bold text-base text-slate-900 mt-1 tracking-tight">SGG Sistema de Gestión Ganadera</h2>
              <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto">
                Sistema Operativo de Control Agropecuario, Registros Sanitarios y Ceba.
              </p>
            </div>

            {/* Switch Tabs between Login and Registarse */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isRegisterMode 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isRegisterMode 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Registrarse
              </button>
            </div>

            {/* LOGIN FORM */}
            {!isRegisterMode ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-600 block">Correo del Administrador</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    className="w-full border border-slate-200 p-2.5 rounded-xl font-medium outline-none bg-white focus:border-emerald-600"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-650 block">Contraseña de Finca (PIN)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••"
                    className="w-full border border-slate-200 p-2.5 rounded-xl font-medium outline-none bg-white focus:border-emerald-600"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className={`w-full text-white font-bold py-2.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-xs cursor-pointer ${
                    isLoggingIn ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  <Lock className={`w-4 h-4 text-emerald-200 ${isLoggingIn ? 'animate-pulse' : ''}`} />
                  {isLoggingIn ? 'Iniciando Sesión...' : 'Iniciar Ordeño Digital'}
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-605 block">Su Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Manuel Rodríguez"
                    className="w-full border border-slate-200 p-2.5 rounded-xl font-medium outline-none bg-white focus:border-emerald-600"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-605 block">Nombre del Finca / Agropecuaria</label>
                  <input
                    type="text"
                    required
                    placeholder="Hacienda El Gran Poder"
                    className="w-full border border-slate-200 p-2.5 rounded-xl font-medium outline-none bg-white focus:border-emerald-600"
                    value={registerFarmName}
                    onChange={(e) => setRegisterFarmName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-605 block">Correo Electrónico Administrador</label>
                  <input
                    type="email"
                    required
                    placeholder="finca@correo.com"
                    className="w-full border border-slate-200 p-2.5 rounded-xl font-medium outline-none bg-white focus:border-emerald-600"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-605 block font-bold">PIN de Acceso</label>
                  <input
                    type="password"
                    required
                    placeholder="Contraseña PIN"
                    className="w-full border border-slate-200 p-2.5 rounded-xl font-medium outline-none bg-white focus:border-emerald-600"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className={`w-full text-white font-bold py-2.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-xs cursor-pointer ${
                    isRegistering ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  <UserPlus className={`w-4 h-4 text-emerald-250 ${isRegistering ? 'animate-pulse' : ''}`} />
                  {isRegistering ? 'Registrándose en SGG...' : 'Registrar Finca e Ingresar'}
                </button>
              </form>
            )}

            {/* Clean spacing end of register / login panels */}
          </div>
        </div>
      ) : (
        /* LOGGED IN ACTIVE DASHBOARD VIEWPORT LAYOUT */
        <div className="flex min-h-screen">
          {/* Collapsible sticky sidebar on left */}
          <Sidebar
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            farmName={farmParams.farmName}
            activeUser={activeUser}
            onLogout={() => {
              setIsLoggedIn(false);
              setCurrentSection('dashboard');
            }}
          />

          {/* Main layout viewport container */}
          <div className="flex-1 pl-64 flex flex-col min-h-screen">
            {/* Global parameters and notifications tracker */}
            <Header currentSection={currentSection} farmParams={farmParams} />

            {/* Scrolling Viewport Area */}
            <main className="flex-1 p-6 bg-slate-55 overflow-y-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                {renderViewContent()}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Safe Custom Overlay Alert System */}
      {appAlert.visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform scale-100 transition-all">
            {/* Header with appropriate colored bar */}
            <div className={`p-4 flex items-center gap-3 border-b border-slate-100 ${
              appAlert.type === 'error' ? 'bg-rose-50 text-rose-950' :
              appAlert.type === 'success' ? 'bg-emerald-50 text-emerald-950' :
              appAlert.type === 'warning' ? 'bg-amber-50 text-amber-955' : 'bg-slate-50 text-slate-900'
            }`}>
              {appAlert.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              {appAlert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {appAlert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
              {appAlert.type === 'info' && <DatabaseIcon className="w-5 h-5 text-blue-500 shrink-0" />}
              <span className="font-poppins font-extrabold text-[12px] tracking-tight">{appAlert.title}</span>
            </div>

            {/* Message Body */}
            <div className="p-5.5 space-y-4">
              <p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-600 font-semibold font-sans">
                {appAlert.message}
              </p>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setAppAlert(prev => ({ ...prev, visible: false }))}
                className={`py-2 px-6 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
                  appAlert.type === 'error' ? 'bg-rose-600 hover:bg-rose-700 text-white' :
                  appAlert.type === 'success' ? 'bg-emerald-700 hover:bg-emerald-800 text-white' :
                  appAlert.type === 'warning' ? 'bg-slate-900 hover:bg-slate-1000 text-white' :
                  'bg-slate-900 hover:bg-slate-1000 text-white'
                }`}
              >
                Entendido / Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
