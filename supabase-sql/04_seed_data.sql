-- JulianFinanzas - Seed Data
-- Ejecutar después del script 03_functions_triggers.sql

-- Insertar monedas iniciales con tasas aproximadas (actualizar según necesidad)
INSERT INTO currencies (code, symbol, name, rate_to_usd) VALUES
  ('USD', '$', 'US Dollar', 1.0),
  ('EUR', '€', 'Euro', 1.09),
  ('GBP', '£', 'British Pound', 1.27),
  ('JPY', '¥', 'Japanese Yen', 0.0067),
  ('CAD', '$', 'Canadian Dollar', 0.73),
  ('AUD', '$', 'Australian Dollar', 0.65),
  ('CHF', 'CHF', 'Swiss Franc', 1.13),
  ('CNY', '¥', 'Chinese Yuan', 0.14),
  ('ARS', '$', 'Peso Argentino', 0.001),
  ('BRL', 'R$', 'Brazilian Real', 0.20),
  ('CLP', '$', 'Peso Chileno', 0.0011),
  ('COP', '$', 'Peso Colombiano', 0.00025),
  ('MXN', '$', 'Peso Mexicano', 0.059),
  ('PEN', 'S/', 'Sol Peruano', 0.27),
  ('UYU', '$', 'Peso Uruguayo', 0.025);

-- Verificar datos insertados
SELECT code, name, symbol, rate_to_usd FROM currencies ORDER BY code;

-- Nota: Las tasas de cambio son aproximadas y deben actualizarse periódicamente
-- En producción, considera integrar una API de tasas de cambio en tiempo real
