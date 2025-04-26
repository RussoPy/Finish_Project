// src/profile/worker/ExperienceStep.tsx // Assuming path

import React, { useState } from 'react'; // Use React import convention
import {
    View,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    // StyleSheet removed
    Alert
} from 'react-native';
// Use components from react-native-paper
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Assuming a WorkerProfileSetupParamList or similar exists
// import type { WorkerProfileSetupParamList } from '../../navigation/WorkerProfileSetupNavigator';

// Import Firestore functions and auth/db
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../api/firebase';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
// Removed Animated, Easing imports

// --- Navigation Prop Type ---
// Replace 'any' with your actual ParamList and Route Name if available
type ExperienceNavProp = NativeStackNavigationProp<any, 'Experience'>; // Or correct route name

// --- Experience Options (Match worker model options) ---
const options = ['Entry-level', 'Intermediate', 'Senior', 'Expert']; // Adjusted to match previous models


export default function ExperienceStep() {
    const navigation = useNavigation<ExperienceNavProp>();
    const [selected, setSelected] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false); // Loading state

    // Remove animation refs and useEffect

    // --- handleSubmit function with loading state and error handling ---
    const handleSubmit = async () => {
        const uid = auth.currentUser?.uid;
        // Validate: require selection
        if (!selected) {
            Alert.alert('Selection Required', 'Please select your experience level.');
            return;
        }
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);

        try {
            // Saving selected level to 'experience_level' field in user doc
            await updateDoc(doc(db, 'users', uid), {
                experience_level: selected, // Use field name from original logic
                last_updated_at: Timestamp.now() // Add timestamp
            });

            console.log(`User document ${uid} updated successfully with experience level.`);
            // Navigate to the next step in the WORKER flow
            navigation.navigate('WorkerSalary'); // Navigate as per original logic

        } catch (err: any) {
            console.error("Error updating experience level:", err);
            Alert.alert('Save Error', err.message || 'Could not save experience level.');
        } finally {
            setIsSaving(false);
        }
    };
    // --- End of handleSubmit function ---


    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]} // KAV setup
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
             {/* Adjust ProfileNavHeader props for Worker flow */}
            <ProfileNavHeader
                 stepText="8/12" // *** Adjust Worker Step Number ***
                 progress={8/12} // *** Adjust Worker Progress ***
                 showBack={true}
                 showSkip={true} // Allow skipping experience level?
                 onSkip={() => navigation.navigate('WorkerSalary')} // Optional skip logic
            />

            {/* Content Wrapper for Vertical Centering */}
            <View style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/* Title - Match example styling */}
                 <Text style={[
                    globalStyles.title,
                    // Match example's effective top margin
                    { marginTop: spacing.l, marginBottom: spacing.xs }
                ]}>
                     Your <Text style={{ color: colors.secondary }}>experience?</Text>
                 </Text>

                 {/* Subtitle - Match example styling */}
                 <Text
                    style={{
                        color: colors.info, // Use info color from theme
                        textAlign: 'center',
                        fontSize: 14,
                        marginBottom: spacing.l, // Use large spacing
                        paddingHorizontal: spacing.l, // Use large padding
                    }}
                 >
                    Let us know your experience level to help match you with jobs that fit.
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
                    keyboardShouldPersistTaps="handled"
                >
                    {options.map((opt) => { // Use options list
                        const isSelected = selected === opt;
                        return (
                            <Pressable
                                key={opt}
                                disabled={isSaving}
                                onPress={() => setSelected(opt)} // Use direct setSelected
                                style={{ // Style each option Pressable - match example
                                    width: '90%', // Make options slightly narrower
                                    paddingVertical: 14, // Match example padding
                                    paddingHorizontal: 24, // Match example padding
                                    marginVertical: spacing.s, // Adjusted margin
                                    borderRadius: 16, // Match example radius
                                    borderWidth: 1.5, // Use slightly thicker border for emphasis
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                    alignItems: 'center', // Center text inside Pressable
                                }}
                            >
                                <Text style={{ // Style option text - match example
                                    color: isSelected ? colors.white : colors.primary,
                                    fontWeight: '600', // Match example weight
                                    fontSize: 16, // Match example size
                                }}>
                                    {opt}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Use Paper Button */}
                <Button
                    mode="contained"
                    disabled={!selected || isSaving} // Require a selection
                    onPress={handleSubmit} // Use updated handleSubmit
                    loading={isSaving}
                    style={{ // Apply button styling
                      width: '100%',
                      borderRadius: 30,
                      backgroundColor: selected && selected.length > 0 ? colors.primary : colors.muted,
                      marginTop: spacing.m,
                  }}
                    contentStyle={globalStyles.buttonContent} // Global padding
                    labelStyle={{ color: colors.white, fontWeight: '600' }} // Global text style
                >
                    {isSaving ? 'Saving...' : 'Next'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}