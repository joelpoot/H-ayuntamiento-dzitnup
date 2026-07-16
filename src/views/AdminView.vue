<template>
  <div>
    <!-- Login -->
    <div v-if="!autenticado" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl flex flex-col md:flex-row">

        <!-- Columna formulario -->
        <div class="flex-1 p-8 md:p-10 flex flex-col justify-center">

          <!-- Vista: Iniciar sesión -->
          <template v-if="vistaLogin === 'login'">
            <p class="text-xs font-semibold text-[#c2a878] uppercase tracking-widest mb-1">Panel de Administración</p>
            <h1 class="text-2xl font-bold text-[#14392b] mb-6">Iniciar Sesión</h1>

            <div v-if="errorLogin" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <XCircle :size="16" class="shrink-0" />
              Credenciales incorrectas
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Correo electrónico</label>
                <input v-model="loginForm.email" type="email" placeholder="admin@dzitnup.gob.mx"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Contraseña</label>
                <div class="relative mt-1">
                  <input v-model="loginForm.password" :type="mostrarPassword ? 'text' : 'password'" placeholder="••••••••" @keyup.enter="iniciarSesion"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[#14392b]" />
                  <button type="button" @click="mostrarPassword = !mostrarPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg v-if="!mostrarPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke-linecap="round" stroke-linejoin="round" />
                  <line x1="1" y1="1" x2="23" y2="23" stroke-linecap="round" />
                  </svg>
                  </button>
                </div>
              </div>

              <button type="button" @click="vistaLogin = 'recuperar'" class="text-xs text-[#14392b] underline hover:no-underline">
                ¿Olvidaste tu contraseña?
              </button>

              <button @click="iniciarSesion" :disabled="cargandoLogin"
                class="w-full bg-[#14392b] text-white font-bold py-3 rounded-lg hover:bg-[#0a1f17] transition-colors disabled:opacity-50">
                {{ cargandoLogin ? 'Verificando...' : 'Iniciar Sesión' }}
              </button>
            </div>
          </template>

          <!-- Vista: Recuperar contraseña -->
          <template v-else>
            <p class="text-xs font-semibold text-[#c2a878] uppercase tracking-widest mb-1">Panel de Administración</p>
            <h1 class="text-2xl font-bold text-[#14392b] mb-2">Recuperar Contraseña</h1>
            <p class="text-sm text-gray-500 mb-6">Te enviaremos un enlace a tu correo para crear una nueva contraseña.</p>

            <div v-if="recuperarEnviado" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />
              Si el correo existe, te llegará un enlace en unos minutos.
            </div>
            <div v-if="recuperarError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <XCircle :size="16" class="shrink-0" />
              Ocurrió un error al enviar el enlace. Intenta de nuevo.
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Correo electrónico</label>
                <input v-model="recuperarForm.email" type="email" placeholder="admin@dzitnup.gob.mx" @keyup.enter="enviarRecuperacion"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>

              <button @click="enviarRecuperacion" :disabled="cargandoRecuperar"
                class="w-full bg-[#14392b] text-white font-bold py-3 rounded-lg hover:bg-[#0a1f17] transition-colors disabled:opacity-50">
                {{ cargandoRecuperar ? 'Enviando...' : 'Enviar enlace de recuperación' }}
              </button>

              <button type="button" @click="vistaLogin = 'login'; recuperarEnviado = false; recuperarError = false"
                class="w-full text-xs text-gray-500 underline hover:no-underline">
                Volver a iniciar sesión
              </button>
            </div>
          </template>

        </div>

        <!-- Columna institucional -->
        <div class="flex-1 bg-[#14392b] p-8 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div class="absolute inset-0" style="background: radial-gradient(circle at 70% 20%, rgba(194,168,120,0.18), transparent 60%)"></div>
          <div class="relative w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4" style="box-shadow: 0 0 24px rgba(194,168,120,0.4)">
            <Landmark :size="34" class="text-[#14392b]" />
          </div>
          <p class="relative text-[#f0e6d0] font-bold text-sm tracking-wide">COMISARÍA MUNICIPAL</p>
          <p class="relative text-white font-extrabold text-2xl tracking-wide mt-0.5">DZITNUP</p>
          <p class="relative text-[#9fb8ad] text-xs tracking-widest mt-1">YUCATÁN &middot; MÉXICO</p>
          <div class="relative w-12 h-0.5 bg-[#c2a878] my-4 opacity-70"></div>
          <p class="relative text-[#cfe0d8] text-sm leading-relaxed">Acceso exclusivo para personal autorizado de la Comisaría.</p>
        </div>

      </div>
    </div>

    <!-- Panel Admin -->
    <div v-else>
      <div class="bg-[#14392b] px-8 py-6 flex justify-between items-center">
        <div>
          <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Panel de Administración</h1>
          <p class="text-green-200 text-sm mt-1">Comisaria Municipal de Dzitnup</p>
        </div>
        <button @click="cerrarSesion"
          class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">
          Cerrar Sesión
        </button>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex gap-2 mb-6 flex-wrap">
          <button v-for="tab in tabs" :key="tab.id" @click="tabActivo = tab.id"
            :class="tabActivo === tab.id ? 'bg-[#14392b] text-white' : 'border border-[#14392b] text-[#14392b] hover:bg-[#14392b] hover:text-white'"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Reportes -->
        <div v-if="tabActivo === 'reportes'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Gestión de Reportes</h2>
          <div v-if="cargandoReportes" class="text-center py-6 text-gray-400">Cargando...</div>
          <div v-else class="space-y-3">
            <div v-for="r in reportes" :key="r.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex">
              <div class="w-1.5 shrink-0" :class="colorBarra(r.estado)"></div>
              <div class="w-28 shrink-0 bg-gray-50 flex items-center justify-center border-r border-gray-100 p-2">
                <img v-if="r.foto_url" :src="r.foto_url" class="w-full h-full object-contain cursor-pointer" @click="verImagen(r.foto_url)" />
                <ImageOff v-else :size="28" class="text-gray-300" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="bg-[#14392b] px-4 py-3 flex justify-between items-center gap-2 flex-wrap">
                  <p class="text-white font-bold text-sm">{{ r.tipo }}</p>
                  <div class="flex gap-2 flex-wrap">
                    <span :class="estadoColor(r.estado)" class="text-xs px-3 py-1 rounded-full font-semibold">{{ r.estado }}</span>
                    <span v-if="!r.moderado" class="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-semibold">Pendiente de revisión</span>
                    <span v-else class="bg-[#c2a878] text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Check :size="12" />Aprobado
                    </span>
                  </div>
                </div>
                <div class="p-4">
                  <p class="text-sm text-gray-600 mb-3">{{ r.descripcion }}</p>
                  <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-3">
                    <div class="flex items-center gap-2 text-gray-500"><span class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0"><MapPin :size="14" /></span>{{ r.ubicacion }}</div>
                    <div class="flex items-center gap-2 text-gray-500"><span class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0"><Calendar :size="14" /></span>{{ formatFecha(r.fecha_registro) }}</div>
                    <div v-if="r.nombre" class="flex items-center gap-2 text-gray-500"><span class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0"><User :size="14" /></span>{{ r.nombre }}</div>
                    <div v-if="r.telefono" class="flex items-center gap-2 text-gray-500"><span class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0"><Phone :size="14" /></span>{{ r.telefono }}</div>
                  </div>
                  <div class="border-t border-gray-100 pt-3 flex items-center gap-3 flex-wrap">
                    <template v-if="!r.moderado">
                      <button @click="aprobarReporte(r)" class="bg-green-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-1.5"><CheckCircle2 :size="14" />Aprobar</button>
                      <button @click="rechazarReporte(r)" class="bg-red-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-1.5"><XCircle :size="14" />Rechazar</button>
                    </template>
                    <template v-else>
                      <span class="text-xs font-semibold text-gray-500">Cambiar estado:</span>
                      <select :value="r.estado" @change="cambiarEstado(r, $event.target.value)"
                        class="text-xs px-3 py-1.5 rounded-lg border-2 font-semibold bg-white focus:outline-none"
                        :class="bordeSelect(r.estado)">
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Resuelto">Resuelto</option>
                      </select>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Avisos -->
        <div v-if="tabActivo === 'avisos'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Publicar Nuevo Aviso</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div v-if="exitoAviso" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />Aviso publicado correctamente
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Título</label>
                <input v-model="nuevoAviso.titulo" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Categoría</label>
                <select v-model="nuevoAviso.categoria" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]">
                  <option>Corte de agua</option><option>Corte de luz</option><option>Obra</option><option>Evento</option><option>General</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label>
                <textarea v-model="nuevoAviso.descripcion" rows="3" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Área</label>
                <input v-model="nuevoAviso.area" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Fecha de Vigencia</label>
                <input v-model="nuevoAviso.fecha_vigencia" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>
            </div>
            <div class="mt-4">
              <label class="text-xs font-semibold text-gray-500 uppercase">Imagen (opcional)</label>
              <input @change="seleccionarImagen" type="file" accept="image/*" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              <div v-if="previstaImagen" class="mt-4">
                <p class="text-xs text-gray-500 mb-1">Vista previa:</p>
                <img :src="previstaImagen" class="w-48 h-48 object-cover rounded-lg border border-gray-200" />
              </div>
            </div>
            <div class="mt-6 text-center">
              <button @click="publicarAviso" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Publicar Aviso</button>
            </div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Avisos Publicados</h2>
            <div v-if="cargandoAvisos" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="a in avisos" :key="a.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="avisoEditando && avisoEditando.id === a.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Título</label><input v-model="avisoEditando.titulo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Categoría</label><select v-model="avisoEditando.categoria" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"><option>Corte de agua</option><option>Corte de luz</option><option>Obra</option><option>Evento</option><option>General</option></select></div>
                  <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label><textarea v-model="avisoEditando.descripcion" rows="2" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Área</label><input v-model="avisoEditando.area" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Fecha de Vigencia</label><input v-model="avisoEditando.fecha_vigencia" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2 flex items-center gap-3 mt-1">
                    <span class="text-xs font-semibold text-gray-500 uppercase">Estado actual:</span>
                    <span :class="estadoAviso(avisoEditando).clase" class="text-xs px-2 py-0.5 rounded-full font-semibold">{{ estadoAviso(avisoEditando).label }}</span>
                    <button v-if="!avisoVencido(avisoEditando) && avisoEditando.estado !== 'Cancelado'"
                      type="button" @click="avisoEditando.estado = 'Cancelado'"
                      class="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-lg hover:bg-orange-200 transition-colors font-semibold flex items-center gap-1.5">
                      <Ban :size="14" />Cancelar aviso antes de su vigencia
                    </button>
                    <span v-else-if="avisoVencido(avisoEditando)" class="text-xs text-gray-400">Ya venció por fecha, no se puede reactivar desde aquí.</span>
                  </div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicion" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicion" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex justify-between items-start gap-4">
                  <div class="flex gap-3 flex-1">
                    <img v-if="a.imagen_url" :src="a.imagen_url" class="w-16 h-16 object-contain rounded-lg border border-gray-200 shrink-0" />
                    <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">Sin img</div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-bold text-gray-800 text-sm">{{ a.titulo }}</p>
                        <span class="bg-[#c2a878] text-white text-xs px-2 py-0.5 rounded-full font-semibold">{{ a.categoria }}</span>
                        <span :class="estadoAviso(a).clase" class="text-xs px-2 py-0.5 rounded-full font-semibold">{{ estadoAviso(a).label }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ a.descripcion }}</p>
                      <p class="text-xs text-gray-400 mt-1">Área: {{ a.area }} | Vig: {{ a.fecha_vigencia }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button @click="iniciarEdicion(a)" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarAviso(a)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Galería -->
        <div v-if="tabActivo === 'galeria'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Subir Foto a Galería</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div v-if="exitoGaleria" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />Foto subida correctamente
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Título</label><input v-model="nuevaFoto.titulo" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Categoría</label><select v-model="nuevaFoto.categoria" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"><option>Evento</option><option>Obra</option><option>Actividad</option><option>General</option></select></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Álbum</label><input v-model="nuevaFoto.album" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Fecha</label><input v-model="nuevaFoto.fecha" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label><textarea v-model="nuevaFoto.descripcion" rows="2" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea></div>
            </div>
            <div class="mt-4">
              <label class="text-xs font-semibold text-gray-500 uppercase">Imagen <span class="text-red-500">*</span></label>
              <input @change="seleccionarImagenGaleria" type="file" accept="image/*" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              <div v-if="previstaGaleria" class="mt-4"><p class="text-xs text-gray-500 mb-1">Vista previa:</p><img :src="previstaGaleria" class="w-48 h-48 object-cover rounded-lg border border-gray-200" /></div>
            </div>
            <div class="mt-6 text-center"><button @click="subirFoto" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Subir Foto</button></div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Fotos en Galería</h2>
            <div v-if="cargandoGaleria" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="f in galeria" :key="f.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="fotoEditando && fotoEditando.id === f.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Título</label><input v-model="fotoEditando.titulo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Categoría</label><select v-model="fotoEditando.categoria" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"><option>Evento</option><option>Obra</option><option>Actividad</option><option>General</option></select></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Álbum</label><input v-model="fotoEditando.album" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Fecha</label><input v-model="fotoEditando.fecha" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label><textarea v-model="fotoEditando.descripcion" rows="2" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea></div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionFoto" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionFoto" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex justify-between items-start gap-4">
                  <div class="flex gap-3 flex-1">
                    <img v-if="f.imagen_url" :src="f.imagen_url" class="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
                    <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">Sin img</div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-bold text-gray-800 text-sm">{{ f.titulo }}</p>
                        <span class="bg-[#c2a878] text-white text-xs px-2 py-0.5 rounded-full font-semibold">{{ f.categoria }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ f.descripcion }}</p>
                      <p class="text-xs text-gray-400 mt-1 flex items-center gap-1"><Folder :size="12" />{{ f.album }} | {{ f.fecha }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button @click="iniciarEdicionFoto(f)" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarFoto(f)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Horarios -->
        <div v-if="tabActivo === 'horarios'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Agregar Horario</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div v-if="exitoHorario" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />Horario guardado correctamente
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Área / Departamento</label><input v-model="nuevoHorario.area" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Días</label><input v-model="nuevoHorario.dias" type="text" placeholder="Ej. Lunes a Viernes" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Entrada</label><input v-model="nuevoHorario.hora_entrada" type="text" placeholder="Ej. 8:00 AM" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Salida</label><input v-model="nuevoHorario.hora_salida" type="text" placeholder="Ej. 3:00 PM" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Observaciones (opcional)</label><input v-model="nuevoHorario.observaciones" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
            </div>
            <div class="mt-6 text-center"><button @click="agregarHorario" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Agregar Horario</button></div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Horarios Registrados</h2>
            <div v-if="cargandoHorarios" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="h in horarios" :key="h.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="horarioEditando && horarioEditando.id === h.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Área</label><input v-model="horarioEditando.area" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Días</label><input v-model="horarioEditando.dias" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Entrada</label><input v-model="horarioEditando.hora_entrada" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Salida</label><input v-model="horarioEditando.hora_salida" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Observaciones</label><input v-model="horarioEditando.observaciones" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionHorario" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionHorario" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex justify-between items-center gap-4">
                  <div>
                    <p class="font-bold text-gray-800 text-sm">{{ h.area }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ h.dias }} | {{ h.hora_entrada }} - {{ h.hora_salida }}</p>
                    <p v-if="h.observaciones" class="text-xs text-gray-400 mt-1">{{ h.observaciones }}</p>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button @click="iniciarEdicionHorario(h)" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarHorario(h)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Directorio -->
        <div v-if="tabActivo === 'directorio'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Agregar Contacto</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div v-if="exitoDirectorio" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />Contacto guardado correctamente
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Nombre</label><input v-model="nuevoContacto.nombre" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Iniciales</label><input v-model="nuevoContacto.iniciales" type="text" placeholder="Ej. BP" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Cargo</label><input v-model="nuevoContacto.cargo" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Área</label><input v-model="nuevoContacto.area" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Teléfono</label><input v-model="nuevoContacto.telefono" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
            </div>
            <div class="mt-6 text-center"><button @click="agregarContacto" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Agregar Contacto</button></div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Contactos Registrados</h2>
            <div v-if="cargandoDirectorio" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="c in directorio" :key="c.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="contactoEditando && contactoEditando.id === c.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Nombre</label><input v-model="contactoEditando.nombre" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Iniciales</label><input v-model="contactoEditando.iniciales" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Cargo</label><input v-model="contactoEditando.cargo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Área</label><input v-model="contactoEditando.area" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Teléfono</label><input v-model="contactoEditando.telefono" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionContacto" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionContacto" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex justify-between items-center gap-4">
                  <div class="flex gap-3 items-center">
                    <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">{{ c.iniciales }}</div>
                    <div>
                      <p class="font-bold text-gray-800 text-sm">{{ c.nombre }}</p>
                      <p class="text-xs text-[#c2a878] font-semibold uppercase">{{ c.cargo }}</p>
                      <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Phone :size="12" />{{ c.telefono }} | {{ c.area }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button @click="iniciarEdicionContacto(c)" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarContacto(c)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Agenda -->
        <div v-if="tabActivo === 'agenda'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Agregar Evento</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div v-if="exitoAgenda" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />Evento guardado correctamente
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Título</label><input v-model="nuevoEvento.titulo" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Tipo</label><select v-model="nuevoEvento.tipo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"><option>Cabildo</option><option>Cultural</option><option>Actividad</option><option>Cívico</option><option>General</option></select></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Fecha</label><input v-model="nuevoEvento.fecha" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora</label><input v-model="nuevoEvento.hora" type="text" placeholder="Ej. 10:00 AM" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Lugar</label><input v-model="nuevoEvento.lugar" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Dirigido a</label><input v-model="nuevoEvento.dirigido" type="text" placeholder="Ej. Toda la comunidad" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label><textarea v-model="nuevoEvento.descripcion" rows="2" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea></div>
            </div>
            <div class="mt-6 text-center"><button @click="agregarEvento" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Agregar Evento</button></div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Eventos Registrados</h2>
            <div v-if="cargandoAgenda" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="e in agenda" :key="e.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="eventoEditando && eventoEditando.id === e.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Título</label><input v-model="eventoEditando.titulo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Tipo</label><select v-model="eventoEditando.tipo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"><option>Cabildo</option><option>Cultural</option><option>Actividad</option><option>Cívico</option><option>General</option></select></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Fecha</label><input v-model="eventoEditando.fecha" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora</label><input v-model="eventoEditando.hora" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Lugar</label><input v-model="eventoEditando.lugar" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Dirigido a</label><input v-model="eventoEditando.dirigido" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label><textarea v-model="eventoEditando.descripcion" rows="2" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea></div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionEvento" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionEvento" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex justify-between items-start gap-4">
                  <div class="flex gap-3 items-start">
                    <div class="bg-[#14392b] text-white rounded-lg px-3 py-2 text-center shrink-0">
                      <p class="text-lg font-bold">{{ e.fecha ? new Date(e.fecha).getUTCDate().toString().padStart(2,'0') : '' }}</p>
                      <p class="text-xs uppercase">{{ e.fecha ? new Date(e.fecha).toLocaleDateString('es-MX', {month:'short'}).toUpperCase() : '' }}</p>
                    </div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-bold text-gray-800 text-sm">{{ e.titulo }}</p>
                        <span class="bg-[#c2a878] text-white text-xs px-2 py-0.5 rounded-full font-semibold">{{ e.tipo }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ e.descripcion }}</p>
                      <div class="flex gap-3 mt-1 text-xs text-gray-400">
                        <span class="flex items-center gap-1"><MapPin :size="12" />{{ e.lugar }}</span>
                        <span class="flex items-center gap-1"><Clock :size="12" />{{ e.hora }}</span>
                        <span class="flex items-center gap-1"><Users :size="12" />{{ e.dirigido }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button @click="iniciarEdicionEvento(e)" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarEvento(e)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import { adminState } from '../stores/adminState.js'
import { XCircle, ImageOff, Check, MapPin, Calendar, User, Phone, CheckCircle2, Ban, Save, Folder, Clock, Users, Landmark } from 'lucide-vue-next'


// --- Auth ---
const autenticado = ref(false)
const errorLogin = ref(false)
const cargandoLogin = ref(false)
const tabActivo = ref('reportes')
const loginForm = ref({ email: '', password: '' })
const mostrarPassword = ref(false)

const vistaLogin = ref('login') // 'login' | 'recuperar'
const recuperarForm = ref({ email: '' })
const recuperarEnviado = ref(false)
const recuperarError = ref(false)
const cargandoRecuperar = ref(false)

const enviarRecuperacion = async () => {
  if (!recuperarForm.value.email) return
  cargandoRecuperar.value = true
  recuperarEnviado.value = false
  recuperarError.value = false

  const { error } = await supabase.auth.resetPasswordForEmail(recuperarForm.value.email, {
    redirectTo: `${window.location.origin}/admin/restablecer`
  })

  cargandoRecuperar.value = false
  if (error) {
    recuperarError.value = true
  } else {
    recuperarEnviado.value = true
    recuperarForm.value.email = ''
  }
}

const tabs = [
  { id: 'reportes', label: 'Reportes' },
  { id: 'avisos', label: 'Avisos' },
  { id: 'galeria', label: 'Galería' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'directorio', label: 'Directorio' },
  { id: 'agenda', label: 'Agenda' },
]

const cargarTodo = () => {
  cargarReportes()
  cargarAvisos()
  cargarGaleria()
  cargarHorarios()
  cargarDirectorio()
  cargarAgenda()
}

// Verifica si ya hay una sesión activa al cargar la página
onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    autenticado.value = true
    adminState.autenticado = true
    cargarTodo()
  }
})

