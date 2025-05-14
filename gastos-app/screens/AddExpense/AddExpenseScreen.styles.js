import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const BORDER_RADIUS = 12;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding:20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.inputBackground,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  selected: {
    backgroundColor: COLORS.primary,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  dropdown: {
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.inputBackground,
    marginBottom: 20,
    zIndex: 100, // importante para que no lo tape otro componente
  },
  dropdownContainer: {
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#fff',
    zIndex: 1000, // más alto que el modal del teclado
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: 16,
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
