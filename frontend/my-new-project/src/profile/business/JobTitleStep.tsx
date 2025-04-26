// src/profile/business/JobTitleStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Alert // Import Alert for error messages
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';

// Import Firestore functions and auth/db
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../api/firebase';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
// NOTE: We don't need the BusinessModel import just to update a field

// Navigation Prop Type
type JobTitleNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobTitle'
>;

export default function JobTitleStep() {
    const navigation = useNavigation<JobTitleNavProp>();
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Add loading state

    // --- Modified handleNext function ---
    const handleNext = async () => {
        const trimmedTitle = title.trim();

        // 1. Validate Input
        if (!trimmedTitle) {
            Alert.alert('Missing Title', 'Please enter a job title.');
            return;
        }

        // 2. Get User ID
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            console.error("User not authenticated in JobTitleStep");
            return;
        }

        setIsSaving(true); // Start loading indicator

        try {
            // 3. Prepare Data Payload
            // As requested: saving to the user document under 'job_title' field.
            // Consider if this field name and location (user doc) is correct for your overall data structure,
            // especially if this is for posting a job rather than the business user's own title.
            const dataToUpdate = {
                job_title: trimmedTitle, // Field name as requested
                last_updated_at: Timestamp.now() // Update timestamp
            };

            // 4. Get Firestore Document Reference in 'users' collection
            const userDocRef = doc(db, 'users', uid);

            // 5. Perform Firestore Update
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job title.`);

            // 6. Navigate on success
            navigation.navigate('JobDescription'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the job title. Please try again.');
        } finally {
            setIsSaving(false); // Stop loading indicator regardless of outcome
        }
    }
    // --- End of modified handleNext function ---

    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <ProfileNavHeader
                stepText="4/12" // *** Adjust Step Number ***
                progress={4 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={false}
            />

            <View style={styles.contentWrapper}>
                <Text style={[
                    globalStyles.title,
                    { marginBottom: spacing.xl }
                ]}>
                    What's the Job Title?
                </Text>

                <TextInput
                    label="Job Title"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Frontend Developer"
                    mode="outlined"
                    style={[
                        { width: '100%', marginBottom: spacing.xl }
                    ]}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                    maxLength={100}
                    disabled={isSaving} // Disable input while saving
                />

                <Button
                    mode="contained"
                    // Disable button if title is empty OR if saving is in progress
                    disabled={!title.trim() || isSaving}
                    onPress={handleNext}
                    loading={isSaving} // Show loading indicator on button
                    style={[
                        {
                            width: '100%',
                            borderRadius: 30,
                            backgroundColor: title.trim() ? colors.primary : colors.muted
                        }
                    ]}
                    contentStyle={globalStyles.buttonContent}
                    labelStyle={{ color: colors.white, fontWeight: '600' }}
                >
                    {isSaving ? 'Saving...' : 'Next'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    contentWrapper: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});