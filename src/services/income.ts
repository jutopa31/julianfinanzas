import supabase from '@/services/supabase/client';

export type IncomeRow = {
  id: string;
  user_id: string;
  concept: string;
  amount: number | string;
  currency_id: string;
  expected_date: string; // ISO date
  is_received: boolean;
  received_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function listIncome(): Promise<IncomeRow[]> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  const query = supabase
    .from('income_schedule')
    .select('*')
    .order('is_received', { ascending: true })
    .order('expected_date', { ascending: true });
  const { data, error } = uid ? await query.eq('user_id', uid) : await query;
  if (error) throw error;
  return (data as IncomeRow[]) || [];
}

export async function getIncome(id: string): Promise<IncomeRow | null> {
  const { data, error } = await supabase.from('income_schedule').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as IncomeRow) || null;
}

type UpsertInput = {
  concept: string;
  amount: number;
  currency_id: string;
  expected_date: string; // YYYY-MM-DD
  notes?: string | null;
};

export async function createIncome(input: UpsertInput) {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) throw new Error('No authenticated user');
  const payload = { ...input, user_id: uid };
  const { data, error } = await supabase.from('income_schedule').insert(payload).select('*').single();
  if (error) throw error;
  return data as IncomeRow;
}

export async function updateIncome(id: string, input: Partial<UpsertInput>) {
  const { data, error } = await supabase.from('income_schedule').update(input).eq('id', id).select('*').single();
  if (error) throw error;
  return data as IncomeRow;
}

export async function deleteIncome(id: string) {
  const { error } = await supabase.from('income_schedule').delete().eq('id', id);
  if (error) throw error;
}

export async function markIncomeReceived(id: string, receivedDate?: string) {
  const date = receivedDate || new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('income_schedule')
    .update({ is_received: true, received_date: date })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as IncomeRow;
}

export default {
  listIncome,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  markIncomeReceived,
};

