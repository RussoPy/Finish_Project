// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

export const cardStyles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '85%',
    height: 400,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.m,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    zIndex: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  experience: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  salary: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.s,
  },
  tag: {
    backgroundColor: colors.lightTeal,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: colors.tealDark,
    fontWeight: '600',
    fontSize: 13,
  },
  label: {
    position: 'absolute',
    top: 20,
    padding: 10,
    borderWidth: 4,
    borderRadius: 10,
  },
  likeLabel: {
    left: 20,
    borderColor: colors.green,
  },
  nopeLabel: {
    right: 20,
    borderColor: colors.red,
  },
  labelText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  infoLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoValue: {
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footerText: {
    marginTop: 12,
    fontSize: 12,
    color: colors.info,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  logoSquare: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  
  detailText: {
    fontSize: 14,
    color: '#444',
  },
});

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
  infoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 6,
  gap: 8,
},
infoLabel: {
  fontWeight: '600',
  color: colors.textPrimary,
},
infoValue: {
  color: colors.textSecondary,
},
description: {
  fontSize: 14,
  color: colors.textSecondary,
  marginBottom: 12,
},
footerText: {
  marginTop: 12,
  fontSize: 12,
  color: colors.info,
}
  
});

export default globalStyles;



