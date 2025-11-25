import supabase from '@/services/supabase/client';

export type ExpenseScheduleRow = {
  id: string;
  user_id: string;
  concept: string;
  amount: number | string;
  currency_id: string;
  frequency: 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  next_due_date: string; // ISO date
  last_generated_date: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ExpenseRecordRow = {
  id: string;
  user_id: string;
  expense_schedule_id: string | null;
  concept: string;
  amount: number | string;
  currency_id: string;
  due_date: string; // ISO date
  is_paid: boolean;
  paid_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// Schedules
export async function listExpenseSchedules(): Promise<ExpenseScheduleRow[]> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  const query = supabase
    .from('expense_schedule')
    .select('*')
    .order('is_active', { ascending: false })
    .order('next_due_date', { ascending: true });
  const { data, error } = uid ? await query.eq('user_id', uid) : await query;
  if (error) throw error;
  return (data as ExpenseScheduleRow[]) || [];
}

export async function getExpenseSchedule(id: string): Promise<ExpenseScheduleRow | null> {
  const { data, error } = await supabase.from('expense_schedule').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ExpenseScheduleRow) || null;
}

type ScheduleUpsert = {
  concept: string;
  amount: number;
  currency_id: string;
  frequency: ExpenseScheduleRow['frequency'];
  next_due_date: string; // YYYY-MM-DD
  is_active?: boolean;
  notes?: string | null;
};

export async function createExpenseSchedule(input: ScheduleUpsert) {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) throw new Error('No authenticated user');
  const payload = { ...input, user_id: uid };
  const { data, error } = await supabase.from('expense_schedule').insert(payload).select('*').single();
  if (error) throw error;
  return data as ExpenseScheduleRow;
}

export async function updateExpenseSchedule(id: string, input: Partial<ScheduleUpsert>) {
  const { data, error } = await supabase
    .from('expense_schedule')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as ExpenseScheduleRow;
}

export async function deleteExpenseSchedule(id: string) {
  const { error } = await supabase.from('expense_schedule').delete().eq('id', id);
  if (error) throw error;
}

// Records
export async function listExpenseRecords(paid?: boolean): Promise<ExpenseRecordRow[]> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  let query = supabase
    .from('expense_records')
    .select('*')
    .order('is_paid', { ascending: true })
    .order('due_date', { ascending: true });
  if (uid) query = query.eq('user_id', uid);
  if (typeof paid === 'boolean') query = query.eq('is_paid', paid);
  const { data, error } = await query;
  if (error) throw error;
  return (data as ExpenseRecordRow[]) || [];
}

export async function markExpenseRecordPaid(id: string, date?: string) {
  const paidDate = date || new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('expense_records')
    .update({ is_paid: true, paid_date: paidDate })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as ExpenseRecordRow;
}

export async function deleteExpenseRecord(id: string) {
  const { error } = await supabase.from('expense_records').delete().eq('id', id);
  if (error) throw error;
}

export default {
  listExpenseSchedules,
  getExpenseSchedule,
  createExpenseSchedule,
  updateExpenseSchedule,
  deleteExpenseSchedule,
  listExpenseRecords,
  markExpenseRecordPaid,
  deleteExpenseRecord,
};

