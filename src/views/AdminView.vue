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
      <div class="bg-[#14392b] px-4 sm:px-8 py-6 flex flex-wrap justify-between items-center gap-3">
        <div class="min-w-0">
          <h1 class="text-white text-xl sm:text-2xl font-bold uppercase tracking-wide break-words">Panel de Administración</h1>
          <p class="text-green-200 text-sm mt-1">Comisaria Municipal de Dzitnup</p>
        </div>
        <button @click="cerrarSesion"
          class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors shrink-0">
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
          <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h2 class="text-[#14392b] font-bold text-lg">Gestión de Reportes</h2>
            <button @click="mostrarEstadisticas = !mostrarEstadisticas"
              class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#14392b] text-[#14392b] hover:bg-[#14392b] hover:text-white transition-colors flex items-center gap-1.5">
              <BarChart3 :size="14" />{{ mostrarEstadisticas ? 'Ocultar estadísticas' : 'Ver estadísticas' }}
            </button>
          </div>

          <div v-if="mostrarEstadisticas" class="mb-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reportes totales</p>
                <p class="text-3xl font-extrabold text-[#14392b] mt-1">{{ estadisticas.total }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tiempo prom. de resolución</p>
                <p class="text-3xl font-extrabold text-[#14392b] mt-1">
                  <template v-if="estadisticas.tiempoPromedio != null">{{ estadisticas.tiempoPromedio.toFixed(1) }} <span class="text-base font-semibold">días</span></template>
                  <template v-else>—</template>
                </p>
              </div>
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pendientes activos</p>
                <p class="text-3xl font-extrabold text-[#14392b] mt-1">{{ estadisticas.pendientesActivos }}</p>
              </div>
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasa de resolución</p>
                <p class="text-3xl font-extrabold text-[#14392b] mt-1">{{ estadisticas.tasaResolucion }}%</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 class="text-sm font-bold text-[#14392b] mb-1">Reportes por mes</h3>
                <p class="text-xs text-gray-400 mb-4">Últimos 6 meses, por fecha de registro</p>
                <div v-if="estadisticas.total === 0" class="text-sm text-gray-400">Aún no hay reportes registrados.</div>
                <div v-else class="flex items-end gap-3 h-40 border-b border-gray-200 px-1">
                  <div v-for="m in estadisticas.porMes" :key="m.label + m.anio" class="flex-1 flex flex-col items-center justify-end h-full">
                    <span class="text-xs font-bold text-[#14392b] mb-1">{{ m.cantidad }}</span>
                    <div class="w-full rounded-t" :style="{ height: Math.max(m.alturaPct, m.cantidad > 0 ? 4 : 0) + '%', background: 'linear-gradient(180deg, #c2a878, #14392b)' }"></div>
                    <span class="text-xs text-gray-500 mt-2">{{ m.label }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 class="text-sm font-bold text-[#14392b] mb-1">Distribución por estado</h3>
                <p class="text-xs text-gray-400 mb-4">Proporción sobre el total de reportes</p>
                <div v-if="estadisticas.total === 0" class="text-sm text-gray-400">Aún no hay reportes registrados.</div>
                <div v-else class="space-y-3">
                  <div v-for="e in estadisticas.porEstado" :key="e.estado">
                    <div class="flex justify-between text-xs mb-1">
                      <span class="font-semibold text-gray-600 flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full" :class="colorBarra(e.estado)"></span>{{ e.estado }}</span>
                      <span class="text-gray-400">{{ e.cantidad }} · {{ e.pct }}%</span>
                    </div>
                    <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full rounded-full" :class="colorBarra(e.estado)" :style="{ width: e.pct + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-sm font-bold text-[#14392b] mb-1">Tipos con más incidencias</h3>
              <p class="text-xs text-gray-400 mb-4">Ranking acumulado sobre el total de reportes</p>
              <div v-if="estadisticas.porTipo.length === 0" class="text-sm text-gray-400">Aún no hay reportes registrados.</div>
              <div v-else class="space-y-2">
                <div v-for="t in estadisticas.porTipo" :key="t.tipo" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="text-sm text-gray-700">{{ t.tipo }}</span>
                  <span class="text-sm font-bold text-[#14392b]">{{ t.cantidad }} {{ t.cantidad === 1 ? 'reporte' : 'reportes' }}</span>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-400 mt-3">El tiempo de resolución solo considera reportes Resueltos con fecha de cierre capturada más abajo.</p>
          </div>

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

                  <!-- Cierre financiero: solo aplica a reportes ya Resueltos -->
                  <div v-if="r.moderado && r.estado === 'Resuelto'" class="border-t border-gray-100 pt-3 mt-3">
                    <template v-if="cierreEditando && cierreEditando.id === r.id">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#e8dcc4]/40 border border-[#c2a878] rounded-lg p-3">
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">Categoría de gasto</label>
                          <input v-model="cierreEditando.categoria_gasto" type="text" placeholder="Ej. Mantenimiento vial"
                            class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">Monto ejercido (MXN)</label>
                          <input v-model.number="cierreEditando.monto_ejercido" type="number" min="0" step="0.01" placeholder="0.00"
                            class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">Proveedor / responsable</label>
                          <select v-model="cierreEditando.proveedor_id" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]">
                            <option :value="null">Sin especificar</option>
                            <option v-for="p in proveedores" :key="p.id" :value="p.id">{{ p.nombre }}</option>
                          </select>
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">Fecha de cierre</label>
                          <input v-model="cierreEditando.fecha_cierre" type="date"
                            class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
                        </div>
                        <div class="md:col-span-2 flex gap-2 mt-1">
                          <button @click="guardarCierreFinanciero" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar cierre</button>
                          <button @click="cierreEditando = null" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="r.monto_ejercido != null">
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-xs bg-[#e8dcc4]/40 border border-[#c2a878] rounded-lg p-3">
                        <div><span class="block text-gray-500 uppercase">Categoría de gasto</span><span class="font-bold text-[#14392b]">{{ r.categoria_gasto || '—' }}</span></div>
                        <div><span class="block text-gray-500 uppercase">Monto ejercido</span><span class="font-bold text-[#14392b]">{{ formatMonto(r.monto_ejercido) }}</span></div>
                        <div><span class="block text-gray-500 uppercase">Proveedor</span><span class="font-bold text-[#14392b]">{{ nombreProveedor(r.proveedor_id) }}</span></div>
                        <div class="flex items-center justify-between">
                          <div><span class="block text-gray-500 uppercase">Fecha de cierre</span><span class="font-bold text-[#14392b]">{{ r.fecha_cierre || '—' }}</span></div>
                          <div class="flex gap-2">
                            <button @click="iniciarCierreFinanciero(r)" class="text-blue-700 text-xs font-semibold hover:underline">Editar</button>
                            <button @click="eliminarCierreFinanciero(r)" class="text-red-600 text-xs font-semibold hover:underline">Eliminar</button>
                          </div>
                        </div>
                      </div>
                    </template>
                    <button v-else @click="iniciarCierreFinanciero(r)"
                      class="bg-[#c2a878] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#a8916a] transition-colors font-semibold flex items-center gap-1.5">
                      <Save :size="14" />Registrar costo de cierre
                    </button>
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
                      type="button" @click="cancelarAviso(avisoEditando)"
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
                <div v-else class="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-4">
                  <div class="flex gap-3 min-w-0">
                    <img v-if="a.imagen_url" :src="a.imagen_url" class="w-16 h-16 object-contain rounded-lg border border-gray-200 shrink-0" />
                    <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">Sin img</div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-bold text-gray-800 text-sm break-words">{{ a.titulo }}</p>
                        <span class="bg-[#c2a878] text-white text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">{{ a.categoria }}</span>
                        <span :class="estadoAviso(a).clase" class="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">{{ estadoAviso(a).label }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 break-words">{{ a.descripcion }}</p>
                      <p class="text-xs text-gray-400 mt-1 break-words">Área: {{ a.area }} | Vig: {{ a.fecha_vigencia }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0 self-end sm:self-start">
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
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Fecha</label><input v-model="fotoEditando.fecha" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label><textarea v-model="fotoEditando.descripcion" rows="2" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea></div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionFoto" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionFoto" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-4">
                  <div class="flex gap-3 min-w-0">
                    <img v-if="f.imagen_url" :src="f.imagen_url" class="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
                    <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">Sin img</div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-bold text-gray-800 text-sm break-words">{{ f.titulo }}</p>
                        <span class="bg-[#c2a878] text-white text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">{{ f.categoria }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 break-words">{{ f.descripcion }}</p>
                      <p class="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar :size="12" />{{ f.fecha }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0 self-end sm:self-start">
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
            <div v-if="errorValidacionHorario" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertTriangle :size="16" class="shrink-0" />{{ errorValidacionHorario }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Área / Departamento <span class="text-red-500">*</span></label><input v-model="nuevoHorario.area" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Días <span class="text-red-500">*</span></label><input v-model="nuevoHorario.dias" type="text" placeholder="Ej. Lunes a Viernes" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Entrada <span class="text-red-500">*</span></label><input v-model="nuevoHorario.hora_entrada" type="text" placeholder="Ej. 8:00 AM" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Salida <span class="text-red-500">*</span></label><input v-model="nuevoHorario.hora_salida" type="text" placeholder="Ej. 3:00 PM" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
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
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Área <span class="text-red-500">*</span></label><input v-model="horarioEditando.area" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Días <span class="text-red-500">*</span></label><input v-model="horarioEditando.dias" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Entrada <span class="text-red-500">*</span></label><input v-model="horarioEditando.hora_entrada" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Hora Salida <span class="text-red-500">*</span></label><input v-model="horarioEditando.hora_salida" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2"><label class="text-xs font-semibold text-gray-500 uppercase">Observaciones</label><input v-model="horarioEditando.observaciones" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div v-if="errorValidacionHorario" class="md:col-span-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle :size="14" class="shrink-0" />{{ errorValidacionHorario }}
                  </div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionHorario" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionHorario" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div class="min-w-0">
                    <p class="font-bold text-gray-800 text-sm break-words">{{ h.area }}</p>
                    <p class="text-xs text-gray-500 mt-1 break-words">{{ h.dias }} | {{ h.hora_entrada }} - {{ h.hora_salida }}</p>
                    <p v-if="h.observaciones" class="text-xs text-gray-400 mt-1 break-words">{{ h.observaciones }}</p>
                  </div>
                  <div class="flex gap-2 shrink-0 self-end sm:self-auto">
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
            <div v-if="errorValidacionDirectorio" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertTriangle :size="16" class="shrink-0" />{{ errorValidacionDirectorio }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Nombre <span class="text-red-500">*</span></label><input v-model="nuevoContacto.nombre" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Iniciales <span class="text-red-500">*</span></label><input v-model="nuevoContacto.iniciales" type="text" placeholder="Ej. BP" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Cargo <span class="text-red-500">*</span></label><input v-model="nuevoContacto.cargo" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Área <span class="text-red-500">*</span></label><input v-model="nuevoContacto.area" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Teléfono <span class="text-red-500">*</span></label><input v-model="nuevoContacto.telefono" @input="nuevoContacto.telefono = nuevoContacto.telefono.replace(/\D/g, '')" type="text" inputmode="numeric" maxlength="10" placeholder="Ej. 9991234567" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
            </div>
            <div class="mt-6 text-center"><button @click="agregarContacto" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Agregar Contacto</button></div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Contactos Registrados</h2>
            <div v-if="cargandoDirectorio" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="c in directorio" :key="c.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="contactoEditando && contactoEditando.id === c.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Nombre <span class="text-red-500">*</span></label><input v-model="contactoEditando.nombre" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Iniciales <span class="text-red-500">*</span></label><input v-model="contactoEditando.iniciales" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Cargo <span class="text-red-500">*</span></label><input v-model="contactoEditando.cargo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Área <span class="text-red-500">*</span></label><input v-model="contactoEditando.area" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Teléfono <span class="text-red-500">*</span></label><input v-model="contactoEditando.telefono" @input="contactoEditando.telefono = contactoEditando.telefono.replace(/\D/g, '')" inputmode="numeric" maxlength="10" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div v-if="errorValidacionDirectorio" class="md:col-span-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle :size="14" class="shrink-0" />{{ errorValidacionDirectorio }}
                  </div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionContacto" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="cancelarEdicionContacto" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div class="flex gap-3 items-center min-w-0">
                    <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">{{ c.iniciales }}</div>
                    <div class="min-w-0">
                      <p class="font-bold text-gray-800 text-sm break-words">{{ c.nombre }}</p>
                      <p class="text-xs text-[#c2a878] font-semibold uppercase">{{ c.cargo }}</p>
                      <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Phone :size="12" />{{ c.telefono }} | {{ c.area }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0 self-end sm:self-auto">
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
                <div v-else class="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-4">
                  <div class="flex gap-3 items-start min-w-0">
                    <div class="bg-[#14392b] text-white rounded-lg px-3 py-2 text-center shrink-0">
                      <p class="text-lg font-bold">{{ diaEvento(e.fecha) }}</p>
                      <p class="text-xs uppercase">{{ mesEvento(e.fecha) }}</p>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-bold text-gray-800 text-sm break-words">{{ e.titulo }}</p>
                        <span class="bg-[#c2a878] text-white text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">{{ e.tipo }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 break-words">{{ e.descripcion }}</p>
                      <div class="flex gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                        <span class="flex items-center gap-1"><MapPin :size="12" />{{ e.lugar }}</span>
                        <span class="flex items-center gap-1"><Clock :size="12" />{{ e.hora }}</span>
                        <span class="flex items-center gap-1"><Users :size="12" />{{ e.dirigido }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0 self-end sm:self-start">
                    <button @click="iniciarEdicionEvento(e)" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarEvento(e)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Proveedores -->
        <div v-if="tabActivo === 'proveedores'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Agregar Proveedor</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div v-if="exitoProveedor" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 :size="16" class="shrink-0" />Proveedor guardado correctamente
            </div>
            <div v-if="errorValidacionProveedor" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertTriangle :size="16" class="shrink-0" />{{ errorValidacionProveedor }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Nombre <span class="text-red-500">*</span></label><input v-model="nuevoProveedor.nombre" type="text" required class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
              <div><label class="text-xs font-semibold text-gray-500 uppercase">Especialidad <span class="text-red-500">*</span></label><input v-model="nuevoProveedor.especialidad" type="text" required placeholder="Ej. Mantenimiento vial" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
            </div>
            <div class="mt-6 text-center"><button @click="agregarProveedor" class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase">Agregar Proveedor</button></div>
          </div>
          <div class="mt-8">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Padrón de Proveedores</h2>
            <p class="text-xs text-gray-400 mb-4">El total y los reportes atendidos se calculan sobre el trimestre calendario actual, a partir de los reportes ya cerrados con costo capturado.</p>
            <div v-if="cargandoProveedores" class="text-center py-6 text-gray-400">Cargando...</div>
            <div v-else class="space-y-3">
              <div v-for="p in proveedores" :key="p.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div v-if="proveedorEditando && proveedorEditando.id === p.id" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Nombre</label><input v-model="proveedorEditando.nombre" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div><label class="text-xs font-semibold text-gray-500 uppercase">Especialidad</label><input v-model="proveedorEditando.especialidad" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" /></div>
                  <div class="md:col-span-2 flex gap-2 mt-2">
                    <button @click="guardarEdicionProveedor" class="bg-[#14392b] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors font-semibold flex items-center gap-1.5"><Save :size="14" />Guardar</button>
                    <button @click="proveedorEditando = null" class="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                  </div>
                </div>
                <div v-else class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div class="flex gap-3 items-center min-w-0">
                    <div class="w-9 h-9 rounded-full bg-[#14392b] text-white flex items-center justify-center font-bold text-sm shrink-0">{{ p.nombre.slice(0,2).toUpperCase() }}</div>
                    <div class="min-w-0">
                      <p class="font-bold text-gray-800 text-sm break-words">{{ p.nombre }}</p>
                      <p class="text-xs text-gray-400 mt-0.5 break-words">{{ p.especialidad || 'Sin especialidad registrada' }} &middot; {{ reportesDeProveedor(p.id).length }} reportes atendidos este trimestre</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 shrink-0 flex-wrap self-end sm:self-auto">
                    <span class="text-sm font-bold text-[#14392b]">{{ formatMonto(totalProveedor(p.id)) }}</span>
                    <button @click="proveedorEditando = { ...p }" class="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold">Editar</button>
                    <button @click="eliminarProveedor(p)" class="bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Transparencia -->
        <div v-if="tabActivo === 'transparencia'">
          <h2 class="text-[#14392b] font-bold text-lg mb-4">Indicadores de Gasto (trimestre actual)</h2>
          <div v-if="cargandoIndicadores" class="text-center py-6 text-gray-400">Calculando...</div>
          <template v-else>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div class="bg-[#14392b] text-white rounded-xl p-5 text-center">
                <p class="text-2xl font-bold text-[#e8dcc4]">{{ formatMonto(indicadores.costoPromedio) }}</p>
                <p class="text-xs uppercase tracking-wide opacity-85 mt-1">Costo promedio / reporte</p>
              </div>
              <div class="bg-[#14392b] text-white rounded-xl p-5 text-center">
                <p class="text-2xl font-bold text-[#e8dcc4]">{{ indicadores.totalResueltos }}</p>
                <p class="text-xs uppercase tracking-wide opacity-85 mt-1">Reportes resueltos</p>
              </div>
              <div class="bg-[#14392b] text-white rounded-xl p-5 text-center">
                <p class="text-2xl font-bold text-[#e8dcc4]">{{ formatMonto(indicadores.gastoTotal) }}</p>
                <p class="text-xs uppercase tracking-wide opacity-85 mt-1">Gasto total ejercido</p>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-sm font-bold text-[#14392b] mb-4">Costo promedio por tipo de reporte</h3>
              <div v-if="indicadores.porTipo.length === 0" class="text-sm text-gray-400">Aún no hay reportes cerrados con costo capturado este trimestre.</div>
              <div v-else class="flex items-end gap-6 h-40 border-b border-gray-200 px-2">
                <div v-for="t in indicadores.porTipo" :key="t.tipo" class="flex-1 flex flex-col items-center justify-end h-full">
                  <span class="text-xs font-bold text-[#14392b] mb-1">{{ formatMonto(t.promedio) }}</span>
                  <div class="w-full rounded-t" :style="{ height: t.alturaPct + '%', background: 'linear-gradient(180deg, #c2a878, #14392b)' }"></div>
                  <span class="text-xs text-gray-500 mt-2 text-center">{{ t.tipo }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import { adminState } from '../stores/adminState.js'
import { confirmar, avisar } from '../composables/useDialogo.js'
import { XCircle, ImageOff, Check, MapPin, Calendar, User, Phone, CheckCircle2, Ban, Save, Clock, Users, Landmark, AlertTriangle, BarChart3 } from 'lucide-vue-next'


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
  { id: 'proveedores', label: 'Proveedores' },
  { id: 'transparencia', label: 'Transparencia' },
]

const cargarTodo = () => {
  cargarReportes()
  cargarAvisos()
  cargarGaleria()
  cargarHorarios()
  cargarDirectorio()
  cargarAgenda()
  cargarProveedores()
  cargarIndicadores()
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
const mostrarEstadisticas = ref(false)

const cargarReportes = async () => {
  cargandoReportes.value = true
  const { data, error } = await supabase.from('reportes').select('*').order('fecha_registro', { ascending: false })
  if (!error) {
    const reportesConUrl = await Promise.all(data.map(async (r) => {
      if (r.foto_url) {
        const { data: signedData } = await supabase.storage
          .from('reportes')
          .createSignedUrl(r.foto_url, 3600)
        // foto_path conserva la ruta real en Storage (necesaria para poder borrar el archivo);
        // foto_url se sobrescribe con la URL firmada, solo sirve para mostrar la imagen.
        return { ...r, foto_path: r.foto_url, foto_url: signedData?.signedUrl || null }
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
  else avisar('No se pudo actualizar el estado del reporte. Intenta de nuevo.')
}

const aprobarReporte = async (reporte) => {
  const { error } = await supabase.from('reportes').update({ moderado: true, estado: 'Pendiente' }).eq('id', reporte.id)
  if (!error) { reporte.moderado = true; reporte.estado = 'Pendiente' }
  else avisar('No se pudo aprobar el reporte. Intenta de nuevo.')
}

const rechazarReporte = async (reporte) => {
  if (await confirmar('¿Estás seguro de rechazar y eliminar este reporte?', { tipo: 'danger', titulo: 'Rechazar reporte', textoConfirmar: 'Rechazar' })) {
    const { error } = await supabase.from('reportes').delete().eq('id', reporte.id)
    if (!error) {
      reportes.value = reportes.value.filter(r => r.id !== reporte.id)
      if (reporte.foto_path) await supabase.storage.from('reportes').remove([reporte.foto_path])
    } else {
      avisar('No se pudo rechazar el reporte. Intenta de nuevo.')
    }
  }
}

const verImagen = (url) => window.open(url, '_blank')

// --- Cierre financiero de reportes (categoría de gasto, monto, proveedor, fecha) ---
const cierreEditando = ref(null)

const iniciarCierreFinanciero = (reporte) => {
  cierreEditando.value = {
    id: reporte.id,
    categoria_gasto: reporte.categoria_gasto || '',
    monto_ejercido: reporte.monto_ejercido ?? null,
    proveedor_id: reporte.proveedor_id || null,
    fecha_cierre: reporte.fecha_cierre || new Date().toISOString().split('T')[0],
  }
}

const guardarCierreFinanciero = async () => {
  const c = cierreEditando.value
  const { error } = await supabase.from('reportes').update({
    categoria_gasto: c.categoria_gasto,
    monto_ejercido: c.monto_ejercido,
    proveedor_id: c.proveedor_id,
    fecha_cierre: c.fecha_cierre,
  }).eq('id', c.id)

  if (!error) {
    const reporte = reportes.value.find(r => r.id === c.id)
    if (reporte) Object.assign(reporte, c)
    cierreEditando.value = null
    cargarIndicadores() // el cierre recién guardado puede cambiar los indicadores del trimestre
  } else {
    avisar('No se pudo guardar el cierre financiero. Intenta de nuevo.')
  }
}

const eliminarCierreFinanciero = async (reporte) => {
  if (!(await confirmar('¿Eliminar el costo de cierre registrado para este reporte? El reporte seguirá Resuelto, solo se borra la información financiera.', { tipo: 'danger', titulo: 'Eliminar cierre financiero', textoConfirmar: 'Eliminar' }))) return

  const vacio = { categoria_gasto: null, monto_ejercido: null, proveedor_id: null, fecha_cierre: null }
  const { error } = await supabase.from('reportes').update(vacio).eq('id', reporte.id)

  if (!error) {
    Object.assign(reporte, vacio)
    cargarIndicadores() // borrar un cierre también puede cambiar los indicadores del trimestre
  } else {
    avisar('No se pudo eliminar el cierre financiero. Intenta de nuevo.')
  }
}

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
  if (!(await confirmar(`¿Cancelar el aviso "${aviso.titulo}" antes de que llegue su fecha de vigencia? Esta acción no se puede revertir desde el panel.`, { titulo: 'Cancelar aviso', textoConfirmar: 'Cancelar aviso' }))) return
  const { error } = await supabase.from('avisos').update({ estado: 'Cancelado' }).eq('id', aviso.id)
  if (error) { avisar('No se pudo cancelar el aviso. Intenta de nuevo.'); return }
  const idx = avisos.value.findIndex(a => a.id === aviso.id)
  if (idx !== -1) avisos.value[idx].estado = 'Cancelado'
  if (avisoEditando.value && avisoEditando.value.id === aviso.id) avisoEditando.value = null
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
    if (uploadError) { avisar('Error al subir la imagen'); return }
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
  } else {
    avisar('No se pudo publicar el aviso. Intenta de nuevo.')
  }
}

const eliminarAviso = async (aviso) => {
  if (!(await confirmar(`¿Eliminar el aviso "${aviso.titulo}"?`, { tipo: 'danger', titulo: 'Eliminar aviso', textoConfirmar: 'Eliminar' }))) return
  const { error } = await supabase.from('avisos').delete().eq('id', aviso.id)
  if (!error) {
    avisos.value = avisos.value.filter(a => a.id !== aviso.id)
    if (aviso.imagen_url) await supabase.storage.from('avisos').remove([nombreDesdeUrl(aviso.imagen_url)])
  } else {
    avisar('No se pudo eliminar el aviso. Intenta de nuevo.')
  }
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
  } else {
    avisar('No se pudo guardar el aviso. Intenta de nuevo.')
  }
}

// --- Galería ---
const galeria = ref([])
const cargandoGaleria = ref(false)
const exitoGaleria = ref(false)
const fotoEditando = ref(null)
const archivoGaleria = ref(null)
const previstaGaleria = ref(null)

const nuevaFoto = ref({ titulo: '', categoria: 'Evento', descripcion: '', fecha: '' })

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
  if (!archivoGaleria.value) { avisar('Selecciona una imagen'); return }
  const archivo = archivoGaleria.value
  const nombre = `${Date.now()}.${archivo.name.split('.').pop()}`
  const { error: uploadError } = await supabase.storage.from('galeria').upload(nombre, archivo)
  if (uploadError) { avisar('Error al subir la imagen'); return }
  const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(nombre)
  const { error } = await supabase.from('galeria').insert([{
    titulo: nuevaFoto.value.titulo, categoria: nuevaFoto.value.categoria,
    descripcion: nuevaFoto.value.descripcion,
    fecha: nuevaFoto.value.fecha, imagen_url: urlData.publicUrl
  }])
  if (!error) {
    exitoGaleria.value = true
    nuevaFoto.value = { titulo: '', categoria: 'Evento', descripcion: '', fecha: '' }
    archivoGaleria.value = null; previstaGaleria.value = null
    cargarGaleria()
    setTimeout(() => exitoGaleria.value = false, 3000)
  } else {
    avisar('No se pudo subir la foto. Intenta de nuevo.')
  }
}

const eliminarFoto = async (foto) => {
  if (!(await confirmar(`¿Eliminar la foto "${foto.titulo}"?`, { tipo: 'danger', titulo: 'Eliminar foto', textoConfirmar: 'Eliminar' }))) return
  const { error } = await supabase.from('galeria').delete().eq('id', foto.id)
  if (!error) {
    galeria.value = galeria.value.filter(f => f.id !== foto.id)
    if (foto.imagen_url) await supabase.storage.from('galeria').remove([nombreDesdeUrl(foto.imagen_url)])
  } else {
    avisar('No se pudo eliminar la foto. Intenta de nuevo.')
  }
}

const iniciarEdicionFoto = (foto) => { fotoEditando.value = { ...foto } }
const cancelarEdicionFoto = () => { fotoEditando.value = null }

const guardarEdicionFoto = async () => {
  const { error } = await supabase.from('galeria').update({
    titulo: fotoEditando.value.titulo, categoria: fotoEditando.value.categoria,
    descripcion: fotoEditando.value.descripcion, fecha: fotoEditando.value.fecha
  }).eq('id', fotoEditando.value.id)
  if (!error) {
    const idx = galeria.value.findIndex(f => f.id === fotoEditando.value.id)
    if (idx !== -1) galeria.value[idx] = { ...fotoEditando.value }
    fotoEditando.value = null
  } else {
    avisar('No se pudo guardar la foto. Intenta de nuevo.')
  }
}

// --- Horarios ---
const horarios = ref([])
const cargandoHorarios = ref(false)
const exitoHorario = ref(false)
const horarioEditando = ref(null)
const errorValidacionHorario = ref('')

const nuevoHorario = ref({ area: '', dias: '', hora_entrada: '', hora_salida: '', observaciones: '' })

const cargarHorarios = async () => {
  cargandoHorarios.value = true
  const { data, error } = await supabase.from('horarios').select('*').order('area', { ascending: true })
  if (!error) horarios.value = data
  cargandoHorarios.value = false
}

const horarioValido = (h) => h.area.trim() && h.dias.trim() && h.hora_entrada.trim() && h.hora_salida.trim()

const agregarHorario = async () => {
  if (!horarioValido(nuevoHorario.value)) {
    errorValidacionHorario.value = 'Por favor llena los campos obligatorios: Área, Días, Hora Entrada y Hora Salida'
    return
  }
  errorValidacionHorario.value = ''

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
  } else {
    avisar('No se pudo guardar el horario. Intenta de nuevo.')
  }
}

const eliminarHorario = async (h) => {
  if (!(await confirmar(`¿Eliminar el horario de "${h.area}"?`, { tipo: 'danger', titulo: 'Eliminar horario', textoConfirmar: 'Eliminar' }))) return
  const { error } = await supabase.from('horarios').delete().eq('id', h.id)
  if (!error) horarios.value = horarios.value.filter(x => x.id !== h.id)
  else avisar('No se pudo eliminar el horario. Intenta de nuevo.')
}

const iniciarEdicionHorario = (h) => { horarioEditando.value = { ...h }; errorValidacionHorario.value = '' }
const cancelarEdicionHorario = () => { horarioEditando.value = null; errorValidacionHorario.value = '' }

const guardarEdicionHorario = async () => {
  if (!horarioValido(horarioEditando.value)) {
    errorValidacionHorario.value = 'Por favor llena los campos obligatorios: Área, Días, Hora Entrada y Hora Salida'
    return
  }
  errorValidacionHorario.value = ''

  const { error } = await supabase.from('horarios').update({
    area: horarioEditando.value.area, dias: horarioEditando.value.dias,
    hora_entrada: horarioEditando.value.hora_entrada, hora_salida: horarioEditando.value.hora_salida,
    observaciones: horarioEditando.value.observaciones
  }).eq('id', horarioEditando.value.id)
  if (!error) {
    const idx = horarios.value.findIndex(h => h.id === horarioEditando.value.id)
    if (idx !== -1) horarios.value[idx] = { ...horarioEditando.value }
    horarioEditando.value = null
  } else {
    avisar('No se pudo guardar el horario. Intenta de nuevo.')
  }
}

// --- Directorio ---
const directorio = ref([])
const cargandoDirectorio = ref(false)
const exitoDirectorio = ref(false)
const contactoEditando = ref(null)
const errorValidacionDirectorio = ref('')

const nuevoContacto = ref({ nombre: '', iniciales: '', cargo: '', area: '', telefono: '' })

const cargarDirectorio = async () => {
  cargandoDirectorio.value = true
  const { data, error } = await supabase.from('directorio').select('*').order('area', { ascending: true })
  if (!error) directorio.value = data
  cargandoDirectorio.value = false
}

const contactoValido = (c) => {
  if (!c.nombre.trim() || !c.iniciales.trim() || !c.cargo.trim() || !c.area.trim() || !c.telefono.trim()) {
    return 'Por favor llena todos los campos obligatorios'
  }
  if (!/^\d+$/.test(c.telefono.trim())) {
    return 'El teléfono solo debe contener números'
  }
  return ''
}

const agregarContacto = async () => {
  const error = contactoValido(nuevoContacto.value)
  if (error) { errorValidacionDirectorio.value = error; return }
  errorValidacionDirectorio.value = ''

  const { error: dbError } = await supabase.from('directorio').insert([{
    nombre: nuevoContacto.value.nombre, iniciales: nuevoContacto.value.iniciales,
    cargo: nuevoContacto.value.cargo, area: nuevoContacto.value.area,
    telefono: nuevoContacto.value.telefono
  }])
  if (!dbError) {
    exitoDirectorio.value = true
    nuevoContacto.value = { nombre: '', iniciales: '', cargo: '', area: '', telefono: '' }
    cargarDirectorio()
    setTimeout(() => exitoDirectorio.value = false, 3000)
  } else {
    avisar('No se pudo guardar el contacto. Intenta de nuevo.')
  }
}

const eliminarContacto = async (c) => {
  if (!(await confirmar(`¿Eliminar el contacto "${c.nombre}"?`, { tipo: 'danger', titulo: 'Eliminar contacto', textoConfirmar: 'Eliminar' }))) return
  const { error } = await supabase.from('directorio').delete().eq('id', c.id)
  if (!error) directorio.value = directorio.value.filter(x => x.id !== c.id)
  else avisar('No se pudo eliminar el contacto. Intenta de nuevo.')
}

const iniciarEdicionContacto = (c) => { contactoEditando.value = { ...c }; errorValidacionDirectorio.value = '' }
const cancelarEdicionContacto = () => { contactoEditando.value = null; errorValidacionDirectorio.value = '' }

const guardarEdicionContacto = async () => {
  const error = contactoValido(contactoEditando.value)
  if (error) { errorValidacionDirectorio.value = error; return }
  errorValidacionDirectorio.value = ''

  const { error: dbError } = await supabase.from('directorio').update({
    nombre: contactoEditando.value.nombre, iniciales: contactoEditando.value.iniciales,
    cargo: contactoEditando.value.cargo, area: contactoEditando.value.area,
    telefono: contactoEditando.value.telefono
  }).eq('id', contactoEditando.value.id)
  if (!dbError) {
    const idx = directorio.value.findIndex(c => c.id === contactoEditando.value.id)
    if (idx !== -1) directorio.value[idx] = { ...contactoEditando.value }
    contactoEditando.value = null
  } else {
    avisar('No se pudo guardar el contacto. Intenta de nuevo.')
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
  } else {
    avisar('No se pudo guardar el evento. Intenta de nuevo.')
  }
}

const eliminarEvento = async (e) => {
  if (!(await confirmar(`¿Eliminar el evento "${e.titulo}"?`, { tipo: 'danger', titulo: 'Eliminar evento', textoConfirmar: 'Eliminar' }))) return
  const { error } = await supabase.from('agenda').delete().eq('id', e.id)
  if (!error) agenda.value = agenda.value.filter(x => x.id !== e.id)
  else avisar('No se pudo eliminar el evento. Intenta de nuevo.')
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
  } else {
    avisar('No se pudo guardar el evento. Intenta de nuevo.')
  }
}

// --- Proveedores (Pantalla 2 del mockup: padrón vinculado a reportes) ---
const proveedores = ref([])
const cargandoProveedores = ref(false)
const exitoProveedor = ref(false)
const errorValidacionProveedor = ref('')
const proveedorEditando = ref(null)
const nuevoProveedor = ref({ nombre: '', especialidad: '' })

const cargarProveedores = async () => {
  cargandoProveedores.value = true
  const { data, error } = await supabase.from('proveedores').select('*').order('nombre', { ascending: true })
  if (!error) proveedores.value = data
  cargandoProveedores.value = false
}

const agregarProveedor = async () => {
  if (!nuevoProveedor.value.nombre.trim() || !nuevoProveedor.value.especialidad.trim()) {
    errorValidacionProveedor.value = 'Por favor llena los campos obligatorios: Nombre y Especialidad'
    return
  }
  errorValidacionProveedor.value = ''

  const { error } = await supabase.from('proveedores').insert([{
    nombre: nuevoProveedor.value.nombre,
    especialidad: nuevoProveedor.value.especialidad,
  }])
  if (!error) {
    exitoProveedor.value = true
    nuevoProveedor.value = { nombre: '', especialidad: '' }
    cargarProveedores()
    setTimeout(() => exitoProveedor.value = false, 3000)
  } else {
    avisar('No se pudo guardar el proveedor. Intenta de nuevo.')
  }
}

const eliminarProveedor = async (p) => {
  if (!(await confirmar(`¿Eliminar al proveedor "${p.nombre}"? Los reportes que ya lo tengan asignado conservarán el registro histórico.`, { tipo: 'danger', titulo: 'Eliminar proveedor', textoConfirmar: 'Eliminar' }))) return
  const { error } = await supabase.from('proveedores').delete().eq('id', p.id)
  if (!error) proveedores.value = proveedores.value.filter(x => x.id !== p.id)
  else avisar('No se pudo eliminar el proveedor. Intenta de nuevo.')
}

const guardarEdicionProveedor = async () => {
  if (!proveedorEditando.value.nombre.trim() || !proveedorEditando.value.especialidad.trim()) {
    errorValidacionProveedor.value = 'Por favor llena los campos obligatorios: Nombre y Especialidad'
    return
  }
  errorValidacionProveedor.value = ''

  const { error } = await supabase.from('proveedores').update({
    nombre: proveedorEditando.value.nombre,
    especialidad: proveedorEditando.value.especialidad,
  }).eq('id', proveedorEditando.value.id)
  if (!error) {
    const idx = proveedores.value.findIndex(p => p.id === proveedorEditando.value.id)
    if (idx !== -1) proveedores.value[idx] = { ...proveedorEditando.value }
    proveedorEditando.value = null
  } else {
    avisar('No se pudo guardar el proveedor. Intenta de nuevo.')
  }
}

// Reportes cerrados con costo, del trimestre calendario actual (usados por
// Proveedores para el resumen por proveedor, y por Transparencia para los KPI)
const reportesDelTrimestre = () => {
  const hoy = new Date()
  const trimestreActual = Math.floor(hoy.getMonth() / 3)
  return reportes.value.filter((r) => {
    if (r.monto_ejercido == null || !r.fecha_cierre) return false
    const f = new Date(r.fecha_cierre)
    return f.getFullYear() === hoy.getFullYear() && Math.floor(f.getMonth() / 3) === trimestreActual
  })
}

const reportesDeProveedor = (proveedorId) => reportesDelTrimestre().filter(r => r.proveedor_id === proveedorId)

const totalProveedor = (proveedorId) => reportesDeProveedor(proveedorId).reduce((sum, r) => sum + Number(r.monto_ejercido || 0), 0)

const nombreProveedor = (proveedorId) => {
  const p = proveedores.value.find(x => x.id === proveedorId)
  return p ? p.nombre : 'Sin especificar'
}

// --- Estadísticas (dashboard operativo de reportes, sobre los datos ya cargados) ---
const mesesLargos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const estadisticas = computed(() => {
  const total = reportes.value.length
  const resueltos = reportes.value.filter(r => r.estado === 'Resuelto')
  const pendientesActivos = total - resueltos.length
  const tasaResolucion = total > 0 ? Math.round((resueltos.length / total) * 100) : 0

  const conCierre = resueltos.filter(r => r.fecha_cierre && r.fecha_registro)
  let tiempoPromedio = null
  if (conCierre.length > 0) {
    const totalDias = conCierre.reduce((sum, r) => {
      const dias = (new Date(r.fecha_cierre) - new Date(r.fecha_registro)) / 86400000
      return sum + Math.max(0, dias)
    }, 0)
    tiempoPromedio = totalDias / conCierre.length
  }

  // Reportes por mes, últimos 6 meses (incluyendo el actual)
  const hoy = new Date()
  const meses = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    meses.push({ anio: d.getFullYear(), mesIdx: d.getMonth(), label: mesesLargos[d.getMonth()], cantidad: 0 })
  }
  reportes.value.forEach(r => {
    if (!r.fecha_registro) return
    const f = new Date(r.fecha_registro)
    const m = meses.find(x => x.anio === f.getFullYear() && x.mesIdx === f.getMonth())
    if (m) m.cantidad++
  })
  const maxMes = Math.max(1, ...meses.map(m => m.cantidad))
  const porMes = meses.map(m => ({ ...m, alturaPct: Math.round((m.cantidad / maxMes) * 100) }))

  // Distribución por estado
  const conteoEstados = {}
  reportes.value.forEach(r => {
    const key = r.estado || 'Sin estado'
    conteoEstados[key] = (conteoEstados[key] || 0) + 1
  })
  const porEstado = Object.entries(conteoEstados)
    .map(([estado, cantidad]) => ({ estado, cantidad, pct: total > 0 ? Math.round((cantidad / total) * 100) : 0 }))
    .sort((a, b) => b.cantidad - a.cantidad)

  // Tipos con más incidencias
  const conteoTipos = {}
  reportes.value.forEach(r => {
    const key = r.tipo || 'Sin especificar'
    conteoTipos[key] = (conteoTipos[key] || 0) + 1
  })
  const porTipo = Object.entries(conteoTipos)
    .map(([tipo, cantidad]) => ({ tipo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)

  return { total, pendientesActivos, tasaResolucion, tiempoPromedio, porMes, porEstado, porTipo }
})

// --- Transparencia (Pantalla 3 del mockup: indicadores del trimestre) ---
const cargandoIndicadores = ref(false)
const indicadores = ref({ costoPromedio: 0, totalResueltos: 0, gastoTotal: 0, porTipo: [] })

const cargarIndicadores = () => {
  cargandoIndicadores.value = true
  const cerrados = reportesDelTrimestre()

  const gastoTotal = cerrados.reduce((sum, r) => sum + Number(r.monto_ejercido || 0), 0)
  const totalResueltos = cerrados.length
  const costoPromedio = totalResueltos > 0 ? gastoTotal / totalResueltos : 0

  const porTipoMap = {}
  cerrados.forEach((r) => {
    if (!porTipoMap[r.tipo]) porTipoMap[r.tipo] = { suma: 0, cantidad: 0 }
    porTipoMap[r.tipo].suma += Number(r.monto_ejercido || 0)
    porTipoMap[r.tipo].cantidad += 1
  })
  const promedios = Object.entries(porTipoMap).map(([tipo, v]) => ({ tipo, promedio: v.suma / v.cantidad }))
  const maxPromedio = Math.max(1, ...promedios.map(p => p.promedio))
  const porTipo = promedios.map(p => ({ ...p, alturaPct: Math.round((p.promedio / maxPromedio) * 100) }))

  indicadores.value = { costoPromedio, totalResueltos, gastoTotal, porTipo }
  cargandoIndicadores.value = false
}

// --- Helpers ---
// avisos/galeria guardan imagen_url como URL pública completa; Storage necesita solo el nombre del archivo para borrarlo.
const nombreDesdeUrl = (url) => url.split('/').pop().split('?')[0]

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

// Lee día/mes directamente del string 'YYYY-MM-DD' para evitar el corrimiento
// de un día que causa new Date(fecha) al convertir de UTC a hora local.
const mesesCortos = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const diaEvento = (fecha) => fecha ? fecha.split('-')[2] : ''
const mesEvento = (fecha) => fecha ? mesesCortos[Number(fecha.split('-')[1]) - 1] : ''

const formatMonto = (valor) => {
  if (valor == null) return '—'
  return Number(valor).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}
</script>