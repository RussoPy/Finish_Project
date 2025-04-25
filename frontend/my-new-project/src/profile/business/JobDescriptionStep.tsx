// src/profile/business/JobDescriptionStep.tsx

import * as React from 'react';
import { useState } from 'react';
import {
  View as RNView,
  TextInput as RNTextInput,
  ScrollView,
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

type JobDescriptionNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobDescription'
>;

export default function JobDescriptionStep() {
  const navigation = useNavigation<JobDescriptionNavProp>();
  const [description, setDescription] = useState('');

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="4/12"
        progress={4 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Job Description
      </Text>

      <ScrollView contentContainerStyle={{ paddingTop: spacing.l }}>
        <TextInput
          className="w-full bg-white rounded-lg border border-gray-300 p-4"
          placeholder="Describe the role in detail"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </ScrollView>

      <Button
        mode="contained"
        disabled={!description.trim()}
        onPress={() => navigation.navigate('JobTags')}
        style={[
          globalStyles.button,
          {
            backgroundColor: description.trim() ? colors.primary : colors.muted,
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
