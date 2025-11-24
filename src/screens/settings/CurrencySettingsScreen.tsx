import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, ActivityIndicator, Button, Snackbar } from 'react-native-paper';
import { useCurrency } from '../../hooks/useCurrency';
import { CurrencySelector } from '../../components/CurrencySelector';
import { Currency } from '../../types/app.types';
import { formatCurrency } from '../../utils/currency/converter';

export const CurrencySettingsScreen: React.FC = () => {
  const {
    currencies,
    defaultCurrency,
    loading,
    initialized,
    setDefaultCurrency,
    formatAmount,
  } = useCurrency();

  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (defaultCurrency) {
      setSelectedCurrency(defaultCurrency);
    }
  }, [defaultCurrency]);

  const handleSave = async () => {
    if (!selectedCurrency) {
      setSnackbarMessage('Por favor selecciona una moneda');
      setSnackbarVisible(true);
      return;
    }

    setSaving(true);
    const { error } = await setDefaultCurrency(selectedCurrency.id);
    setSaving(false);

    if (error) {
      setSnackbarMessage(error);
      setSnackbarVisible(true);
    } else {
      setSnackbarMessage('Moneda actualizada correctamente');
      setSnackbarVisible(true);
    }
  };

  if (!initialized || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando monedas...</Text>
      </View>
    );
  }

  const exampleAmount = 1000;

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineSmall" style={styles.title}>
          Configuración de Moneda
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          Selecciona tu moneda por defecto. Todos los montos se convertirán automáticamente a
          esta moneda en el dashboard.
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Moneda Actual
          </Text>
          {defaultCurrency ? (
            <View style={styles.currentCurrencyContainer}>
              <Text variant="bodyLarge">
                {defaultCurrency.symbol} {defaultCurrency.code}
              </Text>
              <Text variant="bodyMedium" style={styles.currencyName}>
                {defaultCurrency.name}
              </Text>
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.noSelection}>
              No hay moneda configurada
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Seleccionar Nueva Moneda
          </Text>
          <CurrencySelector
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onSelect={setSelectedCurrency}
            label="Seleccionar Moneda"
          />
        </View>

        {selectedCurrency && (
          <View style={styles.previewSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Vista Previa
            </Text>
            <Surface style={styles.previewBox} elevation={1}>
              <Text variant="bodySmall" style={styles.previewLabel}>
                Ejemplo: {exampleAmount} unidades
              </Text>
              <Text variant="headlineMedium" style={styles.previewAmount}>
                {formatCurrency(exampleAmount, selectedCurrency)}
              </Text>
              <Text variant="bodySmall" style={styles.previewInfo}>
                Tasa a USD: {selectedCurrency.rate_to_usd}
              </Text>
            </Surface>
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving || !selectedCurrency || selectedCurrency.id === defaultCurrency?.id}
          style={styles.saveButton}
        >
          Guardar Configuración
        </Button>
      </Surface>

      <Surface style={styles.infoSurface} elevation={1}>
        <Text variant="titleSmall" style={styles.infoTitle}>
          ℹ️ Información
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • Las conversiones se realizan usando USD como base
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • Las tasas de cambio se actualizan periódicamente
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • Puedes cambiar tu moneda en cualquier momento
        </Text>
      </Surface>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  surface: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  currentCurrencyContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  currencyName: {
    marginTop: 4,
    opacity: 0.7,
  },
  noSelection: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    opacity: 0.5,
    textAlign: 'center',
  },
  previewSection: {
    marginBottom: 24,
  },
  previewBox: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewLabel: {
    opacity: 0.6,
    marginBottom: 8,
  },
  previewAmount: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewInfo: {
    opacity: 0.5,
  },
  saveButton: {
    paddingVertical: 6,
  },
  infoSurface: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    marginBottom: 8,
    opacity: 0.7,
    lineHeight: 18,
  },
});
