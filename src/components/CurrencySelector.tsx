import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Modal, Portal, List, Button, Searchbar, Text, Divider } from 'react-native-paper';
import { Currency } from '../types/app.types';

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
  label?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onSelect,
  label = 'Seleccionar Moneda',
}) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setSearchQuery('');
  };

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    hideModal();
  };

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <Button mode="outlined" onPress={showModal} style={styles.button}>
        {selectedCurrency
          ? `${selectedCurrency.symbol} ${selectedCurrency.code} - ${selectedCurrency.name}`
          : label}
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {label}
          </Text>

          <Searchbar
            placeholder="Buscar moneda..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />

          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={`${item.symbol} ${item.code}`}
                description={item.name}
                right={() =>
                  selectedCurrency?.id === item.id ? (
                    <List.Icon icon="check" color="#6200ee" />
                  ) : null
                }
                onPress={() => handleSelect(item)}
                style={
                  selectedCurrency?.id === item.id ? styles.selectedItem : undefined
                }
              />
            )}
            ItemSeparatorComponent={() => <Divider />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text variant="bodyMedium">No se encontraron monedas</Text>
              </View>
            )}
            style={styles.list}
          />

          <Button mode="text" onPress={hideModal} style={styles.closeButton}>
            Cancelar
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    padding: 20,
    paddingBottom: 16,
    fontWeight: 'bold',
  },
  searchbar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    maxHeight: 400,
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    margin: 16,
  },
});