const iniciarSesion = async () => {
  cargandoLogin.value = true
  errorLogin.value = false

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginForm.value.email,
    password: loginForm.value.password
  })

  cargandoLogin.value = false

  if (error) {
    errorLogin.value = true
  } else {
    autenticado.value = true
    adminState.autenticado = true
    loginForm.value = { email: '', password: '' }
    cargarTodo()
  }
}

const cerrarSesion = async () => {
  await supabase.auth.signOut()
  autenticado.value = false
  adminState.autenticado = false
  loginForm.value = { email: '', password: '' }
}

// --- Reportes ---
const reportes = ref([])
const cargandoReportes = ref(true)

const cargarReportes = async () => {
  cargandoReportes.value = true
  const { data, error } = await supabase.from('reportes').select('*').order('fecha_registro', { ascending: false })
  if (!error) {
    const reportesConUrl = await Promise.all(data.map(async (r) => {
      if (r.foto_url) {
        const { data: signedData } = await supabase.storage
          .from('reportes')
          .createSignedUrl(r.foto_url, 3600)
        return { ...r, foto_url: signedData?.signedUrl || null }
      }
      return r
    }))
    reportes.value = reportesConUrl
  }
  cargandoReportes.value = false
}

const cambiarEstado = async (reporte, nuevoEstado) => {
  const { error } = await supabase.from('reportes').update({ estado: nuevoEstado }).eq('id', reporte.id)
  if (!error) reporte.estado = nuevoEstado
}

