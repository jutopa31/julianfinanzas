import React from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/hooks/useAuth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type FormData = z.infer<typeof schema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { control, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { signIn, error } = useAuth();

  const onSubmit = async (data: FormData) => {
    const ok = await signIn(data);
    if (!ok) return;
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 8 }}>
        Iniciar sesión
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

      {error ? (
        <Text style={{ color: 'red' }}>
          {error}
        </Text>
      ) : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Entrar
      </Button>

      <Button onPress={() => navigation.navigate('Register')}>Crear cuenta</Button>
    </View>
  );
}

