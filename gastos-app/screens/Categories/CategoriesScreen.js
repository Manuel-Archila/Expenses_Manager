
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import styles from './CategoriesScreen.styles';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Divider, Provider, DefaultTheme as PaperTheme } from 'react-native-paper';
import COLORS from '../../constants/colors';
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../../services/categoriasService';

const theme = {
  ...PaperTheme,
  colors: {
    ...PaperTheme.colors,
    surface: '#FFFFFF',
    background: '#FFFFFF',
    text: COLORS.textPrimary,
    primary: COLORS.primary,
    onSurface: COLORS.textPrimary,
  },
};

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();

  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newCategoryColor, setNewCategoryColor] = useState('#F26419');
  const [editingCategory, setEditingCategory] = useState(null); // objeto completo
  const [editCategoryName, setEditCategoryName] = useState('');

  const presetColors = [
    '#F26419', '#86BBD8', '#F6AE2D', '#05C46B', '#5758BB',
    '#D72638', '#3F88C5', '#140F2D', '#6A0572',
    '#F9C80E', '#EA3546', '#662E9B', '#A1C181', '#FF7F11'
  ];

  const fetchCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategories(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAdd = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    if (categories.some((cat) => cat.name === trimmed)) {
      Alert.alert('Ya existe', 'Esta categoría ya está en la lista.');
      return;
    }

    try {
      await crearCategoria({ name: trimmed, color: newCategoryColor });
      setNewCategory('');
      setCreating(false);
      fetchCategorias();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la categoría');
    }
  };

  const handleEditSave = async () => {
    const trimmed = editCategoryName.trim();
    if (!trimmed || !editingCategory) return;

    if (categories.some((cat) => cat.id !== editingCategory.id && cat.name === trimmed)) {
      Alert.alert('Ya existe', 'Esta categoría ya está en la lista.');
      return;
    }

    try {
      const updated = await actualizarCategoria(editingCategory.id, {
        name: trimmed,
        color: editingCategory.color,
      });
      setEditingCategory(null);
      setEditCategoryName('');
      fetchCategorias();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la categoría');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Eliminar categoría', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarCategoria(id);
            fetchCategorias();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la categoría');
          }
        },
      },
    ]);
  };

  const handleSelectEditColor = (color) => {
    setEditingCategory({ ...editingCategory, color });
  };

  return (
    <Provider theme={theme}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 64}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Categorías</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.colorDot(item.color)} />
                      <Text style={styles.categoryText}>{item.name}</Text>
                    </View>
                    <Menu
                      visible={visibleMenu === item.id}
                      onDismiss={() => setVisibleMenu(null)}
                      anchor={
                        <TouchableOpacity onPress={() => setVisibleMenu(item.id)}>
                          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                      }
                      contentStyle={{ backgroundColor: '#fff' }}
                    >
                      <Menu.Item
                        onPress={() => {
                          setVisibleMenu(null);
                          setEditingCategory(item);
                          setEditCategoryName(item.name);
                        }}
                        title="Editar"
                      />
                      <Divider />
                      <Menu.Item onPress={() => handleDelete(item.id)} title="Eliminar" />
                    </Menu>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin categorías aún</Text>}
              keyboardShouldPersistTaps="handled"
            />

            {/* Modal creación */}
            <Modal
              transparent
              animationType="fade"
              visible={creating}
              onRequestClose={() => setCreating(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setCreating(false)}
                  >
                    <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Nueva categoría</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Nombre"
                    placeholderTextColor={COLORS.textSecondary}
                    value={newCategory}
                    onChangeText={setNewCategory}
                  />
                  <View style={styles.colorPickerRow}>
                    {presetColors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          newCategoryColor === color && {
                            borderColor: COLORS.primary,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </View>
                  <TouchableOpacity style={styles.createButton} onPress={handleAdd}>
                    <Text style={styles.createButtonText}>Crear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Modal edición */}
            <Modal
              transparent
              animationType="fade"
              visible={!!editingCategory}
              onRequestClose={() => setEditingCategory(null)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setEditingCategory(null)}
                  >
                    <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Editar categoría</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Nuevo nombre"
                    placeholderTextColor={COLORS.textSecondary}
                    value={editCategoryName}
                    onChangeText={setEditCategoryName}
                  />
                  <View style={styles.colorPickerRow}>
                    {presetColors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          editingCategory?.color === color && {
                            borderColor: COLORS.primary,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => handleSelectEditColor(color)}
                      />
                    ))}
                  </View>
                  <TouchableOpacity style={styles.createButton} onPress={handleEditSave}>
                    <Text style={styles.createButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* FAB */}
            {!creating && (
              <TouchableOpacity
                style={[styles.fabBottomRight, { bottom: insets.bottom + 40 }]}
                onPress={() => {
                  setCreating(true);
                  setNewCategory('');
                }}
              >
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Provider>
  );
}
