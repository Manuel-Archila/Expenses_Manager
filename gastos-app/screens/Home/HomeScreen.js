import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { PieChart } from 'react-native-chart-kit';
import styles from './HomeScreen.styles';
import COLORS from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyExpenses = [
  { id: '1', description: 'Supermercado', amount: 150.25, category: 'Alimentos' },
  { id: '2', description: 'Gasolina', amount: 75.00, category: 'Transporte' },
  { id: '3', description: 'Netflix', amount: 12.99, category: 'Entretenimiento' },
];

const categoryColors = {
  Alimentos: '#F26419',
  Transporte: '#86BBD8',
  Entretenimiento: '#F6AE2D',
};

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const chartData = dummyExpenses.reduce((acc, item) => {
    const existing = acc.find((x) => x.name === item.category);
    if (existing) {
      existing.amount += item.amount;
    } else {
      acc.push({
        name: item.category,
        amount: item.amount,
        color: categoryColors[item.category] || COLORS.primary,
        legendFontColor: COLORS.textSecondary,
        legendFontSize: 14,
      });
    }
    return acc;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container}>
        <Text style={styles.greeting}>Hola, {user?.email || 'Usuario'} 👋</Text>

        <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Gasto total este mes:</Text>
            <Text style={styles.summaryValue}>Q 238.24</Text>
        </View>

        <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={180}
            chartConfig={{
            backgroundColor: '#fff',
            color: () => COLORS.textSecondary,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            hasLegend
        />

        <Text style={styles.sectionTitle}>Últimos gastos</Text>
        <FlatList
            data={dummyExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>{item.description}</Text>
                <Text style={styles.expenseAmount}>Q {item.amount.toFixed(2)}</Text>
            </View>
            )}
        />
        </View>
    </SafeAreaView>
  );
}
