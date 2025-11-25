import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { FAB, List, Text, Button } from 'react-native-paper';
import { listExpenseSchedules, type ExpenseScheduleRow } from '@/services/expenses';
import { useSettingsStore } from '@/store/settings.store';
import { convertAmount, findCurrency, formatCurrency } from '@/utils/currency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ExpensesStackParamList } from '@/navigation/ExpensesStack';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpensesList'>;

export default function ExpensesListScreen({ navigation }: Props) {
  const [items, setItems] = useState<ExpenseScheduleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currencies, selectedCurrencyCode } = useSettingsStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExpenseSchedules();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar gastos programados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1 }}>
      {error ? <Text style={{ color: 'red', margin: 12 }}>{error}</Text> : null}

      <List.Section>
        <List.Subheader>Gastos programados</List.Subheader>
        <Button onPress={() => navigation.navigate('ExpenseRecords')}>Ver registros generados</Button>
      </List.Section>

      <List.Section style={{ flex: 1 }}>
        {items.map((it) => {
          const amount = Number(it.amount);
          const curr = currencies.find((c) => c.id === it.currency_id);
          const selected = findCurrency(currencies, selectedCurrencyCode);
          const converted = curr && selected ? convertAmount(amount, curr, selected) : null;
          const status = it.is_active ? `Próx: ${it.next_due_date}` : 'Inactivo';
          return (
            <List.Item
              key={it.id}
              title={it.concept}
              description={
                curr
                  ? `${it.frequency} • ${status} • ${formatCurrency(amount, curr.code)}${
                      converted ? ` • ≈ ${formatCurrency(converted, selectedCurrencyCode)}` : ''
                    }`
                  : `${it.frequency} • ${status} • ${amount}`
              }
              onPress={() => navigation.navigate('ExpenseForm', { id: it.id })}
            />
          );
        })}
      </List.Section>

      <FAB style={{ position: 'absolute', right: 16, bottom: 16 }} icon="plus" onPress={() => navigation.navigate('ExpenseForm')} />
    </View>
  );
}

