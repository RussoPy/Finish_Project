// ✅ Card.tsx — isolated persistent swipeable card
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  interpolate,
  runOnJS,
  withSpring,
  withTiming,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const SWIPE_THRESHOLD = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Card({ job, onSwipeLeft, onSwipeRight, onAfterSwipe, isTop }: any) {
  const translateX = useSharedValue(0);

  const rotateZ = useDerivedValue(() =>
    interpolate(translateX.value, [-200, 0, 200], [-15, 0, 15])
  );

  const likeOpacity = useDerivedValue(() =>
    interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP)
  );

  const nopeOpacity = useDerivedValue(() =>
    interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP)
  );

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const velocity = translateX.value > 0 ? 500 : -500;
      const toX = translateX.value > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
  
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(toX, { duration: 300 }, () => {
          runOnJS(onSwipeRight)(job);
          runOnJS(onAfterSwipe)();  // ✅ delay index++
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(toX, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)(job);
          runOnJS(onAfterSwipe)();  // ✅ delay index++
        });
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
    transform: [{ rotate: '-20deg' }],
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
    transform: [{ rotate: '20deg' }],
  }));

  return isTop ? (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <Animated.View style={[styles.label, styles.likeLabel, likeStyle]}>
          <Text style={styles.labelText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.label, styles.nopeLabel, nopeStyle]}>
          <Text style={styles.labelText}>NOPE</Text>
        </Animated.View>
        <Text style={styles.title}>{job.title}</Text>
        <Text>{job.experience_required}</Text>
        <Text style={{ marginTop: 8 }}>💰 ${job.salary_min} - ${job.salary_max}</Text>
        <Text numberOfLines={2} style={styles.tags}>
          {job.tags.map((tag: string) => `#${tag}`).join('  ')}
        </Text>
      </Animated.View>
    </PanGestureHandler>
  ) : (
    <View style={[styles.card, styles.nextCard]}>
      <Text style={styles.title}>{job.title}</Text>
      <Text>{job.experience_required}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '85%',
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  },
  tags: {
    marginTop: 8,
    color: '#555',
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
    borderColor: '#4cd964',
  },
  nopeLabel: {
    right: 20,
    borderColor: '#ff3b30',
  },
  labelText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
});
