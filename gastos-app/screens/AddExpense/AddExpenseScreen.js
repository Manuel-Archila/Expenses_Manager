import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './AddExpenseScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Provider as PaperProvider } from 'react-native-paper';
import { crearGastoUnico, crearGastoFijo } from '../../services/expensesService';
import { getCategorias } from '../../services/categoriasService';
import COLORS from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const AddExpenseScreen = () => {
  const [tipoFijo, setTipoFijo] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [recordatorio, setRecordatorio] = useState(true);
  const [items, setItems] = useState([]);

  const insets = useSafeAreaInsets();


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getCategorias();
        const data = response.data.data;
        setItems(data.map(cat => ({
          label: cat.name,
          value: cat.id,
          key: cat.id,
        })));
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  const frecuencias = [
    { label: 'Diario', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'anual' },
  ];

  const [open, setOpen] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
  const [openFrecuencia, setOpenFrecuencia] = useState(false);
  const [frecuencia, setFrecuencia] = useState(null);

  const handleGuardar = async () => {
    if (!descripcion.trim() || !monto.trim() || !selectedCategoriaId) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      if (tipoFijo) {
        if (!frecuencia) {
          Alert.alert('Frecuencia requerida', 'Selecciona la frecuencia del gasto fijo.');
          return;
        }

        console.log('Frecuencia:', frecuencia);
        console.log('Recordatorio:', recordatorio);
        console.log('Fecha de pago:', fechaPago.toISOString().split('T')[0]);
        console.log('Descripción:', descripcion);
        console.log('Monto:', parseFloat(monto));
        console.log('Categoría ID:', selectedCategoriaId);

        await crearGastoFijo({
          description: descripcion,
          amount: parseFloat(monto),
          category_id: selectedCategoriaId,
          payment_date: fechaPago.toISOString().split('T')[0],
          frequency:frecuencia,
          notify:recordatorio,
        });
      } else {
        await crearGastoUnico({
          description: descripcion,
          amount: parseFloat(monto),
          category_id: selectedCategoriaId,
          date: fechaPago.toISOString().split('T')[0],
        });
      }

      Alert.alert('Éxito', 'Gasto guardado correctamente');
      setDescripcion('');
      setMonto('');
      setSelectedCategoriaId(null);
      setTipoFijo(false);
      setFechaPago(new Date());
      setFrecuencia(null);
      setRecordatorio(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el gasto. Inténtalo más tarde.');
    }
  };

  const handleMonto = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    if (/^\d*\.?\d{0,2}$/.test(cleaned)) {
      setMonto(cleaned);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
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

          <ScrollView
            contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
            keyboardShouldPersistTaps="handled"
          >
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
              onChangeText={handleMonto}
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
              listMode="MODAL"
              modalProps={{
                animationType: 'slide',
              }}
              modalTitle="Categorías"
              modalTitleStyle={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingVertical: 12,
                color: COLORS.textPrimary,
              }}
              modalContentContainerStyle={{
                backgroundColor: COLORS.background,
                paddingHorizontal: 16,
                paddingVertical: 20,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
              renderListItem={({ item, isSelected }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategoriaId(item.value);
                    setOpen(false);
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    marginBottom: 10,
                    borderRadius: 12,
                    marginTop: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{
                    fontSize: 18,
                    color: isSelected ? COLORS.primary : COLORS.textSecondary,
                    fontWeight: 'bold',
                  }}>
                    {item.label}
                  </Text>

                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />

            <Text style={styles.label}>
              {tipoFijo ? 'Fecha de pago' : 'Fecha del gasto'}
            </Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setMostrarPicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#555" />
              <Text style={styles.datePickerText}>
                {fechaPago.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {tipoFijo && (
              <>
                <Text style={styles.label}>Frecuencia del gasto</Text>
                <DropDownPicker
                  open={openFrecuencia}
                  value={frecuencia}
                  items={frecuencias}
                  setOpen={setOpenFrecuencia}
                  setValue={setFrecuencia}
                  setItems={() => {}}
                  placeholder="Seleccionar frecuencia"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  listMode="MODAL"
                  modalProps={{
                    animationType: 'slide',
                  }}
                  modalTitle="Frecuencia"
                  modalTitleStyle={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingVertical: 12,
                    color: COLORS.textPrimary,
                  }}
                  modalContentContainerStyle={{
                    backgroundColor: COLORS.background,
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                  renderListItem={({ item, isSelected }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setFrecuencia(item.value);
                        setOpenFrecuencia(false);
                      }}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 10,
                        borderRadius: 12,
                        marginTop: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{
                        fontSize: 18,
                        color: isSelected ? COLORS.primary : COLORS.textSecondary,
                        fontWeight: 'bold',
                      }}>
                        {item.label}
                      </Text>

                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />

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
          </ScrollView>

          <View style={{ paddingBottom: insets.bottom + 20 }}>
            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default AddExpenseScreen;
