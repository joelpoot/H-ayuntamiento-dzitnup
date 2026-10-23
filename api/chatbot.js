import { createClient } from '@supabase/supabase-js'

// Mismo proyecto público que usa el resto del sitio (clave anon/publishable,
// solo lee contenido ya publicado). La ANTHROPIC_API_KEY, en cambio, vive
// únicamente como variable de entorno en Vercel: esta función corre en el
// servidor, así que nunca llega al navegador del visitante.
const supabase = createClient(
  'https://vyejkfmimfsxdpmgixuh.supabase.co',
  'sb_publishable_MXdZIbpjKXWCjRFGYs2oow_AGkC1yEE'
)

const MODELO = 'claude-haiku-5-5'
const MAX_LARGO_PREGUNTA = 500

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' })
    return
  }

  const pregunta = (req.body?.pregunta || '').toString().trim()

  if (!pregunta) {
    res.status(400).json({ error: 'Escribe una pregunta.' })
    return
  }
  if (pregunta.length > MAX_LARGO_PREGUNTA) {
    res.status(400).json({ error: 'Tu pregunta es demasiado larga. Intenta resumirla.' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Falta ANTHROPIC_API_KEY en las variables de entorno de Vercel.')
    res.status(500).json({ error: 'El asistente no está disponible por el momento.' })
    return
  }

  try {
    const contexto = await construirContexto()

    const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 400,
        system: construirPromptSistema(contexto),
        messages: [{ role: 'user', content: pregunta }],
      }),
    })

    if (!respuesta.ok) {
      const detalle = await respuesta.text()
      console.error('Error de la API de Anthropic:', respuesta.status, detalle)
      res.status(502).json({ error: 'No se pudo generar una respuesta. Intenta de nuevo en un momento.' })
      return
    }

    const datos = await respuesta.json()
    const texto = datos?.content?.find((b) => b.type === 'text')?.text?.trim()

    res.status(200).json({
      respuesta: texto || 'No encontré información suficiente para responder eso. Intenta reformular tu pregunta.',
    })
  } catch (err) {
    console.error('Error en /api/chatbot:', err)
    res.status(500).json({ error: 'Ocurrió un error inesperado. Intenta de nuevo.' })
  }
}

// Junta todo el contenido vigente del portal (avisos activos, horarios,
// directorio y próximos eventos) en un bloque de texto. Para el volumen de
// datos de una comisaría (decenas de filas, no miles) esto es más simple,
// barato y confiable que montar búsqueda semántica con embeddings, y cumple
// igual el objetivo: el modelo solo ve información realmente publicada.
async function construirContexto() {
  const hoy = new Date().toISOString().split('T')[0]

  const [avisosRes, horariosRes, directorioRes, agendaRes] = await Promise.all([
    supabase
      .from('avisos')
      .select('titulo, categoria, descripcion, area, fecha_vigencia, estado')
      .neq('estado', 'Cancelado')
      .gte('fecha_vigencia', hoy)
      .order('fecha_publicacion', { ascending: false }),
    supabase.from('horarios').select('area, dias, hora_entrada, hora_salida, observaciones'),
    supabase.from('directorio').select('nombre, cargo, area, telefono'),
    supabase
      .from('agenda')
      .select('titulo, tipo, fecha, hora, lugar, dirigido, descripcion')
      .gte('fecha', hoy)
      .order('fecha', { ascending: true }),
  ])

  const avisos = avisosRes.data || []
  const horarios = horariosRes.data || []
  const directorio = directorioRes.data || []
  const agenda = agendaRes.data || []

  const seccion = (titulo, lineas) =>
    lineas.length
      ? `## ${titulo}\n${lineas.join('\n')}`
      : `## ${titulo}\n(Sin registros publicados actualmente.)`

  return [
    seccion(
      'Avisos vigentes',
      avisos.map((a) => `- [${a.categoria}] ${a.titulo} (área: ${a.area || 'sin especificar'}, vigente hasta ${a.fecha_vigencia}): ${a.descripcion}`)
    ),
    seccion(
      'Horarios de atención',
      horarios.map((h) => `- ${h.area}: ${h.dias}, ${h.hora_entrada} a ${h.hora_salida}${h.observaciones ? ` (${h.observaciones})` : ''}`)
    ),
    seccion(
      'Directorio municipal',
      directorio.map((c) => `- ${c.nombre}, ${c.cargo} (${c.area}), tel. ${c.telefono}`)
    ),
    seccion(
      'Próximos eventos de la agenda',
      agenda.map((e) => `- ${e.titulo} (${e.tipo}) — ${e.fecha} ${e.hora}, en ${e.lugar}, dirigido a: ${e.dirigido}. ${e.descripcion}`)
    ),
  ].join('\n\n')
}

function construirPromptSistema(contexto) {
  return `Eres el asistente virtual del Portal Web Municipal de la Comisaría de Dzitnup, Yucatán. Ayudas a los ciudadanos a encontrar información oficial que ya está publicada en el portal.

REGLAS ESTRICTAS:
- Responde ÚNICAMENTE con la información que aparece en el bloque de DATOS PUBLICADOS más abajo. Es el contenido real y actual del portal.
- Si la pregunta no se puede responder con esos datos, dilo con honestidad (por ejemplo: "No tengo esa información publicada en este momento") y sugiere a la persona revisar la sección correspondiente del portal o contactar directamente a la Comisaría. Nunca inventes horarios, nombres, teléfonos, fechas ni ningún otro dato municipal.
- No dés consejos legales, médicos ni de ningún tipo que no esté respaldado por los datos.
- Responde en español, de forma breve, clara y amable, como lo haría un funcionario municipal atendiendo al público. Evita respuestas largas; ve directo al punto.
- Escribe solo texto plano: no uses markdown (nada de **negritas**, encabezados con #, ni listas con asteriscos), porque la ventana del chat lo muestra tal cual. Si necesitas enumerar, usa guiones simples al inicio de cada línea.

DATOS PUBLICADOS ACTUALMENTE EN EL PORTAL:
${contexto}`
}
