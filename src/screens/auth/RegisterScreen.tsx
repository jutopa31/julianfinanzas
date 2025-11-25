import React from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/hooks/useAuth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

const schema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirm: z.string().min(6),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'No coincide' });
type FormData = z.infer<typeof schema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { control, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { signUp, error } = useAuth();

  const onSubmit = async ({ email, password }: FormData) => {
    const ok = await signUp({ email, password });
    if (!ok) return;
    // Optionally navigate to login or rely on email confirmation if configured
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 8 }}>
        Crear cuenta
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            error={!!error}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            label="Contraseña"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={!!error}
          />
        )}
      />

      <Controller
        control={control}
        name="confirm"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            label="Confirmar contraseña"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={!!error}
          />
        )}
      />

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Registrarme
      </Button>

      <Button onPress={() => navigation.navigate('Login')}>Ya tengo cuenta</Button>
    </View>
  );
}

