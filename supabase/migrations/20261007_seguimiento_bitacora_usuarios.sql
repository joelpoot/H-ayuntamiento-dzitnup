-- ============================================================================
-- Migración: Seguimiento público de folio, Bitácora de auditoría, Usuarios y Roles
-- Portal Web Municipal de Dzitnup
--
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- No requiere datos previos; es seguro correrlo una sola vez sobre la base
-- de datos actual (usa IF NOT EXISTS / OR REPLACE en todo lo que aplica).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1) SEGUIMIENTO PÚBLICO DE REPORTES POR FOLIO + TELÉFONO
--
-- El folio es el "id" de cada fila de "reportes". En este proyecto esa
-- columna es de tipo uuid (no bigserial como en el documento original), así
-- que la función recibe el folio como texto y lo compara como texto: así
-- nunca truena si alguien escribe un folio con formato inválido, solo no
-- encuentra coincidencia.
-- Esta función corre con privilegios del dueño (SECURITY DEFINER), por lo
-- que puede leer la tabla "reportes" aunque el rol anónimo no tenga permiso
-- de SELECT sobre ella. Solo responde si el teléfono coincide exactamente
-- con el capturado en el reporte, y nunca regresa nombre ni teléfono, para
-- no exponer datos personales a quien solo adivine un folio.
-- ----------------------------------------------------------------------------
drop function if exists public.buscar_reporte_folio(bigint, text);
drop function if exists public.buscar_reporte_folio(text, text);

create or replace function public.buscar_reporte_folio(p_folio text, p_telefono text)
returns table (
  id uuid,
  tipo text,
  descripcion text,
  ubicacion text,
  estado text,
  moderado boolean,
  fecha_registro timestamptz
)
language sql
security definer
set search_path = public
as $$
  select r.id, r.tipo, r.descripcion, r.ubicacion, r.estado, r.moderado, r.fecha_registro
  from reportes r
  where r.id::text = trim(p_folio)
    and r.telefono = p_telefono
$$;

-- Permite que el rol anónimo (visitante público del portal) ejecute la función.
grant execute on function public.buscar_reporte_folio(text, text) to anon, authenticated;


-- ----------------------------------------------------------------------------
-- 2) BITÁCORA DE AUDITORÍA
--
-- Registra cada acción de creación/edición/eliminación hecha desde el panel
-- de administración: quién (correo del usuario autenticado), qué acción,
-- en qué módulo, sobre qué registro y cuándo.
-- ----------------------------------------------------------------------------
create table if not exists public.bitacora (
  id bigserial primary key,
  usuario_correo text not null,
  accion text not null check (accion in ('crear', 'editar', 'eliminar', 'aprobar', 'rechazar', 'cambiar_estado')),
  modulo text not null,
  registro_id text,
  detalle text,
  fecha timestamptz not null default now()
);

create index if not exists bitacora_fecha_idx on public.bitacora (fecha desc);
create index if not exists bitacora_modulo_idx on public.bitacora (modulo);

alter table public.bitacora enable row level security;

drop policy if exists "bitacora_select_authenticated" on public.bitacora;
create policy "bitacora_select_authenticated"
  on public.bitacora for select
  to authenticated
  using (is_admin());

drop policy if exists "bitacora_insert_authenticated" on public.bitacora;
create policy "bitacora_insert_authenticated"
  on public.bitacora for insert
  to authenticated
  with check (is_admin());

-- Sin política de UPDATE/DELETE: la bitácora es de solo lectura una vez escrita,
-- ni siquiera el panel admin puede editarla o borrarla (garantiza trazabilidad).


