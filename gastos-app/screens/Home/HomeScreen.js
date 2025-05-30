import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { PieChart } from 'react-native-chart-kit';
import styles from './HomeScreen.styles';
import COLORS from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMonthlySummary } from '../../services/expensesService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await getMonthlySummary();
      setSummary(res.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSummary();
  };

  const chartData = summary?.by_category?.map(item => ({
    name: item.category,
    amount: item.amount,
    color: item.color || COLORS.primary,
    legendFontColor: COLORS.textSecondary,
    legendFontSize: 14,
  })) || [];

  const recentExpenses = summary?.recent_expenses || [];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hola, {user?.name || 'Usuario'} 👋</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Gasto total este mes:</Text>
          <Text style={styles.summaryValue}>
            Q {summary?.total?.toFixed(2) || '0.00'}
          </Text>
        </View>

        {chartData.length > 0 ? (
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
        ) : (
          <Text style={styles.noDataText}>No hay datos para mostrar en la gráfica.</Text>
        )}

        <Text style={styles.sectionTitle}>Últimos gastos</Text>

        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 30,
            paddingTop: 10,
          }}
          data={recentExpenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseText}>{item.description}</Text>
              <Text style={styles.expenseAmount}>
                Q {parseFloat(item.amount).toFixed(2)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noDataText}>No hay gastos registrados este mes.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
}
