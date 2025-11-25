import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuth from '@/hooks/useAuth';
import LoadingView from '@/components/common/LoadingView';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import AppTabs from '@/navigation/AppTabs';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  App: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingView />;

  const isAuthed = !!session;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthed ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
