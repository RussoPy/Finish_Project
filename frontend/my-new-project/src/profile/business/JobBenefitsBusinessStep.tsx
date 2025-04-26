// src/profile/business/JobBenefitsBusinessStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView, // To display benefits
    Pressable,  // For benefit interaction
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
type JobBenefitsNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobBenefitsBusiness'
>;

// Benefit Options - Update this list as needed
const benefitOptions = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  'Paid Time Off (PTO)',
  'Paid Sick Leave',
  '401(k) Plan',
  'Retirement Plan',
  'Stock Options',
  'Performance Bonus',
  'Remote Work Options',
  'Flexible Hours',
  'Gym Membership',
  'Commuter Benefits',
  'Free Snacks/Meals',
  'Employee Discounts',
  'Professional Development',
];


export default function JobBenefitsBusinessStep() {
    const navigation = useNavigation<JobBenefitsNavProp>();
    const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    function toggleBenefit(benefit: string) {
        setSelectedBenefits(prev =>
            prev.includes(benefit)
                ? prev.filter(b => b !== benefit)
                : [...prev, benefit]
        );
    }

    // --- handleNext function with saving logic ---
    const handleNext = async () => {
        // 1. Validate Input (Benefits are often optional, so no validation needed unless required)
        // if (selectedBenefits.length === 0) {
        //    Alert.alert('No Benefits Selected', 'Please select at least one benefit or skip.');
        //    return;
        // }

        // 2. Get User ID
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);

        try {
            // 3. Prepare Data Payload
            // Saving to the user document under 'job_benefits' field.
            // Verify this field name is correct for your 'users' document structure.
            const dataToUpdate = {
                job_benefits: selectedBenefits, // Assumed field name
                last_updated_at: Timestamp.now()
            };

            // 4. Get Firestore Document Reference in 'users' collection
            const userDocRef = doc(db, 'users', uid);

            // 5. Perform Firestore Update
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job benefits.`);

            // 6. Navigate on success
            navigation.navigate('ConfirmPublish'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the benefits. Please try again.');
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
                stepText="11/12" // *** Adjust Step Number ***
                progress={11 / 12}  // *** Adjust Progress ***
                showBack={true}
                showSkip={true} // Allow skipping benefits?
                onSkip={() => navigation.navigate('ConfirmPublish')} // Navigate if skipping
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
                    { marginBottom: spacing.m } // Reduced margin below title
                ]}>
                    Benefits & Perks
                </Text>
                <Text style={{ // Optional Subtitle
                    color: colors.textSecondary,
                    marginBottom: spacing.l,
                    textAlign: 'center'
                 }}>
                    Select the benefits offered for this job (optional).
                </Text>

                {/* ScrollView for Benefits */}
                <ScrollView
                    style={{ // Style ScrollView itself
                        width: '100%',
                        maxHeight: 350, // Limit height
                        marginBottom: spacing.l,
                    }}
                    contentContainerStyle={{ // Style the content *inside* ScrollView
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'center', // Center benefits horizontally
                        paddingVertical: spacing.s,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {benefitOptions.map(benefit => {
                        const isSelected = selectedBenefits.includes(benefit);
                        return (
                            <Pressable
                                key={benefit}
                                disabled={isSaving}
                                onPress={() => toggleBenefit(benefit)}
                                style={{ // Style each benefit Pressable
                                    paddingHorizontal: spacing.m,
                                    paddingVertical: spacing.s,
                                    margin: spacing.xs,
                                    borderRadius: 20, // Pill-shaped
                                    borderWidth: 1,
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                }}
                            >
                                <Text style={{ // Style benefit text
                                    color: isSelected ? colors.white : colors.primary,
                                    fontWeight: isSelected ? '600' : 'normal',
                                    fontSize: 14,
                                }}>
                                    {benefit}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Button */}
                <Button
                    mode="contained"
                    // Benefits are optional, so only disable if saving
                    disabled={isSaving}
                    onPress={handleNext}
                    loading={isSaving}
                    style={{
                        width: '100%',
                        borderRadius: 30,
                        // Always use primary color unless saving, as selection isn't mandatory
                        backgroundColor: isSaving ? colors.muted : colors.primary,
                        marginTop: spacing.m,
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