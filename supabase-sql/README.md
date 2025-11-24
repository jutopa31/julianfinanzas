# Scripts SQL para Supabase

Estos scripts configuran la base de datos completa para JulianFinanzas.

## Orden de Ejecución

Ejecuta los scripts en este orden en el SQL Editor de Supabase:

1. **01_create_tables.sql** - Crea todas las tablas e índices
2. **02_enable_rls.sql** - Habilita Row Level Security y políticas
3. **03_functions_triggers.sql** - Crea funciones y triggers
4. **04_seed_data.sql** - Inserta datos iniciales (monedas)
5. **05_cron_job.sql** - Configura el cron job para gastos

## Pasos en Supabase

### 1. Crear Proyecto
1. Ve a https://supabase.com/dashboard
2. Click "New Project"
3. Nombre: `julianfinanzas`
4. Password: (guarda en lugar seguro)
5. Región: South America - São Paulo
6. Plan: Free

### 2. Ejecutar Scripts SQL
1. Ve a SQL Editor → New query
2. Copia y pega el contenido de cada script
3. Ejecuta en el orden indicado arriba
4. Verifica que no haya errores

### 3. Habilitar pg_cron
1. Ve a Database → Extensions
2. Busca "pg_cron"
3. Click "Enable"
4. Ejecuta el script 05_cron_job.sql

### 4. Obtener Credenciales
1. Ve a Settings → API
2. Copia:
   - Project URL
   - anon/public API key
3. Pégalos en el archivo `.env` del proyecto:
   ```
   EXPO_PUBLIC_SUPABASE_URL=<tu-project-url>
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
   ```

### 5. Generar Types TypeScript (Opcional)
```bash
npm install -g supabase
supabase login
supabase link --project-ref <tu-project-ref>
supabase gen types typescript --linked > src/types/database.types.ts
```

## Estructura de la Base de Datos

### Tablas Principales

1. **currencies** - Monedas soportadas con tasas de cambio
2. **users_profile** - Perfil extendido del usuario
3. **investments** - Inversiones con rendimiento calculado
4. **assets** - Activos físicos y digitales
5. **income_schedule** - Cobros futuros programados
6. **expense_schedule** - Gastos recurrentes
7. **expense_records** - Registros de gastos generados

### Funciones Importantes

- `generate_expense_records()` - Genera registros de gastos según programación
- `update_updated_at_column()` - Actualiza timestamp automáticamente
- `handle_new_user()` - Crea perfil al registrar usuario

### Seguridad

- RLS habilitado en todas las tablas
- Usuarios solo pueden ver/modificar sus propios datos
- Políticas `auth.uid() = user_id` en todas las tablas
- Monedas son de solo lectura para usuarios

## Notas Adicionales

- Las tasas de cambio son aproximadas y deben actualizarse periódicamente
- El cron job ejecuta diariamente a medianoche UTC
- Los gastos con frecuencia "once" se desactivan después de generar
- La columna `return_percentage` en inversiones es calculada automáticamente
