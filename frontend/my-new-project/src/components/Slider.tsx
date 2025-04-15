import React, { useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

interface DistanceSliderProps {
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
}

const THUMB_SIZE = 12;
const HITBOX_SIZE = 23;

export default function DistanceSlider({
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  initialValue = 0,
}: DistanceSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [value, setValue] = useState(initialValue);

  const offset = useSharedValue(0);
  const startX = useSharedValue(0);
  const thumbScale = useSharedValue(1);

  const getValueFromOffset = (x: number) => {
    const pct = Math.min(Math.max(x / (trackWidth - THUMB_SIZE), 0), 1);
    const stepped = Math.round((pct * (max - min)) / step) * step + min;
    return stepped;
  };

  const getOffsetFromValue = (val: number) => {
    const pct = (val - min) / (max - min);
    return pct * (trackWidth - THUMB_SIZE);
  };

  useEffect(() => {
    if (trackWidth > 0) {
      offset.value = getOffsetFromValue(initialValue);
    }
  }, [trackWidth]);

  const handleGestureStart = () => {
    startX.value = offset.value;
    thumbScale.value = withSpring(1.2);
  };

  const handleGestureActive = (event: PanGestureHandlerGestureEvent) => {
    const rawX = startX.value + event.nativeEvent.translationX;
    const clampedX = Math.min(Math.max(rawX, 0), trackWidth - THUMB_SIZE);
    offset.value = clampedX;
    const val = getValueFromOffset(clampedX);
    runOnJS(setValue)(val);
    runOnJS(onValueChange)(val);
  };

  const handleGestureEnd = () => {
    const snapped = getValueFromOffset(offset.value);
    const newOffset = getOffsetFromValue(snapped);
    offset.value = withSpring(newOffset);
    thumbScale.value = withSpring(1);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }, { scale: thumbScale.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: offset.value + THUMB_SIZE / 2,
  }));

  return (
    <View style={globalStyles.sliderWrapper}>
      <View style={globalStyles.sliderTrack} onLayout={handleLayout}>
        <Animated.View style={[globalStyles.sliderFill, fillStyle]} />
        <PanGestureHandler
          onGestureEvent={handleGestureActive}
          onBegan={handleGestureStart}
          onEnded={handleGestureEnd}
        >
           <Animated.View
    style={[
      globalStyles.sliderHitbox,
      {
        width: HITBOX_SIZE,
        height: HITBOX_SIZE,
        top: -(HITBOX_SIZE - THUMB_SIZE) / 2 - 2,
      },
      thumbStyle,
    ]}
  >
    <View
      style={[
        globalStyles.sliderThumb,
        {
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2 ,
        },
      ]}
    />
  </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}
