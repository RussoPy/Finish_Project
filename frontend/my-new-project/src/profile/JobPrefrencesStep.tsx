import { View as RNView, Text as RNText } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../components/AppButton';

const View = styled(RNView);
const Text = styled(RNText);

export default function JobPreferences() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 items-center justify-center bg-blue-50 px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-4 text-center">
        Let’s find your dream job
      </Text>
      <Text className="text-base text-blue-700 text-center mb-8">
        Just a few more questions to help us understand what you're looking for.
      </Text>

      <AppButton
        title="Continue"
        onPress={() => navigation.navigate('IndustryPrefrencesStep')}
      />
    </View>
  );
}
