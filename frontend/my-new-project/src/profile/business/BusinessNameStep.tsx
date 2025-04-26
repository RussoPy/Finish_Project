// src/profile/business/BusinessNameStep.tsx

import * as React from 'react';
import { useState } from 'react';
import { View as RNView, TextInput as RNTextInput } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button, Text } from 'react-native-paper';

const View = styled(RNView);
const TextInput = styled(RNTextInput);

// ① Navigation prop typed to this screen
type BusinessNameNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'BusinessName'
>;

export default function BusinessNameStep() {
  const navigation = useNavigation<BusinessNameNavProp>();
  const [businessName, setBusinessName] = useState('');

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="1/12"
        progress={1 / 12}
        showBack={false}
        showSkip={false}
      />

      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        Your Name / Business Name ? 
      </Text>

      <TextInput
        placeholder="Enter your business name"
        value={businessName}
        onChangeText={setBusinessName}
        style={{
          height: 48,
          backgroundColor: '#fff',
          borderRadius: 12,
          borderColor: colors.muted,
          borderWidth: 1,
          paddingHorizontal: spacing.m,
          marginVertical: spacing.l,
        }}
      />

      <Button
        mode="contained"
        disabled={!businessName}
        onPress={() => navigation.navigate('BusinessLocation')}
        style={[
          globalStyles.button,
          {
            backgroundColor: businessName
              ? colors.primary
              : colors.muted,
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
