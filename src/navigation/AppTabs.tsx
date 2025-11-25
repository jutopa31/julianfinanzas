import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import InvestmentsStack from '@/navigation/InvestmentsStack';
import AssetsStack from '@/navigation/AssetsStack';
import IncomeStack from '@/navigation/IncomeStack';
import ExpensesStack from '@/navigation/ExpensesStack';

export type AppTabsParamList = {
  DashboardTab: undefined;
  InvestmentsTab: undefined;
  AssetsTab: undefined;
  IncomeTab: undefined;
  ExpensesTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="InvestmentsTab" component={InvestmentsStack} options={{ title: 'Inversiones' }} />
      <Tab.Screen name="AssetsTab" component={AssetsStack} options={{ title: 'Activos' }} />
      <Tab.Screen name="IncomeTab" component={IncomeStack} options={{ title: 'Cobros' }} />
      <Tab.Screen name="ExpensesTab" component={ExpensesStack} options={{ title: 'Gastos' }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
}
