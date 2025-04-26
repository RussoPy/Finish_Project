// src/profile/business/JobLocationBusinessStep.tsx

import * as React from 'react';
import { useState } from 'react';
import { View as RNView } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Text, Button } from 'react-native-paper';
import Slider from '../../components/Slider';

const View = styled(RNView);

type JobLocationBusinessNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobLocationBusiness'
>;

export default function JobLocationBusinessStep() {
  const navigation = useNavigation<JobLocationBusinessNavProp>();
  const [distance, setDistance] = useState<number>(10);

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="9/12"
        progress={9 / 12}
        showBack
        showSkip={false}
      />

      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        Job Distance (km)
      </Text>

      <View style={{ paddingHorizontal: spacing.l, marginVertical: spacing.l }}>
        <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: spacing.s }}>
          Max Distance: {distance} km
        </Text>
        <Slider
          initialValue={distance}
          onValueChange={(val) => setDistance(val)}
        />
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('JobSalaryBusiness')}
        style={[
          globalStyles.button,
          { backgroundColor: colors.primary },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </View>
  );
}
