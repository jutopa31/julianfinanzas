import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { FAB, List, Text } from 'react-native-paper';
import { listIncome, type IncomeRow } from '@/services/income';
import { useSettingsStore } from '@/store/settings.store';
import { convertAmount, findCurrency, formatCurrency } from '@/utils/currency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { IncomeStackParamList } from '@/navigation/IncomeStack';

type Props = NativeStackScreenProps<IncomeStackParamList, 'IncomeList'>;

export default function IncomeListScreen({ navigation }: Props) {
  const [items, setItems] = useState<IncomeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currencies, selectedCurrencyCode } = useSettingsStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listIncome();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar cobros');
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
        <List.Subheader>Próximos cobros</List.Subheader>
      </List.Section>

      <List.Section style={{ flex: 1 }}>
        {items.map((it) => {
          const amount = Number(it.amount);
          const curr = currencies.find((c) => c.id === it.currency_id);
          const selected = findCurrency(currencies, selectedCurrencyCode);
          const converted = curr && selected ? convertAmount(amount, curr, selected) : null;
          const status = it.is_received ? `Recibido ${it.received_date ?? ''}` : `Vence ${it.expected_date}`;
          return (
            <List.Item
              key={it.id}
              title={it.concept}
              description={
                curr
                  ? `${status} • ${formatCurrency(amount, curr.code)}${
                      converted ? ` • ≈ ${formatCurrency(converted, selectedCurrencyCode)}` : ''
                    }`
                  : `${status} • ${amount}`
              }
              onPress={() => navigation.navigate('IncomeForm', { id: it.id })}
            />
          );
        })}
      </List.Section>

      <FAB style={{ position: 'absolute', right: 16, bottom: 16 }} icon="plus" onPress={() => navigation.navigate('IncomeForm')} />
    </View>
  );
}

