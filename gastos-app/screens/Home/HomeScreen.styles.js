import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const BORDER_RADIUS = 12;

export default StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: COLORS.background,
  paddingHorizontal: 10,
  paddingTop: 10,
},
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  summary: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    marginBottom: 20,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginVertical: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBackground,
    padding: 14,
    borderRadius: BORDER_RADIUS,
    marginBottom: 10,
  },
  expenseText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  expenseAmount: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  noDataText: {
  textAlign: 'center',
  marginTop: 20,
  color: COLORS.textSecondary,
  fontSize: 16,
},
});
