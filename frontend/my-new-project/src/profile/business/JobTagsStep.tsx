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

type JobTagsNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobTags'
>;

const tagOptions = [
  'React', 'Node.js', 'UI/UX', 'AWS', 'TypeScript'
];

export default function JobTagsStep() {
  const navigation = useNavigation<JobTagsNavProp>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="5/12"
        progress={5 / 12}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40 }}>
        Job Tags
      </Text>

      <ScrollView contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: spacing.l,
        paddingBottom: spacing.l,
      }}>
        {tagOptions.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Pressable
              key={tag}
              className={
                `px-4 py-2 mb-2 mr-2 rounded-full border ` +
                (isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300')
              }
              onPress={() => toggleTag(tag)}
            >
              <Text className={isSelected ? 'text-white' : 'text-primary'}>
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Button
        mode="contained"
        disabled={selectedTags.length === 0}
        onPress={() => navigation.navigate('JobSkills')}
        style={[
          globalStyles.button,
          { backgroundColor: selectedTags.length > 0 ? colors.primary : colors.muted }
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </View>
  );
}