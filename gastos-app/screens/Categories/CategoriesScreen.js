import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import styles from './CategoriesScreen.styles';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Divider, Provider, DefaultTheme as PaperTheme } from 'react-native-paper'; // ✅ CORRECTO
import COLORS from '../../constants/colors';

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


export default function CategoriesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    { name: 'Alimentos', color: '#F26419' },
    { name: 'Transporte', color: '#86BBD8' },
    { name: 'Entretenimiento', color: '#F6AE2D' },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [colorPickerIndex, setColorPickerIndex] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newCategoryColor, setNewCategoryColor] = useState('#86BBD8');

  const presetColors = ['#F26419', '#86BBD8', '#F6AE2D', '#05C46B', '#5758BB'];

  const openMenu = (index) => setVisibleMenu(index);
  const closeMenu = () => setVisibleMenu(null);
  const openColorPicker = (index) => {
    closeMenu();
    setColorPickerIndex(index);
  };
  

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.some((cat) => cat.name === trimmed)) {
      Alert.alert('Ya existe', 'Esta categoría ya está en la lista.');
      return;
    }
    setCategories([...categories, { name: trimmed, color: newCategoryColor }]);
    setNewCategory('');
    setCreating(false);
  };

  const handleDelete = (index) => {
    Alert.alert('Eliminar categoría', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          const updated = [...categories];
          updated.splice(index, 1);
          setCategories(updated);
          closeMenu();
        },
      },
    ]);
  };

  const handleEditSave = (index) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    if (categories.some((cat, i) => i !== index && cat.name === trimmed)) {
      Alert.alert('Ya existe', 'Esta categoría ya está en la lista.');
      return;
    }
    const updated = [...categories];
    updated[index].name = trimmed;
    setCategories(updated);
    setEditIndex(null);
    setEditValue('');
  };

  const selectColor = (color) => {
    if (colorPickerIndex !== null) {
      // Estamos editando color de una categoría existente
      const updated = [...categories];
      updated[colorPickerIndex].color = color;
      setCategories(updated);
      setColorPickerIndex(null);
    } else {
      // Estamos creando una nueva categoría
      setNewCategoryColor(color);
    }
  };
  

  return (
    <Provider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Categorías</Text>

        <FlatList
          data={categories}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item, index }) => (
            <View style={styles.categoryItem}>
              {editIndex === index ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder="Editar categoría"
                  />
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleEditSave(index)}
                  >
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEditIndex(null);
                      setEditValue('');
                    }}
                  >
                    <Ionicons name="close" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.row}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.colorDot(item.color)} />
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </View>

                  <Menu
                    visible={visibleMenu === index}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity onPress={() => openMenu(index)}>
                        <Ionicons
                          name="ellipsis-vertical"
                          size={20}
                          color={COLORS.textSecondary}
                        />
                      </TouchableOpacity>
                    }
                    contentStyle={{ backgroundColor: '#fff' }}
                  >
                    <Menu.Item
                      onPress={() => {
                        closeMenu();
                        setEditIndex(index);
                        setEditValue(item.name);
                      }}
                      title="Editar"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => handleDelete(index)}
                      title="Eliminar"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => openColorPicker(index)}
                      title="Cambiar color"
                    />
                  </Menu>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Sin categorías aún</Text>
          }
        />

        {/* Modal de creación */}
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
                onPress={() => {
                  setNewCategory('');
                  setCreating(false);
                }}
              >
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Nueva categoría</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Nombre de categoría"
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
                    onPress={() => selectColor(color)}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.createButton} onPress={handleAdd}>
                <Text style={styles.createButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={colorPickerIndex !== null}
          onRequestClose={() => setColorPickerIndex(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setColorPickerIndex(null)}
              >
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Seleccionar color</Text>

              <View style={styles.colorPickerRow}>
                {presetColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      categories[colorPickerIndex]?.color === color && {
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => selectColor(color)}
                  />
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {/* FAB */}
        {!creating && (
          <TouchableOpacity
          style={[styles.fabBottomRight, { bottom: insets.bottom + 40 }]}
          onPress={() => {
            setColorPickerIndex(null);
            setCreating(true);
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
        )}
      </SafeAreaView>
    </Provider>
  );
}
