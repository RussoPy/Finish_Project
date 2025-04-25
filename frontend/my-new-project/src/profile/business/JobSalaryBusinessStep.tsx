// src/profile/business/JobSalaryBusinessStep.tsx

import * as React from 'react';
import { useState } from 'react';
import {
  View as RNView,
  TextInput as RNTextInput,
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
const Text = styled(PaperText);
const TextInput = styled(RNTextInput);

type JobSalaryBusinessNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobSalaryBusiness'
>;

export default function JobSalaryBusinessStep() {
  const navigation = useNavigation<JobSalaryBusinessNavProp>();
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const isValid = minSalary !== '' && !isNaN(parseInt(minSalary));

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="10/12"
        progress={10 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Salary Range (₪)
      </Text>

      <TextInput
        className="w-full bg-white rounded-lg border border-gray-300 p-4 mt-4"
        placeholder="Minimum Salary"
        keyboardType="numeric"
        value={minSalary}
        onChangeText={setMinSalary}
      />

      <TextInput
        className="w-full bg-white rounded-lg border border-gray-300 p-4 mt-4 mb-6"
        placeholder="Maximum Salary (optional)"
        keyboardType="numeric"
        value={maxSalary}
        onChangeText={setMaxSalary}
      />

      <Button
        mode="contained"
        disabled={!isValid}
        onPress={() => navigation.navigate('JobBenefitsBusiness')}
        style={[
          globalStyles.button,
          { backgroundColor: isValid ? colors.primary : colors.muted },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </View>
  );
}