const aprobarReporte = async (reporte) => {
  const { error } = await supabase.from('reportes').update({ moderado: true, estado: 'Pendiente' }).eq('id', reporte.id)
  if (!error) { reporte.moderado = true; reporte.estado = 'Pendiente' }
}

const rechazarReporte = async (reporte) => {
  if (confirm('¿Estás seguro de rechazar y eliminar este reporte?')) {
    const { error } = await supabase.from('reportes').delete().eq('id', reporte.id)
    if (!error) reportes.value = reportes.value.filter(r => r.id !== reporte.id)
  }
}

const verImagen = (url) => window.open(url, '_blank')

// --- Avisos ---
const avisos = ref([])
const cargandoAvisos = ref(false)
const exitoAviso = ref(false)
const avisoEditando = ref(null)
const archivoImagen = ref(null)
const previstaImagen = ref(null)

const nuevoAviso = ref({ titulo: '', categoria: 'General', descripcion: '', area: '', fecha_vigencia: '', estado: 'Activo' })

const cargarAvisos = async () => {
  cargandoAvisos.value = true
  const { data, error } = await supabase.from('avisos').select('*').order('fecha_publicacion', { ascending: false })
  if (!error) avisos.value = data
  cargandoAvisos.value = false
}

// --- Lógica de estado automático (fecha_vigencia) + cancelación manual anticipada ---
// 'estado' ya no significa "Activo/Inactivo" elegido a mano para todo el ciclo de vida.
// Ahora solo puede valer 'Activo' (default, sigue la fecha) o 'Cancelado' (apagado manual antes de tiempo).
// El estado visible real (Activo / Vencido / Cancelado) se calcula siempre, nunca se confía en el texto crudo.

