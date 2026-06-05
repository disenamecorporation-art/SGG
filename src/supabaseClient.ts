import { createClient } from '@supabase/supabase-js';

let cachedUrl = '';
let cachedKey = '';
let cachedClient: any = null;

export function getLocalFarmParams() {
  try {
    const stored = localStorage.getItem('sgg_farm_params');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getSupabase() {
  let url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  let key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  
  // Fallback to localStorage parameters if environmental keys are missing
  if (!url || !key) {
    const params = getLocalFarmParams();
    if (params) {
      url = url || params.supabaseUrl || '';
      key = key || params.supabaseAnonKey || '';
    }
  }
  
  if (!url || !key) {
    return null;
  }
  
  // Clean up any potential leading/trailing whitespace or enclosing quotes
  const cleanUrl = url.trim().replace(/^['"]|['"]$/g, '');
  const cleanKey = key.trim().replace(/^['"]|['"]$/g, '');
  
  if (!cleanUrl || !cleanKey) {
    return null;
  }

  if (cleanUrl !== cachedUrl || cleanKey !== cachedKey) {
    cachedUrl = cleanUrl;
    cachedKey = cleanKey;
    cachedClient = createClient(cleanUrl, cleanKey);
  }
  
  return cachedClient;
}

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) return null;
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

/**
 * Real-time Supabase Synchronizer Database Driver
 */
export class SupabaseDb {
  // Safe helper to run queries and log errors
  static isEnabled(): boolean {
    return getSupabase() !== null;
  }

  /**
   * Real connection test to verify Supabase state
   */
  static async testConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string; details: string }> {
    let url = customUrl || '';
    let key = customKey || '';

    if (!url || !key) {
      const clientUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
      const clientKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
      
      url = clientUrl;
      key = clientKey;

      if (!url || !key) {
        const params = getLocalFarmParams();
        if (params) {
          url = url || params.supabaseUrl || '';
          key = key || params.supabaseAnonKey || '';
        }
      }
    }

    if (!url || !key) {
      return {
        success: false,
        message: 'No Configurado',
        details: 'Faltan credenciales de Supabase. Por favor, agregue VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en la sección de Secretos o en la configuración.'
      };
    }

    const cleanUrl = url.trim().replace(/^['"]|['"]$/g, '');
    const cleanKey = key.trim().replace(/^['"]|['"]$/g, '');

    if (!cleanUrl.startsWith('https://')) {
      return {
        success: false,
        message: 'URL Inválida',
        details: 'Formato inválido: La URL de Supabase debe comenzar con "https://". Revise que no existan espacios ni comillas.'
      };
    }

    try {
      const tempClient = createClient(cleanUrl, cleanKey);
      const start = Date.now();
      
      // Query 1 row of registered_users to check auth and connection
      const { data, error } = await tempClient
        .from('registered_users')
        .select('*')
        .limit(1);

      const latency = Date.now() - start;

      if (error) {
        const msg = (error.message || '').toLowerCase();
        
        if (msg.includes('api key') || error.code === 'PGRST111' || error.message.includes('JWT') || msg.includes('anon')) {
          return {
            success: false,
            message: 'Error de Clave API (Invalid API key)',
            details: 'La URL es correcta, pero Supabase rechazó su API Key (Anon Key) indicando "Invalid API key".\n\nTips de Solución:\n1. Asegúrese de copiar la clave "anon/public" completa (comienza con "eyJhbGci..."). No use la clave "service_role".\n2. Verifique que no queden comillas simples o dobles alrededor de la clave al pegarla.'
          };
        }
        
        if (msg.includes('relation') || msg.includes('does not exist') || error.code === '42P01') {
          return {
            success: false,
            message: 'Tablas No Creadas',
            details: `¡CONEXIÓN LOGRADA CON ÉXITO! Las credenciales son válidas y autorizadas, pero la tabla "registered_users" no existe en su base de datos nueva.\n\nSolución inmediata:\n1. Entre a la consola de Supabase (https://supabase.com)\n2. Vaya al "SQL Editor" de su proyecto.\n3. Presione "New Query", copie y pegue TODO el contenido del archivo "supabase_schema_complete.sql" (disponible en la raíz del proyecto) y presione "Run".\nEsto creará las tablas necesarias automáticamente.`
          };
        }

        return {
          success: false,
          message: 'Error de Respuesta del Servidor',
          details: `Supabase respondió con error: "${error.message}" (Código: ${error.code || 'Desconocido'}).`
        };
      }

      return {
        success: true,
        message: 'Conectado Exitosamente',
        details: `¡Sincronización Total Verificada con Éxito!\n\n✓ URL y Clave API de Supabase válidas\n✓ Tabla "registered_users" encontrada y respondiente\n✓ Latencia del servidor: ${latency}ms\n\nSu base de datos en Supabase está completamente lista y comunicada.`
      };

    } catch (err: any) {
      return {
        success: false,
        message: 'Error de Red o Fallo Host',
        details: `No se pudo conectar al host de Supabase.\n\n1. Verifique si la URL de su proyecto es la correcta: "${cleanUrl}"\n2. Asegúrese de que no tenga barra "/" al final de la URL.\n3. Error de conexión: ${err?.message || String(err)}`
      };
    }
  }

  // 1. Registered Users Auth Synchronization
  static async getRegisteredUsers(): Promise<any[]> {
    if (!this.isEnabled()) return [];
    try {
      const { data, error } = await supabase!
        .from('registered_users')
        .select('*');
      if (error) {
        console.warn('Supabase: Fallback local users. Error fetching registered_users:', error.message);
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.warn('Supabase DB fetch users error:', err);
      return [];
    }
  }

  static async saveUser(user: any): Promise<{ success: boolean; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: 'Supabase no está configurado. Ingrese VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en los Secretos.' };
    }
    try {
      // Upsert user based on email key
      const { error } = await supabase!
        .from('registered_users')
        .upsert({
          email: user.email.toLowerCase(),
          password: user.password,
          name: user.name,
          farm_name: user.farmName
        }, { onConflict: 'email' });
      
      if (error) {
        console.error('Supabase: Error registering user:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Supabase saveUser error:', err);
      return { success: false, error: err.message || String(err) };
    }
  }

  // Generic key-value state persistence to simulate full-cloud state synchronization
  // or storing collection tables
  static async fetchCollection(table: string, defaultValue: any[]): Promise<any[]> {
    if (!this.isEnabled()) return defaultValue;
    try {
      const { data, error } = await supabase!
        .from(table)
        .select('*');
      
      if (error) {
        // If the table doesn't exist yet, we fall back to generic store or local default
        return defaultValue;
      }
      
      // Map supabase response snake_case to camelCase nicely if needed, or return object direct
      return data || defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static async upsertRecord(table: string, record: any): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      // Map standard keys
      await supabase!.from(table).upsert(record);
    } catch (err) {
      console.error(`Supabase error saving to ${table}:`, err);
    }
  }

  static async deleteRecord(table: string, id: string): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await supabase!.from(table).delete().eq('id', id);
    } catch (err) {
      console.error(`Supabase delete error in ${table}:`, err);
    }
  }
}
