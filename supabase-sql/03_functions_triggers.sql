-- JulianFinanzas - Funciones y Triggers
-- Ejecutar después del script 02_enable_rls.sql

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_profile_updated_at
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_income_schedule_updated_at
  BEFORE UPDATE ON income_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_schedule_updated_at
  BEFORE UPDATE ON expense_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_records_updated_at
  BEFORE UPDATE ON expense_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_currencies_updated_at
  BEFORE UPDATE ON currencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para auto-generar registros de gastos
CREATE OR REPLACE FUNCTION generate_expense_records()
RETURNS void AS $$
DECLARE
  schedule_record RECORD;
  new_due_date DATE;
BEGIN
  -- Recorrer todos los gastos programados activos que necesitan generar registros
  FOR schedule_record IN
    SELECT * FROM expense_schedule
    WHERE is_active = TRUE
    AND (last_generated_date IS NULL OR next_due_date > last_generated_date)
    AND next_due_date <= CURRENT_DATE + INTERVAL '30 days'
  LOOP
    -- Generar registro solo si no existe ya para esta fecha
    IF NOT EXISTS (
      SELECT 1 FROM expense_records
      WHERE expense_schedule_id = schedule_record.id
      AND due_date = schedule_record.next_due_date
    ) THEN
      -- Insertar nuevo registro de gasto
      INSERT INTO expense_records (
        user_id,
        expense_schedule_id,
        concept,
        amount,
        currency_id,
        due_date,
        notes
      ) VALUES (
        schedule_record.user_id,
        schedule_record.id,
        schedule_record.concept,
        schedule_record.amount,
        schedule_record.currency_id,
        schedule_record.next_due_date,
        schedule_record.notes
      );

      -- Calcular la próxima fecha según la frecuencia
      new_due_date := CASE schedule_record.frequency
        WHEN 'daily' THEN schedule_record.next_due_date + INTERVAL '1 day'
        WHEN 'weekly' THEN schedule_record.next_due_date + INTERVAL '1 week'
        WHEN 'biweekly' THEN schedule_record.next_due_date + INTERVAL '2 weeks'
        WHEN 'monthly' THEN schedule_record.next_due_date + INTERVAL '1 month'
        WHEN 'quarterly' THEN schedule_record.next_due_date + INTERVAL '3 months'
        WHEN 'yearly' THEN schedule_record.next_due_date + INTERVAL '1 year'
        WHEN 'once' THEN schedule_record.next_due_date
      END;

      -- Actualizar el gasto programado
      UPDATE expense_schedule SET
        next_due_date = new_due_date,
        last_generated_date = CURRENT_DATE,
        is_active = CASE WHEN schedule_record.frequency = 'once' THEN FALSE ELSE TRUE END
      WHERE id = schedule_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear perfil de usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_profile (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION generate_expense_records() IS 'Genera registros de gastos para los próximos 30 días basado en la programación';
COMMENT ON FUNCTION handle_new_user() IS 'Crea automáticamente un perfil de usuario cuando se registra';
