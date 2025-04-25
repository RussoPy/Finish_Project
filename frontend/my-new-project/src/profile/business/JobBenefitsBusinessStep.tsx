// src/profile/business/JobBenefitsBusinessStep.tsx

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

type JobBenefitsNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobBenefitsBusiness'
>;

const benefitOptions = [
  'Health Insurance',
  'Paid Time Off',
  'Stock Options',
  'Remote Work',
  'Flexible Hours',
  'Retirement Plan',
];

export default function JobBenefitsBusinessStep() {
  const navigation = useNavigation<JobBenefitsNavProp>();
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  function toggleBenefit(benefit: string) {
    setSelectedBenefits(prev =>
      prev.includes(benefit)
        ? prev.filter(b => b !== benefit)
        : [...prev, benefit]
    );
  }

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="11/12"
        progress={11 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Benefits & Perks
      </Text>

      <ScrollView contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: spacing.l,
        paddingBottom: spacing.l,
      }}>
        {benefitOptions.map(benefit => {
          const isSelected = selectedBenefits.includes(benefit);
          return (
            <Pressable
              key={benefit}
              className={
                `px-4 py-2 mb-2 mr-2 rounded-full border ` +
                (isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300')
              }
              onPress={() => toggleBenefit(benefit)}
            >
              <Text className={isSelected ? 'text-white' : 'text-primary'}>
                {benefit}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Button
        mode="contained"
        disabled={selectedBenefits.length === 0}
        onPress={() => navigation.navigate('ConfirmPublish')}
        style={[
          globalStyles.button,
          {
            backgroundColor:
              selectedBenefits.length > 0 ? colors.primary : colors.muted,
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
