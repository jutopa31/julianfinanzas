import supabase from '@/services/supabase/client';

export type InvestmentRow = {
  id: string;
  user_id: string;
  name: string;
  invested_amount: number | string;
  current_value: number | string;
  currency_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  return_percentage: number | string;
};

export async function listInvestments(): Promise<InvestmentRow[]> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  const query = supabase
    .from('investments')
    .select('*')
    .order('updated_at', { ascending: false });
  const { data, error } = uid ? await query.eq('user_id', uid) : await query;
  if (error) throw error;
  return (data as InvestmentRow[]) || [];
}

export async function getInvestment(id: string): Promise<InvestmentRow | null> {
  const { data, error } = await supabase.from('investments').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as InvestmentRow) || null;
}

type UpsertInput = {
  name: string;
  invested_amount: number;
  current_value: number;
  currency_id: string;
  notes?: string | null;
};

export async function createInvestment(input: UpsertInput) {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) throw new Error('No authenticated user');
  const payload = { ...input, user_id: uid };
  const { data, error } = await supabase.from('investments').insert(payload).select('*').single();
  if (error) throw error;
  return data as InvestmentRow;
}

export async function updateInvestment(id: string, input: Partial<UpsertInput>) {
  const { data, error } = await supabase.from('investments').update(input).eq('id', id).select('*').single();
  if (error) throw error;
  return data as InvestmentRow;
}

export async function deleteInvestment(id: string) {
  const { error } = await supabase.from('investments').delete().eq('id', id);
  if (error) throw error;
}

export default {
  listInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};

