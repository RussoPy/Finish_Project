// ✅ Card.tsx — isolated persistent swipeable card (using react-native-paper, NO scaling animation)
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  interpolate,
  runOnJS,
  withTiming,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { formatDistanceToNow } from 'date-fns';
import {
  Card as PaperCard,
  Text as PaperText,
  Chip as PaperChip,
  Avatar,
  useTheme,
  MD3Theme,
} from 'react-native-paper';
import { Job } from '../models/jobModel'; // Adjust path if needed

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface CardProps {
  job: Job;
  onSwipeLeft: (job: Job) => void;
  onSwipeRight: (job: Job) => void;
  onAfterSwipe: () => void;
  isTop: boolean;
}

type GestureContext = {
  startX: number;
};

export default function Card({ job, onSwipeLeft, onSwipeRight, onAfterSwipe, isTop }: CardProps) {
  const theme = useTheme<MD3Theme>();
  const translateX = useSharedValue(0);

  // --- Animation Logic (identical to previous versions) ---
  const rotateZ = useDerivedValue(() =>
    interpolate(translateX.value, [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2], [-10, 0, 10], Extrapolate.CLAMP)
  );
  const likeOpacity = useDerivedValue(() =>
    interpolate(translateX.value, [20, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP)
  );
  const nopeOpacity = useDerivedValue(() =>
    interpolate(translateX.value, [-SWIPE_THRESHOLD, -20], [1, 0], Extrapolate.CLAMP)
  );
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
      onStart: (_, ctx) => { ctx.startX = translateX.value; },
      onActive: (event, ctx) => { translateX.value = ctx.startX + event.translationX; },
      onEnd: (event) => {
          if (Math.abs(event.velocityX) < 500 && Math.abs(translateX.value) < SWIPE_THRESHOLD) {
              translateX.value = withTiming(0); return;
          }
          const velocityBasedThreshold = SWIPE_THRESHOLD * 0.5 + Math.abs(event.velocityX) * 0.1;
          const finalThreshold = Math.max(SWIPE_THRESHOLD, velocityBasedThreshold);
          const toX = (translateX.value > 0 ? 1 : -1) * SCREEN_WIDTH * 1.5;

          if (translateX.value > finalThreshold || (event.velocityX > 500 && translateX.value > 0)) {
              translateX.value = withTiming(toX, { duration: 300 }, () => {
                  runOnJS(onSwipeRight)(job); runOnJS(onAfterSwipe)();
              });
          } else if (translateX.value < -finalThreshold || (event.velocityX < -500 && translateX.value < 0)) {
              translateX.value = withTiming(toX, { duration: 300 }, () => {
                  runOnJS(onSwipeLeft)(job); runOnJS(onAfterSwipe)();
              });
          } else {
              translateX.value = withTiming(0);
          }
      },
  });
  const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [ { translateX: translateX.value }, { rotateZ: `${rotateZ.value}deg` } ],
  }));
  const likeStyle = useAnimatedStyle(() => ({ opacity: likeOpacity.value }));
  const nopeStyle = useAnimatedStyle(() => ({ opacity: nopeOpacity.value }));
  // --- End Animation Logic ---


  // Common Card Content Renderer (Unchanged)
  const renderCardContent = (isPlaceholder = false) => (
    <PaperCard style={[styles.cardBase, isPlaceholder && styles.nextCardVisual]}>
        <PaperCard.Title
            title={job.title}
            subtitle={`@ ${job.business_name || 'Unknown Company'}`}
            titleStyle={styles.cardTitle}
            subtitleStyle={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}
            left={(props) =>
                job.logo_url ? (
                    <Avatar.Image {...props} size={48} source={{ uri: job.logo_url }} style={styles.avatar} />
                ) : (
                    <Avatar.Icon {...props} size={48} icon="domain" style={styles.avatar} />
                )
            }
        />
        <PaperCard.Content>
            {/* Details */}
            <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={18} color={theme.colors.primary} style={styles.icon} />
                <PaperText variant="bodyMedium" style={styles.detailText} numberOfLines={1}>
                    {job.salary_min && job.salary_max ? `$${job.salary_min} – $${job.salary_max}` : 'Salary not specified'}
                </PaperText>
            </View>
            <View style={styles.detailRow}>
                <Ionicons name="briefcase-outline" size={18} color={theme.colors.primary} style={styles.icon} />
                <PaperText variant="bodyMedium" style={styles.detailText} numberOfLines={1}>
                    {job.experience_required || 'Experience not specified'}
                </PaperText>
            </View>
            <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color={theme.colors.primary} style={styles.icon} />
                <PaperText variant="bodyMedium" style={styles.detailText} numberOfLines={1}>
                    {job.location_lat === 0 && job.location_lng === 0 ? 'Remote' : 'On-site / Hybrid'}
                </PaperText>
            </View>
            {/* Skills */}
            {job.skills_needed && job.skills_needed.length > 0 && (
                <View style={styles.tagsContainer}>
                    {job.skills_needed.slice(0, 5).map((skill: string) => (
                        <PaperChip key={skill} style={styles.chip} textStyle={styles.chipText} mode="outlined">
                            {skill}
                        </PaperChip>
                    ))}
                    {job.skills_needed.length > 5 && ( <PaperChip style={styles.chip} textStyle={styles.chipText} mode="outlined">...</PaperChip> )}
                </View>
            )}
            {/* Footer */}
            <PaperText variant="bodySmall" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                Posted {job.created_at ? formatDistanceToNow(job.created_at.toDate?.() || new Date(job.created_at), { addSuffix: true }) : 'recently'}
            </PaperText>
        </PaperCard.Content>
    </PaperCard>
  );


  // *** Conditional Rendering Logic (Unchanged) ***
  if (isTop) {
    // Render the interactive top card
    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContainer, styles.topCardContainer, animatedCardStyle]}>
          {renderCardContent()}
          {/* Swipe labels */}
          <Animated.View style={[styles.labelContainer, styles.likeLabel, likeStyle]}>
            <PaperText style={[styles.labelText, styles.likeLabelText]}>LIKE</PaperText>
          </Animated.View>
          <Animated.View style={[styles.labelContainer, styles.nopeLabel, nopeStyle]}>
            <PaperText style={[styles.labelText, styles.nopeLabelText]}>NOPE</PaperText>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  } else {
    // Render the non-interactive card underneath
    return (
        // Use the updated nextCardContainer style (no scale/translate)
        <View style={[styles.cardContainer, styles.nextCardContainer]}>
            {renderCardContent(true)}
        </View>
    );
  }
}

