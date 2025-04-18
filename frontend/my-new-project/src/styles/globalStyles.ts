// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.l,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: spacing.l,
    right: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.muted,
    marginHorizontal: spacing.m,
    borderRadius: 2,
  },
  progressFill: {
    width: '10%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepText: {
    fontSize: 14,
    color: colors.info,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.l,
    color: colors.primary,
  },
  highlightText: {
    color: colors.secondary,
  },
  input: {
    borderRadius: 12,
    marginBottom: spacing.s,
  },
  button: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.l,
    right: spacing.l,
    borderRadius: 30,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  sliderWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    backgroundColor: colors.primary,
  },
  sliderValue: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  sliderHitbox: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default globalStyles;
