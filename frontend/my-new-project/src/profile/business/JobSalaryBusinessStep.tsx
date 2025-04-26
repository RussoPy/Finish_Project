// src/profile/business/JobSalaryBusinessStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    Pressable, // For unit selector
    // StyleSheet removed
    Alert
    // ScrollView removed as content should fit in centered view
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper'; // Use Paper components
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
type JobSalaryBusinessNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobSalaryBusiness'
>;


export default function JobSalaryBusinessStep() {
    const navigation = useNavigation<JobSalaryBusinessNavProp>();
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    // Add state for salary unit, default to 'month'
    const [unit, setUnit] = useState<'hour' | 'month'>('month');
    const [isSaving, setIsSaving] = useState(false);

    // Validation function
    const validateSalary = () => {
        const parsedMin = parseInt(minSalary, 10);
        if (minSalary === '' || isNaN(parsedMin) || parsedMin < 0) {
            Alert.alert('Invalid Minimum Salary', 'Please enter a valid positive number for the minimum salary.');
            return false;
        }

        if (maxSalary !== '') {
            const parsedMax = parseInt(maxSalary, 10);
            if (isNaN(parsedMax) || parsedMax < 0) {
                Alert.alert('Invalid Maximum Salary', 'If entered, the maximum salary must be a valid positive number.');
                return false;
            }
            if (parsedMax < parsedMin) {
                Alert.alert('Invalid Range', 'Maximum salary cannot be less than the minimum salary.');
                return false;
            }
        }
        return true; // Validation passes
    };


    // --- handleNext function with saving logic ---
    const handleNext = async () => {
        // 1. Validate Inputs first
        if (!validateSalary()) {
            return; // Stop if validation fails
        }

        // 2. Get User ID
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);

        // Parse numbers for saving
        const parsedMin = parseInt(minSalary, 10);
        const parsedMax = maxSalary === '' ? null : parseInt(maxSalary, 10); // Save null if empty

        try {
            // 3. Prepare Data Payload
            // Saving to the user document under job-specific fields.
            // Verify these field names ('job_salary_min', 'job_salary_max', 'job_salary_unit')
            // are correct for your 'users' document structure.
            const dataToUpdate = {
                job_salary_min: parsedMin,
                job_salary_max: parsedMax,
                job_salary_unit: unit,
                last_updated_at: Timestamp.now()
            };

            // 4. Get Firestore Document Reference in 'users' collection
            const userDocRef = doc(db, 'users', uid);

            // 5. Perform Firestore Update
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job salary details.`);

            // 6. Navigate on success
            navigation.navigate('JobBenefitsBusiness'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the salary details. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }
    // --- End of handleNext function ---

    // Determine if the button should be enabled (min salary must be a valid number)
    const isMinSalaryValid = minSalary !== '' && !isNaN(parseInt(minSalary, 10)) && parseInt(minSalary, 10) >= 0;

    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]} // KAV setup
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            {/* Header */}
            <ProfileNavHeader
                stepText="9/12" // *** Adjust Step Number ***
                progress={9 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={true} // Allow skipping salary? Maybe navigate with null values?
                onSkip={() => navigation.navigate('JobBenefitsBusiness')} // Optional skip logic
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
                    { marginBottom: spacing.m } // Use smaller margin
                ]}>
                    Salary Range (₪)
                </Text>
                <Text style={{ // Optional Subtitle
                    color: colors.textSecondary,
                    marginBottom: spacing.l,
                    textAlign: 'center'
                 }}>
                    Enter the minimum and optional maximum salary.
                </Text>


                {/* Min Salary Input */}
                <TextInput
                    label="Minimum Salary (₪)"
                    value={minSalary}
                    onChangeText={setMinSalary}
                    placeholder="e.g. 6000"
                    mode="outlined"
                    keyboardType="numeric"
                    style={{ width: '100%', marginBottom: spacing.m }} // Use spacing
                    disabled={isSaving}
                />

                {/* Max Salary Input */}
                <TextInput
                    label="Maximum Salary (₪) (Optional)"
                    value={maxSalary}
                    onChangeText={setMaxSalary}
                    placeholder="e.g. 9000"
                    mode="outlined"
                    keyboardType="numeric"
                    style={{ width: '100%', marginBottom: spacing.l }} // Use spacing
                    disabled={isSaving}
                />

                 {/* Salary Unit Toggle */}
                 <Text style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: spacing.s }}>
                    Salary Unit
                 </Text>
                 <View
                    style={{
                        flexDirection: 'row', // Arrange buttons horizontally
                        justifyContent: 'center',
                        marginBottom: spacing.xl, // Space below selector
                    }}
                 >
                    {(['hour', 'month'] as const).map((u) => { // Use "as const" for type safety
                        const isActive = unit === u;
                        return (
                            <Pressable
                                key={u}
                                disabled={isSaving}
                                onPress={() => setUnit(u)}
                                style={{ // Style segmented button parts
                                    paddingVertical: 10,
                                    paddingHorizontal: 25, // Adjust padding
                                    backgroundColor: isActive ? colors.primary : colors.white,
                                    borderWidth: 1.5, // Match input border?
                                    borderColor: isActive ? colors.primary : colors.muted,
                                    // Apply border radius selectively for segmented look
                                    borderTopLeftRadius: u === 'hour' ? 12 : 0,
                                    borderBottomLeftRadius: u === 'hour' ? 12 : 0,
                                    borderTopRightRadius: u === 'month' ? 12 : 0,
                                    borderBottomRightRadius: u === 'month' ? 12 : 0,
                                    // Ensure borders connect
                                    marginLeft: u === 'month' ? -1.5 : 0, // Overlap borders slightly
                                }}
                            >
                                <Text
                                    style={{
                                        color: isActive ? colors.white : colors.primary,
                                        fontWeight: '600',
                                    }}
                                >
                                    {/* Capitalize unit */}
                                    Per {u.charAt(0).toUpperCase() + u.slice(1)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>


                {/* Button */}
                <Button
                    mode="contained"
                    disabled={!isMinSalaryValid || isSaving} // Require valid min salary
                    onPress={handleNext}
                    loading={isSaving}
                    style={{
                        width: '100%',
                        borderRadius: 30,
                        backgroundColor: isMinSalaryValid ? colors.primary : colors.muted,
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