import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfileScreen.styles';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>{user?.email || 'No disponible'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Categorias')}>
        <Text style={styles.buttonText}>Gestionar categorías</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
