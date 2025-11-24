import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, ActivityIndicator, Divider } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { useCurrency } from '../hooks/useCurrency';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { defaultCurrency, loading: currencyLoading } = useCurrency();
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  const handleCurrencySettings = () => {
    navigation.navigate('CurrencySettings');
  };

  return (
    <ScrollView style={styles.container}>
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

        <Divider style={styles.divider} />

        {/* Sección de Moneda */}
        <View style={styles.currencySection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Configuración de Moneda
          </Text>
          {currencyLoading ? (
            <ActivityIndicator size="small" style={styles.loader} />
          ) : defaultCurrency ? (
            <View style={styles.currencyInfo}>
              <Text variant="bodyLarge" style={styles.currencyCode}>
                {defaultCurrency.symbol} {defaultCurrency.code}
              </Text>
              <Text variant="bodySmall" style={styles.currencyName}>
                {defaultCurrency.name}
              </Text>
              <Text variant="bodySmall" style={styles.currencyRate}>
                Tasa a USD: {defaultCurrency.rate_to_usd}
              </Text>
            </View>
          ) : (
            <View style={styles.noCurrency}>
              <Text variant="bodyMedium" style={styles.noCurrencyText}>
                No tienes una moneda configurada
              </Text>
              <Text variant="bodySmall" style={styles.noCurrencySubtext}>
                Configura tu moneda por defecto para empezar
              </Text>
            </View>
          )}
          <Button
            mode="outlined"
            onPress={handleCurrencySettings}
            style={styles.currencyButton}
            icon="cog"
          >
            Configurar Moneda
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Próximas fases */}
        <Text variant="bodySmall" style={styles.infoSecondary}>
          Próximas funcionalidades:
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
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
  divider: {
    marginVertical: 20,
  },
  currencySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 16,
  },
  currencyInfo: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  currencyCode: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currencyName: {
    opacity: 0.7,
    marginBottom: 8,
  },
  currencyRate: {
    opacity: 0.5,
    fontSize: 12,
  },
  noCurrency: {
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  noCurrencyText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  noCurrencySubtext: {
    opacity: 0.7,
  },
  currencyButton: {
    marginTop: 8,
  },
  infoSecondary: {
    textAlign: 'center',
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
