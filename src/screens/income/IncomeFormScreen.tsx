import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, RadioButton, Text, TextInput, Switch } from 'react-native-paper';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore } from '@/store/settings.store';
import { createIncome, getIncome, updateIncome, deleteIncome, markIncomeReceived } from '@/services/income';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { IncomeStackParamList } from '@/navigation/IncomeStack';

const schema = z.object({
  concept: z.string().min(2, 'Concepto requerido'),
  amount: z.coerce.number().positive('Monto > 0'),
  currency_id: z.string().uuid('Selecciona una moneda'),
  expected_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/g, 'Formato YYYY-MM-DD'),
  notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<IncomeStackParamList, 'IncomeForm'>;

export default function IncomeFormScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const isEdit = !!id;
  const { currencies, fetchCurrencies, selectedCurrencyCode } = useSettingsStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isReceived, setIsReceived] = useState(false);
  const [receivedDate, setReceivedDate] = useState('');

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      concept: '',
      amount: 0,
      currency_id: '',
      expected_date: new Date().toISOString().slice(0, 10),
      notes: '',
    },
  });

  useEffect(() => {
    if (!currencies.length) fetchCurrencies();
  }, []);

  useEffect(() => {
    (async () => {
      if (isEdit && id) {
        const row = await getIncome(id);
        if (row) {
          reset({
            concept: row.concept,
            amount: Number(row.amount),
            currency_id: row.currency_id,
            expected_date: row.expected_date,
            notes: row.notes ?? '',
          });
          setIsReceived(!!row.is_received);
          setReceivedDate(row.received_date ?? '');
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
      if (isEdit && id) await updateIncome(id, data);
      else await createIncome(data);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo guardar');
    }
  };

  const onDelete = async () => {
    if (!isEdit || !id) return;
    try {
      await deleteIncome(id);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo eliminar');
    }
  };

  const onMarkReceived = async () => {
    if (!isEdit || !id) return;
    try {
      const data = await markIncomeReceived(id, receivedDate || undefined);
      setIsReceived(!!data.is_received);
      setReceivedDate(data.received_date || '');
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo marcar como recibido');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        {isEdit ? 'Editar cobro' : 'Nuevo cobro'}
      </Text>

      <Controller
        control={control}
        name="concept"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Concepto" value={value} onChangeText={onChange} error={!!error} />
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="Monto"
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
        name="expected_date"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Fecha esperada (YYYY-MM-DD)" value={value} onChangeText={onChange} error={!!error} />
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
        {isEdit ? 'Guardar cambios' : 'Crear cobro'}
      </Button>
      {isEdit ? (
        <>
          <View style={{ height: 12 }} />
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Estado
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Text>Recibido</Text>
            <Switch value={isReceived} onValueChange={() => {}} disabled />
          </View>
          <TextInput
            label="Fecha de recepción (YYYY-MM-DD)"
            value={receivedDate}
            onChangeText={setReceivedDate}
            placeholder={new Date().toISOString().slice(0, 10)}
          />
          <View style={{ height: 8 }} />
          <Button mode="outlined" onPress={onMarkReceived}>
            Marcar como recibido
          </Button>
          <View style={{ height: 8 }} />
          <Button mode="outlined" onPress={onDelete}>
            Eliminar
          </Button>
        </>
      ) : null}
    </ScrollView>
  );
}

