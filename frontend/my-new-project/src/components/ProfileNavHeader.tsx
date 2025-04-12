import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { styled } from 'nativewind';

const HeaderContainer = styled(View);

type Props = {
    onSkip?: () => void;
    showBack?: boolean;
    showSkip?: boolean;
  };
  

export function ProfileNavHeader({
    onSkip,
    showBack = true,
    showSkip = true,
  }: Props) {
    const navigation = useNavigation<any>();

  return (
    <HeaderContainer className="absolute top-10 left-5 right-5 flex-row justify-between items-center z-50">
    {showBack ? (
      <Pressable onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color="#1e3a8a" />
      </Pressable>
    ) : (
      <View />
    )}

    {showSkip ? (
      <Pressable onPress={onSkip}>
        <Feather name="arrow-right" size={24} color="#1e3a8a" />
      </Pressable>
    ) : (
      <View />
    )}
  </HeaderContainer>
);
}
