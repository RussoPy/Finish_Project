import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, storage, db } from '../../api/firebase';
import Toast from 'react-native-toast-message';

export default function ProfileImageEditor({ imageUri, onChange }: { imageUri: string; onChange: (url: string) => void }) {
  const handleSelectProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const file = await fetch(result.assets[0].uri);
      const blob = await file.blob();

      const imageRef = ref(storage, `profile_images/${uid}.jpg`);
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, 'users', uid), { profileImage: downloadURL });

      onChange(downloadURL);
      Toast.show({ type: 'success', text1: 'Profile picture updated!' });
    }
  };

  return (
    <TouchableOpacity onPress={handleSelectProfileImage}>
      <Image
        source={{ uri: imageUri || 'https://placehold.co/64x64' }}
        style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
      />
    </TouchableOpacity>
  );
}
