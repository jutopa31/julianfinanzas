-- JulianFinanzas - Cron Job Configuration
-- Ejecutar después del script 04_seed_data.sql

-- IMPORTANTE: Primero habilita la extensión pg_cron en Supabase:
-- 1. Ve a Database → Extensions
-- 2. Busca "pg_cron"
-- 3. Click en "Enable"

-- Configurar cron job para generar registros de gastos diariamente a medianoche UTC
SELECT cron.schedule(
  'generate-expense-records-daily',
  '0 0 * * *',  -- Ejecutar diariamente a las 00:00 UTC
  $$SELECT generate_expense_records()$$
);

-- Verificar que el cron job fue creado correctamente
SELECT * FROM cron.job;

-- Para desactivar el cron job (si es necesario):
-- SELECT cron.unschedule('generate-expense-records-daily');

-- Para ejecutar manualmente la función en cualquier momento:
-- SELECT generate_expense_records();

COMMENT ON EXTENSION pg_cron IS 'Permite programar tareas recurrentes en PostgreSQL';
