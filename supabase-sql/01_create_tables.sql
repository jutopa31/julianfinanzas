-- JulianFinanzas - Creación de Tablas
-- Ejecutar este script primero en Supabase SQL Editor

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Monedas
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(3) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  rate_to_usd DECIMAL(20, 10) DEFAULT 1.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Perfil de Usuario
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_currency_id UUID REFERENCES currencies(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inversiones
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  invested_amount DECIMAL(15, 2) NOT NULL CHECK (invested_amount > 0),
  current_value DECIMAL(15, 2) NOT NULL CHECK (current_value >= 0),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Columna calculada: rendimiento porcentual
  return_percentage DECIMAL(10, 2) GENERATED ALWAYS AS (
    CASE
      WHEN invested_amount > 0 THEN ((current_value - invested_amount) / invested_amount) * 100
      ELSE 0
    END
  ) STORED
);

-- 4. Activos
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(50),
  current_value DECIMAL(15, 2) NOT NULL CHECK (current_value >= 0),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Cobros Futuros
CREATE TABLE income_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  expected_date DATE NOT NULL,
  is_received BOOLEAN DEFAULT FALSE,
  received_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gastos Programados
CREATE TABLE expense_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('once', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  next_due_date DATE NOT NULL,
  last_generated_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Registros de Gastos
CREATE TABLE expense_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_schedule_id UUID REFERENCES expense_schedule(id) ON DELETE CASCADE,
  concept VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  due_date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_assets_user ON assets(user_id);
CREATE INDEX idx_income_user_date ON income_schedule(user_id, expected_date);
CREATE INDEX idx_expense_schedule_user ON expense_schedule(user_id);
CREATE INDEX idx_expense_schedule_next_date ON expense_schedule(next_due_date) WHERE is_active = TRUE;
CREATE INDEX idx_expense_records_user_date ON expense_records(user_id, due_date);
CREATE INDEX idx_expense_records_schedule ON expense_records(expense_schedule_id);

-- Comentarios en las tablas
COMMENT ON TABLE currencies IS 'Monedas soportadas con tasas de cambio a USD';
COMMENT ON TABLE users_profile IS 'Perfil extendido del usuario con configuración personal';
COMMENT ON TABLE investments IS 'Inversiones del usuario con rendimiento calculado';
COMMENT ON TABLE assets IS 'Activos físicos y digitales del usuario';
COMMENT ON TABLE income_schedule IS 'Cobros futuros programados';
COMMENT ON TABLE expense_schedule IS 'Gastos recurrentes programados';
COMMENT ON TABLE expense_records IS 'Registros de gastos generados automáticamente';
