import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, RadioButton, Switch, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore } from '@/store/settings.store';
import {
  createExpenseSchedule,
  getExpenseSchedule,
  updateExpenseSchedule,
  deleteExpenseSchedule,
  type ExpenseScheduleRow,
} from '@/services/expenses';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ExpensesStackParamList } from '@/navigation/ExpensesStack';

const schema = z.object({
  concept: z.string().min(2, 'Concepto requerido'),
  amount: z.coerce.number().positive('Monto > 0'),
  currency_id: z.string().uuid('Selecciona una moneda'),
  frequency: z.enum(['once', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']),
  next_due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/g, 'Formato YYYY-MM-DD'),
  is_active: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseForm'>;

export default function ExpenseFormScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const isEdit = !!id;
  const { currencies, fetchCurrencies, selectedCurrencyCode } = useSettingsStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      concept: '',
      amount: 0,
      currency_id: '',
      frequency: 'monthly',
      next_due_date: new Date().toISOString().slice(0, 10),
      is_active: true,
      notes: '',
    },
  });

  useEffect(() => {
    if (!currencies.length) fetchCurrencies();
  }, []);

  useEffect(() => {
    (async () => {
      if (isEdit && id) {
        const row = await getExpenseSchedule(id);
        if (row) {
          reset({
            concept: row.concept,
            amount: Number(row.amount),
            currency_id: row.currency_id,
            frequency: row.frequency as FormData['frequency'],
            next_due_date: row.next_due_date,
            is_active: !!row.is_active,
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
      if (isEdit && id) await updateExpenseSchedule(id, data);
      else await createExpenseSchedule(data);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo guardar');
    }
  };

  const onDelete = async () => {
    if (!isEdit || !id) return;
    try {
      await deleteExpenseSchedule(id);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo eliminar');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        {isEdit ? 'Editar gasto programado' : 'Nuevo gasto programado'}
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
        name="frequency"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 8 }}>Frecuencia</Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              {['once', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'].map((f) => (
                <RadioButton.Item key={f} label={f} value={f as any} />
              ))}
            </RadioButton.Group>
          </View>
        )}
      />

      <Controller
        control={control}
        name="next_due_date"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Próxima fecha (YYYY-MM-DD)" value={value} onChangeText={onChange} error={!!error} />
            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="is_active"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text>Activo</Text>
            <Switch value={value} onValueChange={onChange} />
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
        {isEdit ? 'Guardar cambios' : 'Crear gasto'}
      </Button>
      {isEdit ? (
        <Button style={{ marginTop: 8 }} mode="outlined" onPress={onDelete}>
          Eliminar
        </Button>
      ) : null}
    </ScrollView>
  );
}

