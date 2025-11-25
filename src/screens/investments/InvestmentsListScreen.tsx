import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { FAB, List, Text } from 'react-native-paper';
import { listInvestments, type InvestmentRow } from '@/services/investments';
import { useSettingsStore } from '@/store/settings.store';
import { convertAmount, findCurrency, formatCurrency } from '@/utils/currency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InvestmentsStackParamList } from '@/navigation/InvestmentsStack';

type Props = NativeStackScreenProps<InvestmentsStackParamList, 'InvestmentsList'>;

export default function InvestmentsListScreen({ navigation }: Props) {
  const [items, setItems] = useState<InvestmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currencies, selectedCurrencyCode } = useSettingsStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInvestments();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar inversiones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1 }}>
      {error ? (
        <Text style={{ color: 'red', margin: 12 }}>{error}</Text>
      ) : null}

      <List.Section>
        <List.Subheader>Mis inversiones</List.Subheader>
      </List.Section>

      <List.Section style={{ flex: 1 }}>
          {items.map((it) => {
            const invAmount = Number(it.invested_amount);
            const currValue = Number(it.current_value);
            const curr = currencies.find((c) => c.id === it.currency_id);
            const selected = findCurrency(currencies, selectedCurrencyCode);
            const converted = curr && selected ? convertAmount(currValue, curr, selected) : null;
            return (
              <List.Item
                key={it.id}
                title={it.name}
                description={
                  curr
                    ? `${formatCurrency(invAmount, curr.code)} → ${formatCurrency(currValue, curr.code)}${
                        converted ? ` • ≈ ${formatCurrency(converted, selectedCurrencyCode)}` : ''
                      }`
                    : `${invAmount} → ${currValue}`
                }
                right={() => (
                  <Text style={{ alignSelf: 'center', marginRight: 12 }}>
                    {Number(it.return_percentage).toFixed(2)}%
                  </Text>
                )}
                onPress={() => navigation.navigate('InvestmentForm', { id: it.id })}
              />
            );
          })}
      </List.Section>

      <FAB style={{ position: 'absolute', right: 16, bottom: 16 }} icon="plus" onPress={() => navigation.navigate('InvestmentForm')} />

      {/* Pull to refresh can be added if wrapped in ScrollView */}
    </View>
  );
}
