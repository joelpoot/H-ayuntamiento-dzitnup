import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vyejkfmimfsxdpmgixuh.supabase.co'
const supabaseKey = 'sb_publishable_MXdZIbpjKXWCjRFGYs2oow_AGkC1yEE'

export const supabase = createClient(supabaseUrl, supabaseKey)