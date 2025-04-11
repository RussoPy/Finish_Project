// src/navigation/ProfileSetupNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilePictureStep from '../profile/ProfilePictureStep';
import SkillSelectionStep from '../profile/SkillSelectionStep';
import PreferredTagsStep from '../profile/PreferredTagsStep';
import LocationStep from '../profile/LocationStep';
import SalaryStep from '../profile/SalaryStep';
import Agestep from '../profile/AgeStep';
import JobPreferencesStep from '../profile/JobPrefrencesStep';
import IndustryPrefrenceStep from '../profile/IndustryPrefrencesStep';
import ExperienceStep from '../profile/ExperienceStep';
import AvailabilityStep from '../profile/AvailabilityStep';
import JobLocationStep from '../profile/JobLocationStep';

const Stack = createNativeStackNavigator();

export default function ProfileSetupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfilePicture">
      <Stack.Screen name="Age" component={Agestep} />
      <Stack.Screen name="Location" component={LocationStep} />
      <Stack.Screen name="ProfilePicture" component={ProfilePictureStep} />
      <Stack.Screen name="SkillSelection" component={SkillSelectionStep} />
      <Stack.Screen name="TagPreferences" component={PreferredTagsStep} />
      <Stack.Screen name="JobPreferences" component={JobPreferencesStep} />       
      <Stack.Screen name="IndustryPrefrencesStep" component={IndustryPrefrenceStep} />  
      <Stack.Screen name="Experience" component={ExperienceStep} />  
      <Stack.Screen name="JobLocationStep" component={JobLocationStep} />
      <Stack.Screen name="Availability" component={AvailabilityStep} />
      <Stack.Screen name="Salary" component={SalaryStep} />
    </Stack.Navigator>
  );
}