const hoyStr = () => new Date().toISOString().split('T')[0]

const avisoVencido = (aviso) => !!aviso.fecha_vigencia && aviso.fecha_vigencia < hoyStr()

const estadoAviso = (aviso) => {
  if (aviso.estado === 'Cancelado') return { label: 'Cancelado', clase: 'bg-gray-200 text-gray-700' }
  if (avisoVencido(aviso)) return { label: 'Vencido', clase: 'bg-red-100 text-red-700' }
  return { label: 'Activo', clase: 'bg-green-100 text-green-700' }
}

const cancelarAviso = async (aviso) => {
  if (!confirm(`¿Cancelar el aviso "${aviso.titulo}" antes de que llegue su fecha de vigencia? Esta acción no se puede revertir desde el panel.`)) return
  const { error } = await supabase.from('avisos').update({ estado: 'Cancelado' }).eq('id', aviso.id)
  if (!error) {
    const idx = avisos.value.findIndex(a => a.id === aviso.id)
    if (idx !== -1) avisos.value[idx].estado = 'Cancelado'
  }
}

const comprimirImagen = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width, height = img.height
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth }
        canvas.width = width; canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality)
      }
    }
  })
}

const seleccionarImagen = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const comprimida = await comprimirImagen(file)
  archivoImagen.value = comprimida
  previstaImagen.value = URL.createObjectURL(comprimida)
}

