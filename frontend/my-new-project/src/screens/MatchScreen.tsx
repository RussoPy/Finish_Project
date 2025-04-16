import { styled } from 'nativewind';
import { View as RNView, Text as RNText } from 'react-native';
import { IconButton } from 'react-native-paper';

const View = styled(RNView);
const Text = styled(RNText);

export default function MatchScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-orange-50">
      <IconButton icon="gesture-swipe-horizontal" size={48} />
      <Text className="text-xl font-bold text-orange-600 mt-2">Swipe to Match</Text>
      <Text className="text-gray-600 mt-1">Discover jobs or talent by swiping</Text>
    </View>
  );
}
