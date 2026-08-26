-- ==============================================================================
-- PROGRAMACIÓN CRON AUTOMATIZADA: TIPO DE CAMBIO 6:00 AM
-- Ejecutar en el SQL Editor de Supabase (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Habilitar extensiones requeridas para tareas programadas y llamadas HTTP
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Programar la tarea diaria a las 6:00 AM (Hora de Costa Rica: UTC-6 -> 12:00 PM UTC)
-- Esto invoca la Edge Function `sync-exchange-rate` de forma desatendida
SELECT cron.schedule(
    'sync-cr-exchange-rate-daily-6am',
    '0 12 * * *', -- 12:00 UTC = 6:00 AM Costa Rica
    $$
    SELECT net.http_post(
        url := 'https://dxqezvkguswleoisxikz.supabase.co/functions/v1/sync-exchange-rate',
        headers := jsonb_build_object(
            'Content-Type', 'application/json'
        ),
        body := '{}'::jsonb
    );
    $$
);

-- Para verificar los cron jobs activos en Supabase:
-- SELECT * FROM cron.job;

-- Para ver el historial de ejecuciones:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
