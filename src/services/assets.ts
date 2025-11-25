import supabase from '@/services/supabase/client';

export type AssetRow = {
  id: string;
  user_id: string;
  name: string;
  asset_type: string | null;
  current_value: number | string;
  currency_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export async function listAssets(): Promise<AssetRow[]> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  const query = supabase.from('assets').select('*').order('updated_at', { ascending: false });
  const { data, error } = uid ? await query.eq('user_id', uid) : await query;
  if (error) throw error;
  return (data as AssetRow[]) || [];
}

export async function getAsset(id: string): Promise<AssetRow | null> {
  const { data, error } = await supabase.from('assets').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as AssetRow) || null;
}

type UpsertInput = {
  name: string;
  asset_type?: string | null;
  current_value: number;
  currency_id: string;
  description?: string | null;
};

export async function createAsset(input: UpsertInput) {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) throw new Error('No authenticated user');
  const payload = { ...input, user_id: uid };
  const { data, error } = await supabase.from('assets').insert(payload).select('*').single();
  if (error) throw error;
  return data as AssetRow;
}

export async function updateAsset(id: string, input: Partial<UpsertInput>) {
  const { data, error } = await supabase.from('assets').update(input).eq('id', id).select('*').single();
  if (error) throw error;
  return data as AssetRow;
}

export async function deleteAsset(id: string) {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
}

export default {
  listAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
};

