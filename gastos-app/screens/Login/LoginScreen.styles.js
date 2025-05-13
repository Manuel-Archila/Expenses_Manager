import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const BORDER_RADIUS = 12;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.accent,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.accent,
    fontSize: 14,
    marginVertical: 6,
  },
});
