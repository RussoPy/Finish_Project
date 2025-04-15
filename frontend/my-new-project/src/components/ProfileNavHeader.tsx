// src/components/ProfileNavHeader.tsx
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';

type Props = {
  onSkip?: () => void;
  showBack?: boolean;
  showSkip?: boolean;
  stepText?: string;       // e.g. "1/10"
  progress?: number;       // 0 to 1
};

export function ProfileNavHeader({
  onSkip,
  showBack = true,
  showSkip = true,
  stepText = '',
  progress = 0,
}: Props) {
  const navigation = useNavigation<any>();

  return (
    <View style={globalStyles.header}>
      {/* Left arrow */}
      {showBack ? (
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}

      {/* Progress bar */}
      <View style={globalStyles.progressBar}>
        <View
          style={[
            globalStyles.progressFill,
            { width: `${Math.min(progress * 100, 100)}%` },
          ]}
        />
      </View>

      {/* Step count */}
      <Text style={globalStyles.stepText}>{stepText}</Text>

      {/* Right arrow */}
      {showSkip ? (
        <Pressable onPress={onSkip}>
          <Feather name="arrow-right" size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}
