import { createClient } from '@supabase/supabase-js'

//@ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
//@ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const SITE_URL = 'https://apt-com-grillo.vercel.app'

export const signUpUser = async (email: string, password: string, name: string) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${SITE_URL}/auth/callback`
    }
  })
}
