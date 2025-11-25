import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InvestmentsListScreen from '@/screens/investments/InvestmentsListScreen';
import InvestmentFormScreen from '@/screens/investments/InvestmentFormScreen';

export type InvestmentsStackParamList = {
  InvestmentsList: undefined;
  InvestmentForm: { id?: string } | undefined;
};

const Stack = createStackNavigator<InvestmentsStackParamList>();

export default function InvestmentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InvestmentsList" component={InvestmentsListScreen} options={{ title: 'Inversiones' }} />
      <Stack.Screen
        name="InvestmentForm"
        component={InvestmentFormScreen}
        options={{ title: 'Editar inversión' }}
      />
    </Stack.Navigator>
  );
}
