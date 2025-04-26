// src/profile/business/JobAvailabilityStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView, // To display options
    Pressable,  // For option interaction
    // StyleSheet removed
    Alert
} from 'react-native';
import { Button, Text } from 'react-native-paper'; // Use Paper components
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
// Removed nativewind imports

// Navigation Prop Type (adjust if needed)
type JobAvailabilityNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobAvailability'
>;

// Availability Options
const availabilityOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary', // Added based on previous models
  'Flexible'
];


export default function JobAvailabilityStep() {
    const navigation = useNavigation<JobAvailabilityNavProp>();
    const [selected, setSelected] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    function selectOption(opt: string) {
        setSelected(opt);
    }

    // --- handleNext function with saving logic ---
    const handleNext = async () => {
        // 1. Validate Input
        if (!selected) {
           Alert.alert('Selection Required', 'Please select the job availability.');
           return;
        }

        // 2. Get User ID
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);

        try {
            // 3. Prepare Data Payload
            // Saving to the user document under 'job_availability' field.
            // Verify this field name is correct for your 'users' document structure.
            const dataToUpdate = {
                job_availability: selected, // Assumed field name
                last_updated_at: Timestamp.now()
            };

            // 4. Get Firestore Document Reference in 'users' collection
            const userDocRef = doc(db, 'users', uid);

            // 5. Perform Firestore Update
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job availability.`);

            // 6. Navigate on success
            navigation.navigate('JobSalaryBusiness'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the job availability. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }
    // --- End of handleNext function ---


    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]} // KAV setup
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            {/* Header */}
            <ProfileNavHeader
                stepText="8/12" // *** Adjust Step Number ***
                progress={8 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={false} // Availability usually required
                 // onSkip={() => navigation.navigate('JobSalaryBusiness')} // Optional skip logic
            />

            {/* Content Wrapper for Vertical Centering */}
            <View style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/* Title */}
                <Text style={[
                    globalStyles.title,
                    { marginBottom: spacing.xl } // Space below title
                ]}>
                    Job Availability
                </Text>

                {/* ScrollView for Options */}
                <ScrollView
                    style={{ // Style ScrollView itself
                        width: '100%', // Take full width
                        maxHeight: 350, // Limit height for the list
                        marginBottom: spacing.l, // Space below options list
                    }}
                    contentContainerStyle={{ // Style the content *inside* ScrollView
                        alignItems: 'center', // Center items horizontally
                        paddingVertical: spacing.s, // Padding inside scroll area
                    }}
                >
                    {availabilityOptions.map(opt => {
                        const isSelected = selected === opt;
                        return (
                            <Pressable
                                key={opt}
                                disabled={isSaving}
                                onPress={() => selectOption(opt)}
                                style={{ // Style each option Pressable
                                    width: '90%', // Make options slightly narrower
                                    paddingVertical: spacing.m,
                                    paddingHorizontal: spacing.m,
                                    marginVertical: spacing.xs,
                                    borderRadius: 12,
                                    borderWidth: 1.5,
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ // Style option text
                                    color: isSelected ? colors.white : colors.primary,
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    fontSize: 16,
                                }}>
                                    {opt}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Button */}
                <Button
                    mode="contained"
                    disabled={!selected || isSaving} // Require a selection
                    onPress={handleNext}
                    loading={isSaving}
                    style={{
                        width: '100%',
                        borderRadius: 30,
                        backgroundColor: selected ? colors.primary : colors.muted,
                        marginTop: spacing.m, // Space above button
                    }}
                    contentStyle={globalStyles.buttonContent}
                    labelStyle={{ color: colors.white, fontWeight: '600' }}
                >
                    {isSaving ? 'Saving...' : 'Next'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}