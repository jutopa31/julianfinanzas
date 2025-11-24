import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

export const HomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          ¡Bienvenido!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {user?.email}
        </Text>
        <Text variant="bodyMedium" style={styles.info}>
          Has iniciado sesión correctamente en JulianFinanzas.
        </Text>
        <Text variant="bodySmall" style={styles.infoSecondary}>
          Las próximas fases implementarán:
        </Text>
        <View style={styles.featuresList}>
          <Text variant="bodySmall">• Dashboard de cashflow</Text>
          <Text variant="bodySmall">• Inversiones</Text>
          <Text variant="bodySmall">• Activos</Text>
          <Text variant="bodySmall">• Cobros futuros</Text>
          <Text variant="bodySmall">• Gastos programados</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleSignOut}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Cerrar Sesión
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 16,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  info: {
    textAlign: 'center',
    marginBottom: 24,
  },
  infoSecondary: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.6,
  },
  featuresList: {
    marginBottom: 24,
    paddingLeft: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});
