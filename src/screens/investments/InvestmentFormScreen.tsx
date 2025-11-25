import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, RadioButton, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore } from '@/store/settings.store';
import { createInvestment, getInvestment, updateInvestment, deleteInvestment } from '@/services/investments';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InvestmentsStackParamList } from '@/navigation/InvestmentsStack';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  invested_amount: z.coerce.number().positive('Monto invertido > 0'),
  current_value: z.coerce.number().min(0, 'Valor actual ≥ 0'),
  currency_id: z.string().uuid('Selecciona una moneda'),
  notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<InvestmentsStackParamList, 'InvestmentForm'>;

export default function InvestmentFormScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const isEdit = !!id;
  const { currencies, fetchCurrencies, selectedCurrencyCode } = useSettingsStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      invested_amount: 0,
      current_value: 0,
      currency_id: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!currencies.length) fetchCurrencies();
  }, []);

  useEffect(() => {
    (async () => {
      if (isEdit && id) {
        const row = await getInvestment(id);
        if (row) {
          reset({
            name: row.name,
            invested_amount: Number(row.invested_amount),
            current_value: Number(row.current_value),
            currency_id: row.currency_id,
            notes: row.notes ?? '',
          });
        }
      } else if (!watch('currency_id') && currencies.length) {
        const def = currencies.find((c) => c.code === selectedCurrencyCode) || currencies[0];
        if (def) setValue('currency_id', def.id);
      }
    })();
  }, [id, isEdit, currencies]);

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      if (isEdit && id) await updateInvestment(id, data);
      else await createInvestment(data);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo guardar');
    }
  };

  const onDelete = async () => {
    if (!isEdit || !id) return;
    try {
      await deleteInvestment(id);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo eliminar');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        {isEdit ? 'Editar inversión' : 'Nueva inversión'}
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Nombre" value={value} onChangeText={onChange} error={!!error} />
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="invested_amount"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="Monto invertido"
              keyboardType="decimal-pad"
              value={String(value ?? '')}
              onChangeText={onChange}
              error={!!error}
            />
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="current_value"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="Valor actual"
              keyboardType="decimal-pad"
              value={String(value ?? '')}
              onChangeText={onChange}
              error={!!error}
            />
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="currency_id"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 8 }}>Moneda</Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              {currencies.map((c) => (
                <RadioButton.Item key={c.id} label={`${c.code} — ${c.name}`} value={c.id} />
              ))}
            </RadioButton.Group>
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Notas (opcional)" value={value ?? ''} onChangeText={onChange} multiline />
          </View>
        )}
      />

      {submitError ? <Text style={{ color: 'red', marginBottom: 12 }}>{submitError}</Text> : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        {isEdit ? 'Guardar cambios' : 'Crear inversión'}
      </Button>
      {isEdit ? (
        <Button style={{ marginTop: 8 }} mode="outlined" onPress={onDelete}>
          Eliminar
        </Button>
      ) : null}
    </ScrollView>
  );
}
