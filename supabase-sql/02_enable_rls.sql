-- JulianFinanzas - Row Level Security (RLS)
-- Ejecutar después del script 01_create_tables.sql

-- Habilitar RLS en todas las tablas
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;

-- Políticas para users_profile
CREATE POLICY "Users can view own profile" ON users_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users_profile
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para investments
CREATE POLICY "Users can view own investments" ON investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments" ON investments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments" ON investments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para assets
CREATE POLICY "Users can view own assets" ON assets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets" ON assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets" ON assets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets" ON assets
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para income_schedule
CREATE POLICY "Users can view own income" ON income_schedule
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own income" ON income_schedule
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own income" ON income_schedule
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own income" ON income_schedule
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para expense_schedule
CREATE POLICY "Users can view own expense schedule" ON expense_schedule
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expense schedule" ON expense_schedule
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expense schedule" ON expense_schedule
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expense schedule" ON expense_schedule
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para expense_records
CREATE POLICY "Users can view own expense records" ON expense_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expense records" ON expense_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expense records" ON expense_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expense records" ON expense_records
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para currencies (pública para todos los usuarios autenticados)
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view currencies" ON currencies
  FOR SELECT TO authenticated USING (true);

-- Solo administradores pueden modificar monedas (opcional, para futuro)
CREATE POLICY "Only admins can modify currencies" ON currencies
  FOR ALL USING (false);
