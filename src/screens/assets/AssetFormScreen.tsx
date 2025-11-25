import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, RadioButton, Text, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore } from '@/store/settings.store';
import { createAsset, getAsset, updateAsset, deleteAsset } from '@/services/assets';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AssetsStackParamList } from '@/navigation/AssetsStack';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  asset_type: z.string().optional().nullable(),
  current_value: z.coerce.number().min(0, 'Valor actual ≥ 0'),
  currency_id: z.string().uuid('Selecciona una moneda'),
  description: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AssetsStackParamList, 'AssetForm'>;

export default function AssetFormScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const isEdit = !!id;
  const { currencies, fetchCurrencies, selectedCurrencyCode } = useSettingsStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      asset_type: '',
      current_value: 0,
      currency_id: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!currencies.length) fetchCurrencies();
  }, []);

  useEffect(() => {
    (async () => {
      if (isEdit && id) {
        const row = await getAsset(id);
        if (row) {
          reset({
            name: row.name,
            asset_type: row.asset_type ?? '',
            current_value: Number(row.current_value),
            currency_id: row.currency_id,
            description: row.description ?? '',
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
      if (isEdit && id) await updateAsset(id, data);
      else await createAsset(data);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo guardar');
    }
  };

  const onDelete = async () => {
    if (!isEdit || !id) return;
    try {
      await deleteAsset(id);
      navigation.goBack();
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo eliminar');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        {isEdit ? 'Editar activo' : 'Nuevo activo'}
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
        name="asset_type"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Tipo (opcional)" value={value ?? ''} onChangeText={onChange} />
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
        name="description"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput label="Descripción (opcional)" value={value ?? ''} onChangeText={onChange} multiline />
          </View>
        )}
      />

      {submitError ? <Text style={{ color: 'red', marginBottom: 12 }}>{submitError}</Text> : null}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        {isEdit ? 'Guardar cambios' : 'Crear activo'}
      </Button>
      {isEdit ? (
        <Button style={{ marginTop: 8 }} mode="outlined" onPress={onDelete}>
          Eliminar
        </Button>
      ) : null}
    </ScrollView>
  );
}

