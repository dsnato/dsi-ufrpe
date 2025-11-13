import AsyncStorage from '@react-native-async-storage/async-storage'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Acessando variáveis de ambiente
// No Expo, use o prefixo EXPO_PUBLIC_ para variáveis acessíveis no client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase. Verifique seu arquivo .env')
}

// Lazy initialization - cria o cliente apenas quando for usado pela primeira vez
let supabaseInstance: SupabaseClient | null = null

const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
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

// Exporta um proxy que inicializa o cliente apenas quando uma propriedade é acessada
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient()
    const value = client[prop as keyof SupabaseClient]

    // Se for uma função, bind ao contexto do cliente
    if (typeof value === 'function') {
      return value.bind(client)
    }

    return value
  }
})