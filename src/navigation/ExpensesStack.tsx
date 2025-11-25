import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import ExpensesListScreen from '@/screens/expenses/ExpensesListScreen';
import ExpenseFormScreen from '@/screens/expenses/ExpenseFormScreen';
import ExpenseRecordsScreen from '@/screens/expenses/ExpenseRecordsScreen';

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  ExpenseForm: { id?: string } | undefined;
  ExpenseRecords: undefined;
};

const Stack = createNativeStackNavigator<ExpensesStackParamList>();

export default function ExpensesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ExpensesList" component={ExpensesListScreen} options={{ title: 'Gastos programados' }} />
      <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} options={{ title: 'Editar gasto' }} />
      <Stack.Screen name="ExpenseRecords" component={ExpenseRecordsScreen} options={{ title: 'Registros' }} />
    </Stack.Navigator>
  );
}

