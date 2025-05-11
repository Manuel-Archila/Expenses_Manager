import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from './HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Dashboard</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
