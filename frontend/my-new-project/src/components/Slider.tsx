import React, { useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import globalStyles from '../styles/globalStyles';

// === Configurable Constants ===
const THUMB_SIZE = 18; // visible size of thumb
const DRAG_DECAY_MULTIPLIER = 0.5;
const SLIDE_DURATION = 20;
const TAP_ANIMATION_DURATION = 100;
const FILL_ADJUST = THUMB_SIZE / 2;

interface DistanceSliderProps {
  onValueChange: (val: number) => void;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export default function DistanceSlider({
  onValueChange,
  initialValue = 10,
  min = 5,
  max = 50,
  step = 1,
}: DistanceSliderProps) {
  const [trackWidth, setTrackWidth] = useState(300);
  const SLIDER_RANGE = trackWidth - THUMB_SIZE;

  const percentage = (initialValue - min) / (max - min);
  const x = useSharedValue(percentage * SLIDER_RANGE);

  const gesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      x.value = Math.min(Math.max(0, x.value + e.translationX), SLIDER_RANGE);
    })
    .onEnd((e) => {
      const velocity = e.velocityX * DRAG_DECAY_MULTIPLIER;
      x.value = withDecay({ velocity, clamp: [0, SLIDER_RANGE] });

      const raw = min + (x.value / SLIDER_RANGE) * (max - min);
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.min(max, Math.max(min, stepped));
      const newX = ((clamped - min) / (max - min)) * SLIDER_RANGE;
      x.value = withTiming(newX, { duration: SLIDE_DURATION });
      runOnJS(onValueChange)(clamped);
    });

  const tapGesture = Gesture.Tap()
    .onEnd((e) => {
      const tapX = Math.min(Math.max(0, e.x - THUMB_SIZE / 2), SLIDER_RANGE);
      x.value = withTiming(tapX, { duration: TAP_ANIMATION_DURATION });

      const raw = min + (tapX / SLIDER_RANGE) * (max - min);
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.min(max, Math.max(min, stepped));
      runOnJS(onValueChange)(clamped);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: x.value + FILL_ADJUST,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
  };

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={globalStyles.sliderWrapper}>
        <View style={globalStyles.sliderTrack} onLayout={handleLayout}>
          <Animated.View style={[globalStyles.sliderFill, fillStyle]} />
          <GestureDetector gesture={gesture}>
            <Animated.View
              style={[
                globalStyles.sliderThumb,
                { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2 },
                thumbStyle,
              ]}
            />
          </GestureDetector>
        </View>
      </View>
    </GestureDetector>
  );
}