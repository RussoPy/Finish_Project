// src/screens/HomeScreen.tsx
import { Text as RNText, View as RNView } from 'react-native';
import { styled } from 'nativewind';

const View = styled(RNView);
const Text = styled(RNText);

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-orange-600">🏠 Welcome Home!</Text>
    </View>
  );
}
