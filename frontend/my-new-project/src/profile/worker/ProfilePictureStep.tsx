import { useState } from 'react';
import {
  View,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../api/firebase';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button } from 'react-native-paper';

export default function ProfilePictureStep() {
  const navigation = useNavigation<any>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ['images'],
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

      navigation.navigate('WorkerSkills');
    } catch (err: any) {
      Alert.alert('Upload failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[globalStyles.container, { justifyContent: 'center' , alignItems: 'center' }]}>
      {/* 🔙 Header with Progress */}
      <ProfileNavHeader
        stepText="3/12"
        progress={3/12}
        onSkip={() => navigation.navigate('WorkerSkills')}
        showSkip={true}
        showBack={true}
      />

      {/* 🖼️ Title */}
      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        your <Text style={{ color: colors.secondary }}>profile photo?</Text>
      </Text>

      {/* 📸 Image Picker */}
      <Pressable onPress={pickImage} style={{ alignSelf: 'center' }}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              marginBottom: spacing.l,
            }}
          />
        ) : (
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: colors.muted,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.l,
            }}
          >
            <Text style={{ color: colors.primary, fontWeight: '500' }}>
              Choose Photo
            </Text>
          </View>
        )}
      </Pressable>

      {/* ⏳ Loader or Button */}
      {uploading ? (
        <ActivityIndicator size="large" color={colors.secondary} />
      ) : (
        <Button
          mode="contained"
          onPress={handleUpload}
          disabled={!imageUri}
          style={[
            globalStyles.button,
            {
              backgroundColor: imageUri ? colors.primary : colors.muted,
              position: 'absolute',
              bottom: 30,
              alignSelf: 'center',
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
