import React, { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { List, RadioButton, Text, Button } from 'react-native-paper';
import { useSettingsStore } from '@/store/settings.store';

export default function SettingsScreen() {
  const { currencies, selectedCurrencyCode, fetchCurrencies, setSelectedCurrencyCode, loading, error } =
    useSettingsStore();

  useEffect(() => {
    if (!currencies.length) fetchCurrencies();
  }, []);

  const grouped = useMemo(() => {
    return currencies.reduce<Record<string, typeof currencies>>((acc, c) => {
      const k = c.code[0];
      acc[k] = acc[k] || [];
      acc[k].push(c);
      return acc;
    }, {});
  }, [currencies]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 12 }}>
        Ajustes
      </Text>

      <List.Section>
        <List.Subheader>Moneda por defecto</List.Subheader>
        <RadioButton.Group onValueChange={(v) => setSelectedCurrencyCode(v)} value={selectedCurrencyCode}>
          {Object.keys(grouped)
            .sort()
            .map((k) => (
              <View key={k}>
                <List.Subheader>{k}</List.Subheader>
                {grouped[k]
                  .sort((a, b) => a.code.localeCompare(b.code))
                  .map((c) => (
                    <RadioButton.Item
                      key={c.id}
                      label={`${c.code} — ${c.name} (${c.symbol})`}
                      value={c.code}
                    />
                  ))}
              </View>
            ))}
        </RadioButton.Group>
      </List.Section>

      {error ? (
        <Text style={{ color: 'red', marginVertical: 8 }}>{error}</Text>
      ) : null}

      <Button mode="outlined" loading={loading} onPress={fetchCurrencies}>
        Actualizar monedas
      </Button>
    </ScrollView>
  );
}

