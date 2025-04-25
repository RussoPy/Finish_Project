// src/profile/business/JobExperienceRequiredStep.tsx

import * as React from 'react';
import { useState } from 'react';
import {
  View as RNView,
  ScrollView as RNScrollView,
  Pressable as RNPressable,
} from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button, Text as PaperText } from 'react-native-paper';

const View = styled(RNView);
const ScrollView = styled(RNScrollView);
const Pressable = styled(RNPressable);
const Text = styled(PaperText);

type JobExperienceRequiredNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobExperienceRequired'
>;

const experienceOptions = [
  'Entry-level',
  '1-2 years',
  '3-5 years',
  '5+ years',
  'Senior',
];

export default function JobExperienceRequiredStep() {
  const navigation = useNavigation<JobExperienceRequiredNavProp>();
  const [selected, setSelected] = useState<string | null>(null);

  function selectOption(opt: string) {
    setSelected(opt);
  }

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="7/12"
        progress={7 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Experience Required
      </Text>

      <ScrollView contentContainerStyle={{
        paddingTop: spacing.l,
        paddingBottom: spacing.l,
      }}>
        {experienceOptions.map(opt => {
          const isSelected = selected === opt;
          return (
            <Pressable
              key={opt}
              className={`px-4 py-3 mb-3 rounded-lg border ${
                isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}
              onPress={() => selectOption(opt)}
            >
              <Text className={isSelected ? 'text-white' : 'text-primary'}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Button
        mode="contained"
        disabled={!selected}
        onPress={() => navigation.navigate('JobAvailability')}
        style={[
          globalStyles.button,
          {
            backgroundColor: selected ? colors.primary : colors.muted,
          },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </View>
  );
}
