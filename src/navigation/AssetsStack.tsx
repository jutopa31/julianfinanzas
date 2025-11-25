import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import AssetsListScreen from '@/screens/assets/AssetsListScreen';
import AssetFormScreen from '@/screens/assets/AssetFormScreen';

export type AssetsStackParamList = {
  AssetsList: undefined;
  AssetForm: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export default function AssetsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AssetsList" component={AssetsListScreen} options={{ title: 'Activos' }} />
      <Stack.Screen name="AssetForm" component={AssetFormScreen} options={{ title: 'Editar activo' }} />
    </Stack.Navigator>
  );
}

