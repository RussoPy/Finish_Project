// src/components/AppButton.tsx
import { Text as RNText, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const Button = styled(RNTouchableOpacity);
const ButtonText = styled(RNText);

type Props = {
  title: string;
  onPress: () => void;
  bg?: string; // optional for dynamic background
};

export const AppButton = ({ title, onPress, bg = 'bg-slate-900' }: Props) => (
  <Button
    onPress={onPress}
    className={`p-4 rounded-xl w-full items-center mt-6 shadow-md ${bg}`}
  >
    <ButtonText className="text-white font-bold text-lg">{title}</ButtonText>
  </Button>
);
