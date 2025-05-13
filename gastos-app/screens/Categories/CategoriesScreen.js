import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './CategoriesScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Provider } from 'react-native-paper';
import COLORS from '../../constants/colors';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    surface: '#FFFFFF',
    onSurface: COLORS.textPrimary,
    primary: COLORS.primary,
  },
};

export default function CategoriesScreen({ navigation }) {
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    'Alimentos',
    'Transporte',
    'Entretenimiento',
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(null); // index del menú abierto

  const openMenu = (index) => setVisibleMenu(index);
  const closeMenu = () => setVisibleMenu(null);

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      Alert.alert('Ya existe', 'Esta categoría ya está en la lista.');
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory('');
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
    if (categories.includes(trimmed)) {
      Alert.alert('Ya existe', 'Esta categoría ya está en la lista.');
      return;
    }
    const updated = [...categories];
    updated[index] = trimmed;
    setCategories(updated);
    setEditIndex(null);
    setEditValue('');
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Categorías</Text>

        <FlatList
          data={categories}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => (
            <View style={styles.categoryItem}>
                {editIndex === index ? (
                    <>
                    <TextInput
                        style={styles.editInput}
                        value={editValue}
                        onChangeText={setEditValue}
                        placeholder="Editar categoría"
                    />
                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleEditSave(index)}>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>

                    </>
                ) : (
                    <View style={styles.row}>
                    <Text style={styles.categoryText}>{item}</Text>
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
                    >
                        <Menu.Item
                        onPress={() => {
                            closeMenu();
                            setEditIndex(index);
                            setEditValue(item);
                        }}
                        title="Editar"
                        />
                        <Menu.Item
                        onPress={() => handleDelete(index)}
                        title="Eliminar"
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

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nueva categoría"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Provider>
  );
}
