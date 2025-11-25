import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { listExpenseRecords, markExpenseRecordPaid, deleteExpenseRecord, type ExpenseRecordRow } from '@/services/expenses';
import { useSettingsStore } from '@/store/settings.store';
import { convertAmount, findCurrency, formatCurrency } from '@/utils/currency';

export default function ExpenseRecordsScreen() {
  const [items, setItems] = useState<ExpenseRecordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currencies, selectedCurrencyCode } = useSettingsStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExpenseRecords();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar registros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onMarkPaid = async (id: string) => {
    try {
      await markExpenseRecordPaid(id);
      load();
    } catch (e: any) {
      setError(e?.message || 'No se pudo marcar como pagado');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteExpenseRecord(id);
      load();
    } catch (e: any) {
      setError(e?.message || 'No se pudo eliminar');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {error ? <Text style={{ color: 'red', margin: 12 }}>{error}</Text> : null}
      <List.Section>
        <List.Subheader>Registros generados</List.Subheader>
      </List.Section>
      <List.Section>
        {items.map((it) => {
          const amount = Number(it.amount);
          const curr = currencies.find((c) => c.id === it.currency_id);
          const selected = findCurrency(currencies, selectedCurrencyCode);
          const converted = curr && selected ? convertAmount(amount, curr, selected) : null;
          return (
            <List.Item
              key={it.id}
              title={`${it.concept} • ${it.due_date}`}
              description={
                curr
                  ? `${it.is_paid ? 'Pagado' : 'Pendiente'} • ${formatCurrency(amount, curr.code)}${
                      converted ? ` • ≈ ${formatCurrency(converted, selectedCurrencyCode)}` : ''
                    }`
                  : `${it.is_paid ? 'Pagado' : 'Pendiente'} • ${amount}`
              }
              right={() => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {!it.is_paid ? (
                    <Button compact onPress={() => onMarkPaid(it.id)}>
                      Pagar
                    </Button>
                  ) : null}
                  <Button compact onPress={() => onDelete(it.id)}>
                    Borrar
                  </Button>
                </View>
              )}
            />
          );
        })}
      </List.Section>
    </View>
  );
}

