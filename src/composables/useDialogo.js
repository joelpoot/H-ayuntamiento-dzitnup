import { reactive } from 'vue'

// Estado global de un único diálogo modal (confirmación o aviso) reutilizable
// en toda la aplicación, para reemplazar los confirm()/alert() nativos del
// navegador por un componente con la identidad visual del sitio.
const estado = reactive({
  visible: false,
  tipo: 'info', // 'danger' | 'warning' | 'info' | 'success'
  titulo: '',
  mensaje: '',
  soloAviso: false,
  textoConfirmar: 'Aceptar',
  textoCancelar: 'Cancelar',
})

let resolver = null

const abrir = (mensaje, opciones, soloAviso) => {
  return new Promise((resolve) => {
    estado.visible = true
    estado.tipo = opciones.tipo || (soloAviso ? 'danger' : 'warning')
    estado.titulo = opciones.titulo || (soloAviso ? 'Aviso' : 'Confirmar acción')
    estado.mensaje = mensaje
    estado.soloAviso = soloAviso
    estado.textoConfirmar = opciones.textoConfirmar || (soloAviso ? 'Entendido' : 'Aceptar')
    estado.textoCancelar = opciones.textoCancelar || 'Cancelar'
    resolver = resolve
  })
}

// confirmar(mensaje, { tipo, titulo, textoConfirmar }) -> Promise<boolean>
export const confirmar = (mensaje, opciones = {}) => abrir(mensaje, opciones, false)

// avisar(mensaje, { tipo, titulo, textoConfirmar }) -> Promise<void>
export const avisar = (mensaje, opciones = {}) => abrir(mensaje, opciones, true)

export const resolverDialogo = (resultado) => {
  estado.visible = false
  if (resolver) { resolver(resultado); resolver = null }
}

export const dialogoState = estado
