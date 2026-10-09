import { createClient } from '@supabase/supabase-js'

// Exportadas (no solo locales) porque la barra de progreso real de subida
// de fotos en ReportesView necesita armar su propia petición con
// XMLHttpRequest en vez del cliente de Supabase (fetch no expone progreso
// de subida en ningún navegador).
export const supabaseUrl = 'https://vyejkfmimfsxdpmgixuh.supabase.co'
export const supabaseKey = 'sb_publishable_MXdZIbpjKXWCjRFGYs2oow_AGkC1yEE'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Cliente aislado, sin persistir sesión en el navegador: se usa únicamente
// para dar de alta cuentas de operador desde el panel admin (Usuarios y Roles)
// sin reemplazar la sesión del administrador que ya tiene el cliente principal.
export const crearClienteSinSesion = () => createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
})