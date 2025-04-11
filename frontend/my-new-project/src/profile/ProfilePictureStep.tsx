import { useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  Image,
  Pressable as RNPressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../api/firebase';
import { AppButton } from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';

const View = styled(RNView);
const Text = styled(RNText);
const Pressable = styled(RNPressable);

export default function ProfilePictureStep() {
  const navigation = useNavigation<any>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ['images']

    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !imageUri) return;

    try {
      setUploading(true);
      const res = await fetch(imageUri);
      const blob = await res.blob();
      const storageRef = ref(storage, `profilePics/${uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', uid), {
        profileImage: url,
      });

      navigation.navigate('SkillSelection');
    } catch (err: any) {
      Alert.alert('Upload failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-blue-50 px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Add a Profile Photo
      </Text>

      <Pressable onPress={pickImage}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 140, height: 140, borderRadius: 70, marginBottom: 20 }}
          />
        ) : (
          <View className="w-[140px] h-[140px] rounded-full bg-blue-200 justify-center items-center mb-6">
            <Text className="text-blue-800 font-semibold">Choose Photo</Text>
          </View>
        )}
      </Pressable>

      {uploading ? (
        <ActivityIndicator size="large" color="#0ea5e9" />
      ) : (
        <AppButton
          title="Save & Continue"
          onPress={handleUpload}
        />
      )}
    </View>
  );
}
