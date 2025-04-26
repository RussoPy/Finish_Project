// src/profile/business/JobSkillsStep.tsx

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

type JobSkillsNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobSkills'
>;

const skillOptions = [
  'TypeScript', 'React', 'Node.js', 'Python',
  'AWS', 'Figma', 'SQL', 'Java', 'C#',
];

export default function JobSkillsStep() {
  const navigation = useNavigation<JobSkillsNavProp>();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  function toggleSkill(skill: string) {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="6/12"
        progress={6 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Required Skills
      </Text>

      <ScrollView contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: spacing.l,
        paddingBottom: spacing.l,
      }}>
        {skillOptions.map(skill => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <Pressable
              key={skill}
              className={
                `px-4 py-2 mb-2 mr-2 rounded-full border ` +
                (isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300')
              }
              onPress={() => toggleSkill(skill)}
            >
              <Text className={isSelected ? 'text-white' : 'text-primary'}>
                {skill}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Button
        mode="contained"
        disabled={selectedSkills.length === 0}
        onPress={() => navigation.navigate('JobExperienceRequired')}
        style={[
          globalStyles.button,
          {
            backgroundColor:
              selectedSkills.length > 0 ? colors.primary : colors.muted,
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
