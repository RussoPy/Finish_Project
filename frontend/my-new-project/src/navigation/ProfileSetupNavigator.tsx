// src/navigation/ProfileSetupNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleStep from '../profile/RoleStep';

// —— Worker steps ——
import AgeStep from '../profile/worker/AgeStep';
import LocationStep from '../profile/worker/LocationStep';
import ProfilePictureStep from '../profile/worker/ProfilePictureStep';
import SkillSelectionStep from '../profile/worker/SkillSelectionStep';
import PreferredTagsStep from '../profile/worker/PreferredTagsStep';
import JobPreferencesStep from '../profile/worker/JobPrefrencesStep';
import IndustryPreferenceStep from '../profile/worker/IndustryPrefrencesStep';
import ExperienceStep from '../profile/worker/ExperienceStep';
import JobLocationStep from '../profile/worker/JobLocationStep';
import SalaryStep from '../profile/worker/SalaryStep';
import AvailabilityStep from '../profile/worker/AvailabilityStep';

// —— Business steps ——
import BusinessNameStep from '../profile/business/BusinessNameStep';
import BusinessLogoStep from '../profile/business/BusinessLogoStep';
import BusinessLocationStep from '../profile/business/BusinessLocationStep'; // Assuming same as worker location
import JobTitleStep from '../profile/business/JobTitleStep';
import JobDescriptionStep from '../profile/business/JobDescriptionStep';
import JobTagsStep from '../profile/business/JobTagsStep';
import JobSkillsStep from '../profile/business/JobSkillsStep';
import JobExperienceRequiredStep from '../profile/business/JobExperienceRequiredStep';
import JobAvailabilityStep from '../profile/business/JobAvailabilityStep';
import JobSalaryBusinessStep from '../profile/business/JobSalaryBusinessStep';
import JobBenefitsBusinessStep from '../profile/business/JobBenefitsBusinessStep';
import ConfirmPublishStep from '../profile/business/ConfirmPublishStep';

// —— ParamList definition ——  
export type ProfileSetupParamList = {
  Role: undefined;

  // Worker flow
  WorkerAge: undefined;
  WorkerLocation: undefined;
  WorkerProfilePicture: undefined;
  WorkerSkills: undefined;
  WorkerTags: undefined;
  WorkerJobPreferences: undefined;
  WorkerIndustry: undefined;
  WorkerExperience: undefined;
  WorkerJobLocation: undefined;
  WorkerSalary: undefined;
  WorkerAvailability: undefined;

  // Business flow
  BusinessName: undefined;
  BusinessLogo: undefined;
  BusinessLocation: undefined;
  JobTitle: undefined;
  JobDescription: undefined;
  JobTags: undefined;
  JobSkills: undefined;
  JobExperienceRequired: undefined;
  JobAvailability: undefined;
  JobLocationBusiness: undefined;
  JobSalaryBusiness: undefined;
  JobBenefitsBusiness: undefined;
  ConfirmPublish: undefined;
};

const Stack = createNativeStackNavigator<ProfileSetupParamList>();

export default function ProfileSetupNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Role"
    >
      {/* Role selection */}
      <Stack.Screen name="Role" component={RoleStep} />

      {/* — Worker flow — */}
      <Stack.Screen name="WorkerAge" component={AgeStep} />
      <Stack.Screen name="WorkerLocation" component={LocationStep} />
      <Stack.Screen name="WorkerProfilePicture" component={ProfilePictureStep} />
      <Stack.Screen name="WorkerSkills" component={SkillSelectionStep} />
      <Stack.Screen name="WorkerTags" component={PreferredTagsStep} />
      <Stack.Screen name="WorkerJobPreferences" component={JobPreferencesStep} />
      <Stack.Screen name="WorkerIndustry" component={IndustryPreferenceStep} />
      <Stack.Screen name="WorkerExperience" component={ExperienceStep} />
      <Stack.Screen name="WorkerJobLocation" component={JobLocationStep} />
      <Stack.Screen name="WorkerSalary" component={SalaryStep} />
      <Stack.Screen name="WorkerAvailability" component={AvailabilityStep} />

      {/* — Business flow — */}
      <Stack.Screen name="BusinessName" component={BusinessNameStep} />
      <Stack.Screen name="BusinessLocation" component={BusinessLocationStep} /> 
      <Stack.Screen name="BusinessLogo" component={BusinessLogoStep} />
      <Stack.Screen name="JobTitle" component={JobTitleStep} />
      <Stack.Screen name="JobDescription" component={JobDescriptionStep} />
      <Stack.Screen name="JobTags" component={JobTagsStep} />
      <Stack.Screen name="JobSkills" component={JobSkillsStep} />
      <Stack.Screen name="JobExperienceRequired" component={JobExperienceRequiredStep} />
      <Stack.Screen name="JobAvailability" component={JobAvailabilityStep} />
      {/* <Stack.Screen name="EmployeeDistance" component={EmployeeDistance} /> */}
      <Stack.Screen name="JobSalaryBusiness" component={JobSalaryBusinessStep} />
      <Stack.Screen name="JobBenefitsBusiness" component={JobBenefitsBusinessStep} />
      <Stack.Screen name="ConfirmPublish" component={ConfirmPublishStep} />
    </Stack.Navigator>
  );
}
