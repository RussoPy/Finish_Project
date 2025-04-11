// src/navigation/ProfileSetupNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilePictureStep from '../profile/ProfilePictureStep';
import SkillSelectionStep from '../profile/SkillSelectionStep';
import JobPreferencesStep from '../profile/JobPreferencesStep';
import LocationStep from '../profile/LocationStep';
import SalaryStep from '../profile/SalaryStep';

const Stack = createNativeStackNavigator();

export default function ProfileSetupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfilePicture">
      <Stack.Screen name="ProfilePicture" component={ProfilePictureStep} />
      <Stack.Screen name="SkillSelection" component={SkillSelectionStep} />
      <Stack.Screen name="JobPreferences" component={JobPreferencesStep} />
      <Stack.Screen name="Location" component={LocationStep} />
      <Stack.Screen name="Salary" component={SalaryStep} />
    </Stack.Navigator>
  );
}
