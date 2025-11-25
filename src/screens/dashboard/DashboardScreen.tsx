import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import useAuth from '@/hooks/useAuth';
import { useSettingsStore } from '@/store/settings.store';

export default function DashboardScreen() {
  const { signOut, session } = useAuth();
  const { selectedCurrencyCode } = useSettingsStore();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text variant="headlineSmall">Bienvenido</Text>
      <Text>{session?.user?.email}</Text>
      <Text>Moneda: {selectedCurrencyCode}</Text>
      <Button mode="outlined" onPress={signOut}>
        Cerrar sesión
      </Button>
    </View>
  );
}
