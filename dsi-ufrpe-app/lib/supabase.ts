import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

// Acessando variáveis de ambiente
// No Expo, use o prefixo EXPO_PUBLIC_ para variáveis acessíveis no client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Cliente Supabase (lazy initialization para evitar erros de SSR)
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  // Verificar se estamos no ambiente de servidor (SSR)
  if (typeof window === 'undefined') {
    // Durante SSR, retorna um mock para evitar erros
    // Isso nunca será usado porque os componentes só acessam no cliente
    return {} as SupabaseClient
  }

  // Validar variáveis de ambiente apenas quando criar o cliente
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltam variáveis de ambiente do Supabase. Verifique seu arquivo .env')
  }

  // Criar instância apenas uma vez (singleton)
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  }

  return supabaseInstance
}

// Exportar um Proxy que chama getSupabaseClient() apenas quando acessado
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    const client = getSupabaseClient()
    return client[prop as keyof SupabaseClient]
  },
})