// --- Styles ---
const styles = StyleSheet.create({
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 3 / 4,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  topCardContainer: {
     zIndex: 1,
  },
  // --- MODIFIED STYLE ---
  nextCardContainer: {
    zIndex: 0, // CRUCIAL: Ensure it's below the top card
    // transform: [{ scale: 0.95 }, {translateY: 10}], // REMOVED: No scaling or translation
  },
  // --- END MODIFICATION ---
  cardBase: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 4,
    overflow: 'hidden',
  },
  nextCardVisual: {
     opacity: 0.95, // Kept a very slight opacity difference for depth perception
     elevation: 2,
  },
  // --- Content Styles (Unchanged) ---
  avatar: { backgroundColor: 'transparent', },
  cardTitle: { fontWeight: 'bold', fontSize: 20, },
  cardSubtitle: { fontSize: 14, marginTop: -4, },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 16, },
  icon: { marginRight: 10, },
  detailText: { flex: 1, fontSize: 15, },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 10, paddingHorizontal: 16, },
  chip: { marginRight: 6, marginBottom: 6, },
  chipText: { fontSize: 12, },
  footerText: { marginTop: 'auto', paddingTop: 10, paddingBottom: 10, textAlign: 'center', fontSize: 12, },
  // --- Label Styles (Unchanged) ---
   labelContainer: { position: 'absolute', top: 40, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 3, backgroundColor: 'rgba(0,0,0,0.1)', },
   labelText: { fontSize: 28, fontWeight: 'bold', letterSpacing: 2, },
   likeLabel: { left: 20, borderColor: '#4CAF50', transform: [{ rotate: '-15deg' }], },
   likeLabelText: { color: '#4CAF50', },
   nopeLabel: { right: 20, borderColor: '#F44336', transform: [{ rotate: '15deg' }], },
   nopeLabelText: { color: '#F44336', },
});