// src/profile/business/BusinessLogoStep.tsx

import React, { useState } from 'react';
import {
    View,
    Image,
    Pressable,
    ActivityIndicator,
    Alert,
    Keyboard,
    Platform
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
// Import auth along with db and storage
import { auth, db, storage } from '../../api/firebase';
// Remove useRoute and RouteProp imports
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Business } from '../../models/BusinessModel'; // Corrected model import

// Navigation Prop Type remains the same or adjust as needed
type BusinessLogoNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'BusinessLogo'
>;


export default function BusinessLogoStep() {
    const navigation = useNavigation<BusinessLogoNavProp>();
    // Remove useRoute and businessId extraction from params

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        // --- Get businessId from auth.currentUser.uid ---
        const businessId = auth.currentUser?.uid;

        // Check if user is logged in (which also means businessId is available)
        if (!businessId) {
            Alert.alert('Error', 'You must be logged in to upload a logo.');
            console.error("User not authenticated in BusinessLogoStep");
            return;
        }
        if (!imageUri) {
            Alert.alert('No Image', 'Please select a logo to upload.');
            return;
        }

        setUploading(true);
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileExtension = imageUri.split('.').pop() || 'jpg';
  
          // Use the UID for the Storage path (remains logical for organization)
          const storagePath = `businessLogos/${businessId}.${fileExtension}`;
          const storageRef = ref(storage, storagePath);
  
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
  
          // --- Firestore Update Logic ---
          // 1. Get the document reference in the 'users' collection using the UID
          const userDocRef = doc(db, 'users', businessId); // 'businessId' here is auth.currentUser.uid
  
          // 2. Prepare the data object to update.
          //    This assumes the 'users' document has a 'logo_url' field
          //    when the user's role is 'Business'.
          const dataToUpdate = {
              logo_url: downloadUrl,        // The field to update within the user document
              last_updated_at: Timestamp.now() // Update the timestamp
              // Note: We don't need the full Business interface here, just the fields to update
          };
  
          // 3. Update the user document
          await updateDoc(userDocRef, dataToUpdate);
  
          console.log(`User document ${businessId} updated with logo URL.`);
          // *** Adjust 'JobTitle' to your actual next route name ***
          navigation.navigate('JobTitle');

        } catch (err: any) {
            console.error("Upload failed:", err);
            Alert.alert('Upload Failed', err.message || 'Could not upload the logo.');
        } finally {
            setUploading(false);
        }
    };

    const handleSkip = () => {
        // *** Adjust 'JobTitle' to your actual next route name ***
        navigation.navigate('JobTitle');
    }

    return (
        <View style={[
            globalStyles.container,
            {
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Platform.OS === 'android' ? spacing.l : spacing.xl + 20
            }
        ]}>
            <ProfileNavHeader
                stepText="3/12" // *** Adjust Step Number ***
                progress={3 / 12} // *** Adjust Progress ***
                onSkip={handleSkip}
                showSkip={true}
                showBack={true}
            />

            <Text style={[
                globalStyles.title,
                {
                    marginTop: spacing.xl,
                    marginBottom: spacing.l
                }
            ]}>
                Upload your{' '}
                <Text style={{ color: colors.secondary }}>business logo?</Text>
            </Text>

            <Pressable
                onPress={pickImage}
                style={{ alignSelf: 'center', marginTop: spacing.xl }}
            >
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 70,
                            marginBottom: spacing.l,
                            backgroundColor: colors.lightGray,
                        }}
                    />
                ) : (
                    <View style={{
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                        backgroundColor: colors.muted,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: spacing.l,
                    }}>
                        <Text style={{
                            color: colors.primary,
                            fontWeight: '500',
                        }}>
                            Choose Logo
                        </Text>
                    </View>
                )}
            </Pressable>

            {uploading ? (
                <ActivityIndicator
                    size="large"
                    color={colors.secondary}
                    style={{
                        position: 'absolute',
                        bottom: spacing.xl,
                        alignSelf: 'center'
                     }}
                />
            ) : (
                <Button
                    mode="contained"
                    onPress={handleUpload}
                    // Disable only if no image is selected (user login check happens in handleUpload)
                    disabled={!imageUri}
                    style={[
                        globalStyles.button,
                        // Use primary color if image is selected, otherwise muted
                        { backgroundColor: imageUri ? colors.primary : colors.muted },
                    ]}
                    contentStyle={globalStyles.buttonContent}
                    labelStyle={{ color: colors.white, fontWeight: '600' }}
                >
                    Next
                </Button>
            )}
        </View>
    );
}