import { createClient } from '@supabase/supabase-js'

// Exportadas (no solo locales) porque la barra de progreso real de subida
// de fotos en ReportesView necesita armar su propia petición con
// XMLHttpRequest en vez del cliente de Supabase (fetch no expone progreso
// de subida en ningún navegador).
export const supabaseUrl = 'https://vyejkfmimfsxdpmgixuh.supabase.co'
export const supabaseKey = 'sb_publishable_MXdZIbpjKXWCjRFGYs2oow_AGkC1yEE'

// La sesión se guarda en sessionStorage (no en localStorage, que es lo que
// Supabase usa por defecto): así solo vive en la pestaña donde se inició
// sesión. Abrir el panel en otra pestaña o volver a abrir el navegador pide
// iniciar sesión de nuevo, para que nadie más entre al panel desde una
// computadora donde un administrador lo dejó abierto.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { storage: window.sessionStorage }
})

// Borra las sesiones que quedaron guardadas en localStorage antes de este
// cambio, para que no se queden indefinidamente en el navegador.
try {
  Object.keys(window.localStorage)
    .filter((clave) => clave.startsWith('sb-') && clave.endsWith('-auth-token'))
    .forEach((clave) => window.localStorage.removeItem(clave))
} catch { /* el navegador bloqueó el acceso a localStorage; no hay nada que limpiar */ }

// Cliente aislado, sin persistir sesión en el navegador: se usa únicamente
// para dar de alta cuentas de operador desde el panel admin (Usuarios y Roles)
// sin reemplazar la sesión del administrador que ya tiene el cliente principal.
export const crearClienteSinSesion = () => createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
})