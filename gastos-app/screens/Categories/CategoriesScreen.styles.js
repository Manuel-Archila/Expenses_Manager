import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const BORDER_RADIUS = 12;

export default StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: COLORS.background,
    padding: 20,
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: COLORS.inputBackground,
    padding: 14,
    borderRadius: BORDER_RADIUS,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
    actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginRight: 10,
    color: COLORS.textPrimary,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    padding: 10,
    borderRadius: BORDER_RADIUS,
  },
  row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
confirmButton: {
  backgroundColor: COLORS.success,
  padding: 10,
  borderRadius: 8,
  marginLeft: 10,
},

});
