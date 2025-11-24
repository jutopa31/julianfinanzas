import { supabase } from '../supabase/client';
import { UserProfile } from '../../types/app.types';

export const profileService = {
  /**
   * Obtener o crear perfil del usuario
   */
  async getOrCreateProfile(userId: string): Promise<{ data: UserProfile | null; error: string | null }> {
    try {
      // Intentar obtener el perfil
      let { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', userId)
        .single();

      // Si no existe, crear uno nuevo
      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('users_profile')
          .insert({ id: userId })
          .select()
          .single();

        if (createError) {
          return { data: null, error: createError.message };
        }

        return { data: newProfile, error: null };
      }

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener el perfil' };
    }
  },

  /**
   * Actualizar moneda por defecto del usuario
   */
  async updateDefaultCurrency(
    userId: string,
    currencyId: string
  ): Promise<{ data: UserProfile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .update({ default_currency_id: currencyId })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al actualizar la moneda por defecto' };
    }
  },

  /**
   * Obtener perfil con moneda incluida
   */
  async getProfileWithCurrency(
    userId: string
  ): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select(`
          *,
          currency:currencies(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener el perfil' };
    }
  },
};
