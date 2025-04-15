import { styled } from 'nativewind';
import { View as RNView, Text as RNText } from 'react-native';
import { IconButton } from 'react-native-paper';

const View = styled(RNView);
const Text = styled(RNText);

export default function ChatScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <IconButton icon="chat" size={48} />
      <Text className="text-xl font-bold text-blue-600 mt-2">Conversations</Text>
      <Text className="text-gray-600 mt-1">Your matches and chats will appear here</Text>
    </View>
  );
}
