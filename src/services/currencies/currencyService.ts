import { supabase } from '../supabase/client';
import { Currency } from '../../types/app.types';

export const currencyService = {
  /**
   * Obtener todas las monedas disponibles
   */
  async getAllCurrencies(): Promise<{ data: Currency[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('code', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener las monedas' };
    }
  },

  /**
   * Obtener una moneda por ID
   */
  async getCurrencyById(id: string): Promise<{ data: Currency | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener la moneda' };
    }
  },

  /**
   * Obtener moneda por código (USD, ARS, etc.)
   */
  async getCurrencyByCode(code: string): Promise<{ data: Currency | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al obtener la moneda' };
    }
  },

  /**
   * Actualizar tasa de cambio de una moneda
   */
  async updateCurrencyRate(
    id: string,
    rate_to_usd: number
  ): Promise<{ data: Currency | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .update({ rate_to_usd })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Error al actualizar la tasa de cambio' };
    }
  },
};