const publicarAviso = async () => {
  const hoy = new Date().toISOString().split('T')[0]
  let imagen_url = null
  if (archivoImagen.value) {
    const archivo = archivoImagen.value
    const nombre = `${Date.now()}.${archivo.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage.from('avisos').upload(nombre, archivo)
    if (uploadError) { alert('Error al subir la imagen'); return }
    const { data: urlData } = supabase.storage.from('avisos').getPublicUrl(nombre)
    imagen_url = urlData.publicUrl
  }
  const { error } = await supabase.from('avisos').insert([{
    titulo: nuevoAviso.value.titulo, categoria: nuevoAviso.value.categoria,
    descripcion: nuevoAviso.value.descripcion, area: nuevoAviso.value.area,
    fecha_publicacion: hoy, fecha_vigencia: nuevoAviso.value.fecha_vigencia, estado: 'Activo', imagen_url
  }])
  if (!error) {
    exitoAviso.value = true
    nuevoAviso.value = { titulo: '', categoria: 'General', descripcion: '', area: '', fecha_vigencia: '', estado: 'Activo' }
    archivoImagen.value = null; previstaImagen.value = null
    cargarAvisos()
    setTimeout(() => exitoAviso.value = false, 3000)
  }
}

const eliminarAviso = async (aviso) => {
  if (!confirm(`¿Eliminar el aviso "${aviso.titulo}"?`)) return
  const { error } = await supabase.from('avisos').delete().eq('id', aviso.id)
  if (!error) avisos.value = avisos.value.filter(a => a.id !== aviso.id)
}

const iniciarEdicion = (aviso) => { avisoEditando.value = { ...aviso } }
const cancelarEdicion = () => { avisoEditando.value = null }

const guardarEdicion = async () => {
  const { error } = await supabase.from('avisos').update({
    titulo: avisoEditando.value.titulo, categoria: avisoEditando.value.categoria,
    descripcion: avisoEditando.value.descripcion, area: avisoEditando.value.area,
    fecha_vigencia: avisoEditando.value.fecha_vigencia, estado: avisoEditando.value.estado
  }).eq('id', avisoEditando.value.id)
  if (!error) {
    const idx = avisos.value.findIndex(a => a.id === avisoEditando.value.id)
    if (idx !== -1) avisos.value[idx] = { ...avisoEditando.value }
    avisoEditando.value = null
  }
}

// --- Galería ---
const galeria = ref([])
const cargandoGaleria = ref(false)
const exitoGaleria = ref(false)
const fotoEditando = ref(null)
const archivoGaleria = ref(null)
const previstaGaleria = ref(null)

const nuevaFoto = ref({ titulo: '', categoria: 'Evento', album: '', descripcion: '', fecha: '' })

const cargarGaleria = async () => {
  cargandoGaleria.value = true
  const { data, error } = await supabase.from('galeria').select('*').order('fecha', { ascending: false })
  if (!error) galeria.value = data
  cargandoGaleria.value = false
}

const seleccionarImagenGaleria = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const comprimida = await comprimirImagen(file)
  archivoGaleria.value = comprimida
  previstaGaleria.value = URL.createObjectURL(comprimida)
}

const subirFoto = async () => {
  if (!archivoGaleria.value) { alert('Selecciona una imagen'); return }
  const archivo = archivoGaleria.value
  const nombre = `${Date.now()}.${archivo.name.split('.').pop()}`
  const { error: uploadError } = await supabase.storage.from('galeria').upload(nombre, archivo)
  if (uploadError) { alert('Error al subir la imagen'); return }
  const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(nombre)
  const { error } = await supabase.from('galeria').insert([{
    titulo: nuevaFoto.value.titulo, categoria: nuevaFoto.value.categoria,
    album: nuevaFoto.value.album, descripcion: nuevaFoto.value.descripcion,
    fecha: nuevaFoto.value.fecha, imagen_url: urlData.publicUrl
  }])
  if (!error) {
    exitoGaleria.value = true
    nuevaFoto.value = { titulo: '', categoria: 'Evento', album: '', descripcion: '', fecha: '' }
    archivoGaleria.value = null; previstaGaleria.value = null
    cargarGaleria()
    setTimeout(() => exitoGaleria.value = false, 3000)
  }
}

const eliminarFoto = async (foto) => {
  if (!confirm(`¿Eliminar la foto "${foto.titulo}"?`)) return
  const { error } = await supabase.from('galeria').delete().eq('id', foto.id)
  if (!error) galeria.value = galeria.value.filter(f => f.id !== foto.id)
}

const iniciarEdicionFoto = (foto) => { fotoEditando.value = { ...foto } }
const cancelarEdicionFoto = () => { fotoEditando.value = null }

const guardarEdicionFoto = async () => {
  const { error } = await supabase.from('galeria').update({
    titulo: fotoEditando.value.titulo, categoria: fotoEditando.value.categoria,
    album: fotoEditando.value.album, descripcion: fotoEditando.value.descripcion, fecha: fotoEditando.value.fecha
  }).eq('id', fotoEditando.value.id)
  if (!error) {
    const idx = galeria.value.findIndex(f => f.id === fotoEditando.value.id)
    if (idx !== -1) galeria.value[idx] = { ...fotoEditando.value }
    fotoEditando.value = null
  }
}

// --- Horarios ---
const horarios = ref([])
const cargandoHorarios = ref(false)
const exitoHorario = ref(false)
const horarioEditando = ref(null)

const nuevoHorario = ref({ area: '', dias: '', hora_entrada: '', hora_salida: '', observaciones: '' })

const cargarHorarios = async () => {
  cargandoHorarios.value = true
  const { data, error } = await supabase.from('horarios').select('*').order('area', { ascending: true })
  if (!error) horarios.value = data
  cargandoHorarios.value = false
}

const agregarHorario = async () => {
  const { error } = await supabase.from('horarios').insert([{
    area: nuevoHorario.value.area, dias: nuevoHorario.value.dias,
    hora_entrada: nuevoHorario.value.hora_entrada, hora_salida: nuevoHorario.value.hora_salida,
    observaciones: nuevoHorario.value.observaciones
  }])
  if (!error) {
    exitoHorario.value = true
    nuevoHorario.value = { area: '', dias: '', hora_entrada: '', hora_salida: '', observaciones: '' }
    cargarHorarios()
    setTimeout(() => exitoHorario.value = false, 3000)
  }
}

const eliminarHorario = async (h) => {
  if (!confirm(`¿Eliminar el horario de "${h.area}"?`)) return
  const { error } = await supabase.from('horarios').delete().eq('id', h.id)
  if (!error) horarios.value = horarios.value.filter(x => x.id !== h.id)
}

const iniciarEdicionHorario = (h) => { horarioEditando.value = { ...h } }
const cancelarEdicionHorario = () => { horarioEditando.value = null }

const guardarEdicionHorario = async () => {
  const { error } = await supabase.from('horarios').update({
    area: horarioEditando.value.area, dias: horarioEditando.value.dias,
    hora_entrada: horarioEditando.value.hora_entrada, hora_salida: horarioEditando.value.hora_salida,
    observaciones: horarioEditando.value.observaciones
  }).eq('id', horarioEditando.value.id)
  if (!error) {
    const idx = horarios.value.findIndex(h => h.id === horarioEditando.value.id)
    if (idx !== -1) horarios.value[idx] = { ...horarioEditando.value }
    horarioEditando.value = null
  }
}

// --- Directorio ---
const directorio = ref([])
const cargandoDirectorio = ref(false)
const exitoDirectorio = ref(false)
const contactoEditando = ref(null)

const nuevoContacto = ref({ nombre: '', iniciales: '', cargo: '', area: '', telefono: '' })

const cargarDirectorio = async () => {
  cargandoDirectorio.value = true
  const { data, error } = await supabase.from('directorio').select('*').order('area', { ascending: true })
  if (!error) directorio.value = data
  cargandoDirectorio.value = false
}

const agregarContacto = async () => {
  const { error } = await supabase.from('directorio').insert([{
    nombre: nuevoContacto.value.nombre, iniciales: nuevoContacto.value.iniciales,
    cargo: nuevoContacto.value.cargo, area: nuevoContacto.value.area,
    telefono: nuevoContacto.value.telefono
  }])
  if (!error) {
    exitoDirectorio.value = true
    nuevoContacto.value = { nombre: '', iniciales: '', cargo: '', area: '', telefono: '' }
    cargarDirectorio()
    setTimeout(() => exitoDirectorio.value = false, 3000)
  }
}

const eliminarContacto = async (c) => {
  if (!confirm(`¿Eliminar el contacto "${c.nombre}"?`)) return
  const { error } = await supabase.from('directorio').delete().eq('id', c.id)
  if (!error) directorio.value = directorio.value.filter(x => x.id !== c.id)
}

const iniciarEdicionContacto = (c) => { contactoEditando.value = { ...c } }
const cancelarEdicionContacto = () => { contactoEditando.value = null }

const guardarEdicionContacto = async () => {
  const { error } = await supabase.from('directorio').update({
    nombre: contactoEditando.value.nombre, iniciales: contactoEditando.value.iniciales,
    cargo: contactoEditando.value.cargo, area: contactoEditando.value.area,
    telefono: contactoEditando.value.telefono
  }).eq('id', contactoEditando.value.id)
  if (!error) {
    const idx = directorio.value.findIndex(c => c.id === contactoEditando.value.id)
    if (idx !== -1) directorio.value[idx] = { ...contactoEditando.value }
    contactoEditando.value = null
  }
}

// --- Agenda ---
const agenda = ref([])
const cargandoAgenda = ref(false)
const exitoAgenda = ref(false)
const eventoEditando = ref(null)

const nuevoEvento = ref({ titulo: '', tipo: 'Cabildo', fecha: '', hora: '', lugar: '', dirigido: '', descripcion: '' })

const cargarAgenda = async () => {
  cargandoAgenda.value = true
  const { data, error } = await supabase.from('agenda').select('*').order('fecha', { ascending: true })
  if (!error) agenda.value = data
  cargandoAgenda.value = false
}

const agregarEvento = async () => {
  const { error } = await supabase.from('agenda').insert([{
    titulo: nuevoEvento.value.titulo, tipo: nuevoEvento.value.tipo,
    fecha: nuevoEvento.value.fecha, hora: nuevoEvento.value.hora,
    lugar: nuevoEvento.value.lugar, dirigido: nuevoEvento.value.dirigido,
    descripcion: nuevoEvento.value.descripcion
  }])
  if (!error) {
    exitoAgenda.value = true
    nuevoEvento.value = { titulo: '', tipo: 'Cabildo', fecha: '', hora: '', lugar: '', dirigido: '', descripcion: '' }
    cargarAgenda()
    setTimeout(() => exitoAgenda.value = false, 3000)
  }
}

const eliminarEvento = async (e) => {
  if (!confirm(`¿Eliminar el evento "${e.titulo}"?`)) return
  const { error } = await supabase.from('agenda').delete().eq('id', e.id)
  if (!error) agenda.value = agenda.value.filter(x => x.id !== e.id)
}

const iniciarEdicionEvento = (e) => { eventoEditando.value = { ...e } }
const cancelarEdicionEvento = () => { eventoEditando.value = null }

const guardarEdicionEvento = async () => {
  const { error } = await supabase.from('agenda').update({
    titulo: eventoEditando.value.titulo, tipo: eventoEditando.value.tipo,
    fecha: eventoEditando.value.fecha, hora: eventoEditando.value.hora,
    lugar: eventoEditando.value.lugar, dirigido: eventoEditando.value.dirigido,
    descripcion: eventoEditando.value.descripcion
  }).eq('id', eventoEditando.value.id)
  if (!error) {
    const idx = agenda.value.findIndex(e => e.id === eventoEditando.value.id)
    if (idx !== -1) agenda.value[idx] = { ...eventoEditando.value }
    eventoEditando.value = null
  }
}

// --- Helpers ---
const estadoColor = (estado) => {
  if (estado === 'Resuelto') return 'bg-green-100 text-green-700'
  if (estado === 'En Proceso') return 'bg-blue-100 text-blue-700'
  return 'bg-yellow-100 text-yellow-700'
}

const colorBarra = (estado) => {
  if (estado === 'Resuelto') return 'bg-green-500'
  if (estado === 'En Proceso') return 'bg-blue-500'
  return 'bg-yellow-400'
}

const bordeSelect = (estado) => {
  if (estado === 'Resuelto') return 'border-green-500 text-green-700'
  if (estado === 'En Proceso') return 'border-blue-500 text-blue-700'
  return 'border-yellow-400 text-yellow-700'
}

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX')
}
</script>