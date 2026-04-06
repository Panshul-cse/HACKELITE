import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://utdtwwmuuncuprxmseps.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_FrCdjqia5gHctg8TRsIllQ_bCmMblwq'

export const supabase = createClient(supabaseUrl, supabaseKey)