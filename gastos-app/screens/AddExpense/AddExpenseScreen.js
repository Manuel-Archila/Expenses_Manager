import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './AddExpenseScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Provider as PaperProvider } from 'react-native-paper';
import COLORS from '../../constants/colors';

const AddExpenseScreen = () => {
  const [tipoFijo, setTipoFijo] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [recordatorio, setRecordatorio] = useState(true);

  const categories = [
    { id: '1', name: 'Alimentos', color: '#F26419' },
    { id: '2', name: 'Transporte', color: '#86BBD8' },
    { id: '3', name: 'Entretenimiento', color: '#F6AE2D' },
  ];

  const [open, setOpen] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
  const [items, setItems] = useState(
    categories.map(cat => ({
      label: cat.name,
      value: cat.id,
    }))
  );

  const handleGuardar = () => {
    if (!descripcion.trim() || !monto.trim() || !selectedCategoriaId) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const categoriaSeleccionada = categories.find(cat => cat.id === selectedCategoriaId);

    const gasto = {
      descripcion,
      monto: parseFloat(monto),
      categoriaId: selectedCategoriaId,
      categoriaNombre: categoriaSeleccionada?.name,
      tipoFijo,
      fechaPago: tipoFijo ? fechaPago : null,
      recordatorio: tipoFijo ? recordatorio : false,
    };

    console.log('Gasto guardado:', gasto);
    // Aquí podrías guardar en base de datos local o enviar al backend
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Agregar nuevo gasto</Text>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, !tipoFijo && styles.selected]}
            onPress={() => setTipoFijo(false)}
          >
            <Text style={[styles.toggleText, !tipoFijo && styles.selectedText]}>
              Gasto único
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, tipoFijo && styles.selected]}
            onPress={() => setTipoFijo(true)}
          >
            <Text style={[styles.toggleText, tipoFijo && styles.selectedText]}>
              Gasto fijo
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={monto}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9.]/g, '');
            if (/^\d*\.?\d{0,2}$/.test(cleaned)) {
              setMonto(cleaned);
            }
          }}
        />

        <Text style={styles.label}>Categoría</Text>
        <DropDownPicker
          open={open}
          value={selectedCategoriaId}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedCategoriaId}
          setItems={setItems}
          placeholder="Seleccionar categoría"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {tipoFijo && (
          <>
            <Text style={styles.label}>Fecha de pago (opcional)</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setMostrarPicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#555" />
              <Text style={styles.datePickerText}>
                {fechaPago.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Recordarme del pago</Text>
              <Switch
                value={recordatorio}
                onValueChange={setRecordatorio}
                thumbColor={recordatorio ? '#05C46B' : '#ccc'}
              />
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

        {mostrarPicker && (
          <DateTimePicker
            value={fechaPago}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setMostrarPicker(false);
              if (date) setFechaPago(date);
            }}
          />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
};

export default AddExpenseScreen;
