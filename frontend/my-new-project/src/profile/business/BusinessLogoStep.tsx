// src/profile/business/BusinessLogoStep.tsx

import * as React from 'react';
import { useState } from 'react';
import {
  View as RNView,
  Image,
  Pressable as RNPressable,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button, Text as PaperText } from 'react-native-paper';

// wrap RN primitives and PaperText so they accept className
const View = styled(RNView);
const Pressable = styled(RNPressable);
const Text = styled(PaperText);

type BusinessLogoNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'BusinessLogo'
>;

export default function BusinessLogoStep() {
  const navigation = useNavigation<BusinessLogoNavProp>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="2/12"
        progress={2 / 12}
        showBack
        showSkip={false}
      />

      <Text
        className="text-2xl font-bold"
        style={{ marginTop: spacing.xl + 40 }}
      >
        Business Logo
      </Text>

      <Pressable onPress={pickImage} className="self-center mb-6">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
          />
        ) : (
          <View className="w-30 h-30 rounded-full bg-gray-200 justify-center items-center">
            <Text className="text-gray-600">Choose Logo</Text>
          </View>
        )}
      </Pressable>

      {uploading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button
          mode="contained"
          disabled={!imageUri}
          onPress={() => navigation.navigate('JobTitle')}
          style={[
            globalStyles.button,
            {
              backgroundColor: imageUri ? colors.primary : colors.muted,
            },
          ]}
          contentStyle={globalStyles.buttonContent}
          labelStyle={{ color: 'white', fontWeight: '600' }}
        >
          Next
        </Button>
      )}
    </View>
  );
}
