import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './LoginScreen.styles';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      navigation.replace('Main');
    } else {
      Alert.alert('Login fallido', 'Credenciales inválidas o error del servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ghastly</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={COLORS.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        {submitting ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Button title="Entrar" color={COLORS.primary} onPress={handleLogin} />
        )}
      </View>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText} onPress={() => { /* Navegación futura */ }}>
          ¿Olvidaste tu contraseña?
        </Text>
        <Text style={styles.linkText} onPress={() => { /* Navegación futura */ }}>
          ¿No tienes cuenta? Registrarse
        </Text>
      </View>
    </View>
  );
}
