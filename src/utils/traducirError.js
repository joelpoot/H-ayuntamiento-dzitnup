// Supabase y el navegador devuelven sus errores en inglés. Esta función los
// traduce para que el usuario siempre vea avisos en español. Se busca por
// fragmentos del mensaje (no por coincidencia exacta) porque Supabase a veces
// agrega detalles al final, como el nombre de la tabla o los segundos de espera.
const TRADUCCIONES = [
  // Autenticación
  ['signups not allowed', 'El registro de cuentas nuevas está desactivado en Supabase.'],
  ['email rate limit exceeded', 'Se alcanzó el límite de correos que se pueden enviar por hora. Intenta de nuevo más tarde.'],
  ['for security purposes, you can only request this after', 'Por seguridad, espera un minuto antes de volver a solicitarlo.'],
  ['over_email_send_rate_limit', 'Se alcanzó el límite de correos que se pueden enviar por hora. Intenta de nuevo más tarde.'],
  ['rate limit', 'Se hicieron demasiadas solicitudes. Espera un momento e intenta de nuevo.'],
  ['user already registered', 'Ya existe una cuenta con ese correo.'],
  ['already been registered', 'Ya existe una cuenta con ese correo.'],
  ['invalid login credentials', 'Correo o contraseña incorrectos.'],
  ['email not confirmed', 'El correo aún no ha sido confirmado.'],
  ['email address', 'El correo electrónico no es válido.'],
  ['password should be at least', 'La contraseña es demasiado corta.'],
  ['new password should be different', 'La nueva contraseña debe ser distinta a la anterior.'],
  ['weak password', 'La contraseña es demasiado débil.'],
  ['email link is invalid or has expired', 'El enlace ya no es válido o expiró.'],
  ['token has expired', 'El enlace ya no es válido o expiró.'],
  ['jwt expired', 'Tu sesión expiró. Vuelve a iniciar sesión.'],
  ['auth session missing', 'Tu sesión expiró. Vuelve a iniciar sesión.'],
  ['error sending', 'No se pudo enviar el correo. Revisa la configuración de correo en Supabase.'],

  // Base de datos
  ['permission denied', 'No tienes permiso para realizar esta acción.'],
  ['row-level security', 'No tienes permiso para realizar esta acción.'],
  ['duplicate key', 'Ya existe un registro con esos datos.'],
  ['violates foreign key', 'El registro está relacionado con otros datos y no se puede modificar.'],
  ['violates not-null', 'Falta llenar un campo obligatorio.'],
  ['violates check constraint', 'Uno de los valores no es válido.'],
  ['no autorizado', 'No tienes permiso para realizar esta acción.'],

  // Almacenamiento de archivos
  ['exceeded the maximum allowed size', 'El archivo es demasiado grande.'],
  ['payload too large', 'El archivo es demasiado grande.'],
  ['mime type', 'Formato de archivo no admitido.'],
  ['bucket not found', 'No se encontró la carpeta de almacenamiento.'],

  // Conexión
  ['failed to fetch', 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.'],
  ['networkerror', 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.'],
  ['network request failed', 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.'],
  ['load failed', 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.'],
  ['timeout', 'El servidor tardó demasiado en responder. Intenta de nuevo.'],
]

// Mensajes que ya escribimos en español en el propio código: se dejan tal cual.
const PARECE_ESPANOL = /[áéíóúñ¿¡]|\b(no se pudo|intenta|error de)\b/i

export const traducirError = (error, respaldo = 'Ocurrió un error inesperado. Intenta de nuevo.') => {
  const mensaje = (typeof error === 'string' ? error : error?.message || error?.error_description || '').trim()
  if (!mensaje) return respaldo

  const minusculas = mensaje.toLowerCase()
  const encontrada = TRADUCCIONES.find(([fragmento]) => minusculas.includes(fragmento))
  if (encontrada) return encontrada[1]

  if (PARECE_ESPANOL.test(mensaje)) return mensaje
  return respaldo
}
