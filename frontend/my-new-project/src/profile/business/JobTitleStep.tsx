// src/profile/business/JobTitleStep.tsx

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

type JobTitleNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobTitle'
>;

export default function JobTitleStep() {
  const navigation = useNavigation<JobTitleNavProp>();
  const [title, setTitle] = useState('');

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="3/12"
        progress={3 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Job Title
      </Text>

      <TextInput
        className="w-full bg-white rounded-lg border border-gray-300 p-4 mt-4"
        placeholder="e.g. Frontend Developer"
        value={title}
        onChangeText={setTitle}
      />

      <Button
        mode="contained"
        disabled={!title}
        onPress={() => navigation.navigate('JobDescription')}
        style={[
          globalStyles.button,
          { backgroundColor: title ? colors.primary : colors.muted },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </View>
  );
}
