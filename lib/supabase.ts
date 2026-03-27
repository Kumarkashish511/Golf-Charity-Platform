import { createClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const createBrowserClient = () => createClient(URL, ANON)
export const createServerClient = () => createClient(URL, ANON)
export const createAdminClient = () => createClient(URL, SERVICE)