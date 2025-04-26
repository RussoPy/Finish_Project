// src/profile/business/JobDescriptionStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    // StyleSheet removed - will use inline/global styles only
    Alert
    // ScrollView removed - not suitable for strict vertical centering
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator'; // Adjust if needed

// Import Firestore functions and auth/db
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../api/firebase';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

// Navigation Prop Type (adjust if needed)
type JobDescriptionNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobDescription'
>;

export default function JobDescriptionStep() {
    const navigation = useNavigation<JobDescriptionNavProp>();
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleNext = async () => {
        const trimmedDescription = description.trim();
        if (!trimmedDescription) {
            Alert.alert('Missing Description', 'Please enter a job description.');
            return;
        }
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);
        try {
            // Saving to the user document under 'job_description' field.
            const dataToUpdate = {
                job_description: trimmedDescription, // Assumed field name
                last_updated_at: Timestamp.now()
            };
            const userDocRef = doc(db, 'users', uid);
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job description.`);
            navigation.navigate('JobTags'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the job description. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        // Use KAV, apply base container style but ensure content starts from top
        <KeyboardAvoidingView
            // Use globalStyles.container for padding/background
            // Override justifyContent to allow header at top, content centered below
            style={[globalStyles.container, { justifyContent: 'flex-start' }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            {/* Header remains fixed at the top */}
            <ProfileNavHeader
                stepText="5/12" // *** Adjust Step Number ***
                progress={5 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={false}
            />

            {/* Content Wrapper for Vertical Centering */}
            <View style={{
                flex: 1, // Take remaining vertical space
                width: '100%', // Use full width (respecting parent padding)
                justifyContent: 'center', // Center children vertically
                alignItems: 'center', // Center children horizontally
            }}>
                {/* Title */}
                <Text style={[
                    globalStyles.title,
                    // Adjust margins for spacing within the centered group
                    { marginBottom: spacing.xl }
                ]}>
                    Job Description
                </Text>

                {/* Input - Note: Vertical centering might be awkward for long text */}
                <TextInput
                    label="Detailed Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the role, responsibilities, requirements, benefits, etc."
                    mode="outlined"
                    multiline={true}
                    numberOfLines={6} // Suggest initial size
                    textAlignVertical="top"
                    style={{
                        width: '100%', // Full width
                        marginBottom: spacing.l, // Space below input
                        minHeight: 120, // Set a min-height
                        // Consider maxHeight or removing if centering causes issues
                        // maxHeight: 200,
                        // Use background from colors if needed, e.g., backgroundColor: colors.white
                    }}
                    disabled={isSaving}
                />

                {/* Button */}
                <Button
                    mode="contained"
                    disabled={!description.trim() || isSaving}
                    onPress={handleNext}
                    loading={isSaving}
                    style={{ // Apply styles directly, referencing globals where possible
                        width: '100%', // Full width
                        borderRadius: 30, // Assuming from globalStyles.button
                        marginTop: spacing.m, // Space above button
                        backgroundColor: description.trim() ? colors.primary : colors.muted
                    }}
                    contentStyle={globalStyles.buttonContent} // Use global content padding
                    labelStyle={{ color: colors.white, fontWeight: '600' }} // Use colors from theme
                >
                    {isSaving ? 'Saving...' : 'Next'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}