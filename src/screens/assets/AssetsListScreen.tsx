import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { FAB, List, Text } from 'react-native-paper';
import { listAssets, type AssetRow } from '@/services/assets';
import { useSettingsStore } from '@/store/settings.store';
import { convertAmount, findCurrency, formatCurrency } from '@/utils/currency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AssetsStackParamList } from '@/navigation/AssetsStack';

type Props = NativeStackScreenProps<AssetsStackParamList, 'AssetsList'>;

export default function AssetsListScreen({ navigation }: Props) {
  const [items, setItems] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currencies, selectedCurrencyCode } = useSettingsStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAssets();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar activos');
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
        <List.Subheader>Mis activos</List.Subheader>
      </List.Section>

      <List.Section style={{ flex: 1 }}>
        {items.map((it) => {
          const value = Number(it.current_value);
          const curr = currencies.find((c) => c.id === it.currency_id);
          const selected = findCurrency(currencies, selectedCurrencyCode);
          const converted = curr && selected ? convertAmount(value, curr, selected) : null;
          return (
            <List.Item
              key={it.id}
              title={it.name}
              description={
                curr
                  ? `${it.asset_type ?? '—'} • ${formatCurrency(value, curr.code)}${
                      converted ? ` • ≈ ${formatCurrency(converted, selectedCurrencyCode)}` : ''
                    }`
                  : `${it.asset_type ?? '—'} • ${value}`
              }
              onPress={() => navigation.navigate('AssetForm', { id: it.id })}
            />
          );
        })}
      </List.Section>

      <FAB style={{ position: 'absolute', right: 16, bottom: 16 }} icon="plus" onPress={() => navigation.navigate('AssetForm')} />
    </View>
  );
}

