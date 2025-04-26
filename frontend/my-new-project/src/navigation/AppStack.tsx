// src/navigation/AppStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileSetupNavigator from './ProfileSetupNavigator';
import EditSkillsScreen from '../screens/editors/EditSkillsScreen';
import EditTagsScreen from '../screens/editors/EditTagsScreen';
import EditIndustryScreen from '../screens/editors/EditIndustryScreen';
import EditBenefits from '../screens/editors/jobeditors/EditBenefits';
import EditLocation from '../screens/editors/jobeditors/EditLocation';
import AvailabilityEditor from '../screens/editors/AvailabilityEditor';
import EditMinimumAge from '../screens/editors/jobeditors/EditMinimumAge';
import SalaryEditor from '../screens/editors/SalaryEditor';
import EditImages from '../screens/editors/jobeditors/EditImages';
import EditDescription from '../screens/editors/jobeditors/EditDescription';

export type AppStackParamList = {
  Home: undefined;
  ProfileSetup: undefined;
  EditSkills: { currentSkills: string[], onSave: (skills: string[]) => void };
  EditTags: { currentTags: string[], onSave: (tags: string[]) => void };
  EditIndustry: { currentIndustries: string[], onSave: (industries: string[]) => void };
  EditBenefits: { currentBenefits: string[], onSave: (benefits: string[]) => void };
  EditLocation: { currentAddress: string, onSave: (address: string) => void };
  AvailabilityEditor: { currentAvailability: string, onSave: (availability: string) => void };
  EditMinimumAge: { currentAge: string, onSave: (age: string) => void };
  SalaryEditor: { salaryMin: string, salaryMax: string, onSave: (min: string, max: string) => void };
  EditImages: { currentImages?: string[], onSave: (images: string[]) => void };
  EditDescription: { currentDescription: string, onSave: (description: string) => void };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupNavigator} />
      <Stack.Screen name="EditSkills" component={EditSkillsScreen} />
      <Stack.Screen name="EditTags" component={EditTagsScreen} />
      <Stack.Screen name="EditIndustry" component={EditIndustryScreen} />
      <Stack.Screen name="EditBenefits" component={EditBenefits} />
      <Stack.Screen name="EditLocation" component={EditLocation} />
      <Stack.Screen name="AvailabilityEditor" component={AvailabilityEditor} />
      <Stack.Screen name="EditMinimumAge" component={EditMinimumAge} />
      <Stack.Screen name="SalaryEditor" component={SalaryEditor} />
      <Stack.Screen name="EditImages" component={EditImages} />
      <Stack.Screen name="EditDescription" component={EditDescription} />
    </Stack.Navigator>
  );
}