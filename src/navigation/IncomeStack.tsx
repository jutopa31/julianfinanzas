import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IncomeListScreen from '@/screens/income/IncomeListScreen';
import IncomeFormScreen from '@/screens/income/IncomeFormScreen';

export type IncomeStackParamList = {
  IncomeList: undefined;
  IncomeForm: { id?: string } | undefined;
};

const Stack = createStackNavigator<IncomeStackParamList>();

export default function IncomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="IncomeList" component={IncomeListScreen} options={{ title: 'Cobros futuros' }} />
      <Stack.Screen name="IncomeForm" component={IncomeFormScreen} options={{ title: 'Editar cobro' }} />
    </Stack.Navigator>
  );
}
