# JulianFinanzas

App personal de gestión financiera con soporte móvil y desktop. Trackea inversiones, activos, cobros futuros y gastos programados con soporte multi-moneda.

## Stack Tecnológico

- **Frontend**: React Native con Expo (iOS, Android, Web)
- **Backend**: Supabase (PostgreSQL, Auth)
- **UI**: React Native Paper (Material Design)
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod

## Features

### MVP Fase 1 (Actual)
- ✅ Inversiones (tracking con rendimiento)
- ✅ Activos (inventario de bienes)
- ✅ Cobros futuros (ingresos programados)
- ✅ Gastos programados (recurrentes con auto-generación)
- ✅ Dashboard de cashflow con balance actual
- ✅ Multi-moneda con conversión automática

### Fase 2 (Futura)
- [ ] Gráficos y reportes visuales avanzados
- [ ] Notificaciones push
- [ ] Exportación CSV/Excel
- [ ] Categorías personalizables avanzadas

## Setup del Proyecto

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### Crear Proyecto en Supabase
1. Ve a https://supabase.com/dashboard
2. Click "New Project"
3. Nombre: `julianfinanzas`
4. Password: (guarda en lugar seguro)
5. Región: South America - São Paulo
6. Plan: Free

#### Ejecutar Scripts SQL
Ve a la carpeta `supabase-sql/` y ejecuta los scripts en orden:

1. `01_create_tables.sql` - Crea tablas e índices
2. `02_enable_rls.sql` - Habilita Row Level Security
3. `03_functions_triggers.sql` - Crea funciones y triggers
4. `04_seed_data.sql` - Inserta monedas iniciales
5. `05_cron_job.sql` - Configura cron job (después de habilitar pg_cron en Extensions)

Consulta `supabase-sql/README.md` para instrucciones detalladas.

#### Configurar Variables de Entorno
1. Copia las credenciales desde Supabase (Settings → API)
2. Edita el archivo `.env` en la raíz:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 3. Iniciar la App

```bash
# Desarrollo con Expo Go
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Estructura del Proyecto

```
julianfinanzas/
├── src/
│   ├── types/              # TypeScript types
│   ├── services/           # Supabase services
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── utils/              # Utilidades
│   ├── navigation/         # React Navigation
│   ├── screens/            # Pantallas de la app
│   └── components/         # Componentes reutilizables
├── supabase-sql/          # Scripts SQL para Supabase
├── assets/                 # Imágenes e iconos
├── .env                    # Variables de entorno (no en git)
└── App.tsx                 # Entry point
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm start

# Limpiar cache de Expo
npx expo start -c

# Generar types de Supabase (opcional)
npm install -g supabase
supabase login
supabase link --project-ref <tu-project-ref>
supabase gen types typescript --linked > src/types/database.types.ts
```

## Flujo de Desarrollo

### Implementación por Fases

El proyecto sigue un plan de implementación secuencial (consulta el plan completo en `.claude/plans/`):

1. **FASE 0**: Setup Inicial ✅
2. **FASE 1**: Autenticación (próxima)
3. **FASE 2**: Configuración de Monedas
4. **FASE 3**: Inversiones
5. **FASE 4**: Activos
6. **FASE 5**: Cobros Futuros
7. **FASE 6**: Gastos Programados
8. **FASE 7**: Dashboard y Cashflow
9. **FASE 8**: Navegación Principal
10. **FASE 9**: Testing y Pulido

### Próximos Pasos

1. Configurar Supabase (si no lo has hecho)
2. Llenar el archivo `.env` con tus credenciales
3. Ejecutar `npm start` para ver la app
4. Continuar con FASE 1: Autenticación

## Base de Datos

### Tablas Principales

- `currencies` - Monedas con tasas de cambio
- `users_profile` - Perfil del usuario
- `investments` - Inversiones con rendimiento
- `assets` - Activos físicos/digitales
- `income_schedule` - Cobros programados
- `expense_schedule` - Gastos recurrentes
- `expense_records` - Registros de gastos generados

### Características

- **Row Level Security (RLS)** habilitado
- **Auto-generación de gastos** vía cron job diario
- **Conversión multi-moneda** con USD como base
- **Triggers** para `updated_at` automático
- **Columna calculada** para `return_percentage` en inversiones

## Seguridad

- RLS habilitado en todas las tablas
- Usuarios solo ven sus propios datos
- Políticas `auth.uid() = user_id`
- No exponer `service_role` key, solo `anon` key

## Contribuir

Este es un proyecto personal. Si encuentras bugs o tienes sugerencias, crea un issue.

## Licencia

Privado - Uso personal

---

Desarrollado con [Claude Code](https://claude.com/claude-code)