-- ----------------------------------------------------------------------------
-- 3) USUARIOS Y ROLES (operadores del panel administrativo)
--
-- Tabla de metadatos de cada cuenta de operador/administrador: rol, área y
-- estado (activo/inactivo). La cuenta de autenticación real (correo +
-- contraseña) la crea Supabase Auth cuando el administrador da de alta al
-- operador desde el panel; esta tabla solo guarda el perfil asociado.
-- ----------------------------------------------------------------------------
create table if not exists public.usuarios (
  id bigserial primary key,
  auth_user_id uuid unique,
  nombre text not null,
  correo text not null unique,
  rol text not null default 'Operador' check (rol in ('Administrador', 'Operador')),
  area text,
  estado boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists usuarios_correo_idx on public.usuarios (correo);

alter table public.usuarios enable row level security;

drop policy if exists "usuarios_select_authenticated" on public.usuarios;
create policy "usuarios_select_authenticated"
  on public.usuarios for select
  to authenticated
  using (is_admin());

drop policy if exists "usuarios_insert_authenticated" on public.usuarios;
create policy "usuarios_insert_authenticated"
  on public.usuarios for insert
  to authenticated
  with check (is_admin());

drop policy if exists "usuarios_update_authenticated" on public.usuarios;
create policy "usuarios_update_authenticated"
  on public.usuarios for update
  to authenticated
  using (is_admin())
  with check (is_admin());

drop policy if exists "usuarios_delete_authenticated" on public.usuarios;
create policy "usuarios_delete_authenticated"
  on public.usuarios for delete
  to authenticated
  using (is_admin());

-- ----------------------------------------------------------------------------
-- 4) REEMPLAZO DE "reportes_publicos" (vista) POR UNA FUNCIÓN RPC
--
-- El Security Advisor de Supabase marca como CRÍTICA cualquier vista que
-- corra con permisos del dueño ("Security Definer View"), sin poder saber
-- que esta vista ya filtra correctamente (solo columnas no sensibles, solo
-- moderado = true). No hay botón para "reconocer" el hallazgo en el
-- dashboard actual, así que en vez de dejarlo en la lista para siempre, se
-- reemplaza la vista por una función (mismo filtrado, mismas columnas) —
-- el Advisor sí reconoce ese patrón como intencional y deja de marcarlo
-- como error.
-- ----------------------------------------------------------------------------
create or replace function public.listar_reportes_publicos()
returns table (
  id uuid,
  tipo text,
  descripcion text,
  ubicacion text,
  latitud numeric,
  longitud numeric,
  estado text,
  fecha_registro timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, tipo, descripcion, ubicacion, latitud, longitud, estado, fecha_registro
  from reportes
  where moderado = true
$$;

grant execute on function public.listar_reportes_publicos() to anon, authenticated;

-- Una vez que confirmes que el mapa público (/mapa) sigue mostrando los
-- reportes correctamente usando la función de arriba, puedes borrar la
-- vista vieja para que el hallazgo desaparezca del Advisor:
-- drop view if exists public.reportes_publicos;


-- ----------------------------------------------------------------------------
-- 5) ALTA/BAJA REAL EN "admins" PARA OPERADORES CREADOS DESDE EL PANEL
--
-- El acceso de escritura real en todo el sistema (reportes, avisos, etc.) lo
-- controla la función ya existente public.is_admin(), que revisa si el uid
-- del usuario autenticado está en la tabla "admins". Esa tabla tiene RLS
-- habilitado SIN políticas, es decir, nadie puede leerla/escribirla desde el
-- cliente (ni siquiera un admin autenticado) — solo is_admin() puede verla,
-- porque corre con privilegios elevados (SECURITY DEFINER).
--
-- Por eso, para que un operador dado de alta desde "Usuarios y Roles"
-- realmente pueda usar el panel (y no solo iniciar sesión sin poder hacer
-- nada), su auth_user_id debe agregarse también a "admins". Estas dos
-- funciones hacen esa alta/baja de forma segura: siguen el mismo patrón que
-- is_admin() (SECURITY DEFINER) pero además verifican que quien las ejecuta
-- YA sea admin, así que un usuario sin privilegios no puede auto-otorgarse
-- acceso llamándolas directamente.
-- ----------------------------------------------------------------------------
create or replace function public.alta_operador_admin(p_auth_user_id uuid, p_correo text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'No autorizado';
  end if;

  if not exists (select 1 from admins where id = p_auth_user_id) then
    insert into admins (id, email) values (p_auth_user_id, p_correo);
  end if;
end;
$$;

grant execute on function public.alta_operador_admin(uuid, text) to authenticated;

create or replace function public.baja_operador_admin(p_auth_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'No autorizado';
  end if;

  delete from admins where id = p_auth_user_id;
end;
$$;

grant execute on function public.baja_operador_admin(uuid) to authenticated;


-- NOTA DE SEGURIDAD / LIMITACIÓN CONOCIDA:
-- Dar de baja a un operador (desactivar o eliminar su perfil) le revoca el
-- acceso de escritura real (se le quita de "admins"), pero su cuenta de
-- inicio de sesión en Supabase Auth sigue existiendo: podrá autenticarse,
-- solo que sin permisos para escribir nada. Borrar la cuenta de
-- autenticación por completo requiere la Service Role Key desde el
-- dashboard de Supabase (Authentication > Users), ya que esa operación no
-- puede hacerse de forma segura desde el navegador con la llave pública
-- (anon/publishable).
