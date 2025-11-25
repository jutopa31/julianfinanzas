import React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <View style={{ flex: 1, minHeight: '100vh', backgroundColor: MD3LightTheme.colors.background }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}
