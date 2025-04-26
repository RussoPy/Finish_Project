// src/profile/worker/AvailabilityStep.tsx // Assuming path

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
type AvailabilityNavProp = NativeStackNavigationProp<any, 'Availability'>; // Or correct route name

// --- Availability Options (Match worker model options) ---
// Expanded options based on common scenarios
const options = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Flexible Hours', 'Remote', 'On-Site', 'Hybrid'];


export default function AvailabilityStep() {
    const navigation = useNavigation<AvailabilityNavProp>();
    // State allows multiple selections (array)
    const [selected, setSelected] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false); // Loading state

    // Remove animation refs and useEffect

    // Function to toggle selection (add/remove from array)
    const toggle = (option: string) => {
        setSelected((prev) =>
            prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]
        );
    };

    // --- handleSubmit function with loading state and error handling ---
    const handleSubmit = async () => {
        const uid = auth.currentUser?.uid;
        // Validate: require at least one selection
        if (selected.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one availability option.');
            return;
        }
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);

        try {
            // Saving selected availability options array to 'availability' field in user doc
            // Note: Verify if 'availability' should store an array or a single string in your model.
            // If only one, change state/logic. If array is correct, this is fine.
            await updateDoc(doc(db, 'users', uid), {
                availability: selected, // Saving the array
                last_updated_at: Timestamp.now() // Add timestamp
            });

            console.log(`User document ${uid} updated successfully with availability.`);
            // Navigate to the next step in the WORKER flow
            navigation.navigate('WorkerJobLocation'); // Navigate as per original logic (Verify route name)

        } catch (err: any) {
            console.error("Error updating availability:", err);
            Alert.alert('Save Error', err.message || 'Could not save availability.');
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
                 stepText="11 /12" // *** Adjust Worker Step Number ***
                 progress={11 /12} // *** Adjust Worker Progress ***
                 showBack={true}
                 showSkip={false} // Require availability selection?
                 // onSkip={() => navigation.navigate('JobLocationStep')} // Optional skip logic
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
                     Your <Text style={{ color: colors.secondary }}>availability?</Text>
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
                    Select your availability preferences. You can choose more than one.
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
                         // Remove large paddingBottom from original ScrollView contentStyle
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {options.map((opt) => { // Use options list
                        const isSelected = selected.includes(opt); // Check if included in array
                        return (
                            <Pressable
                                key={opt}
                                disabled={isSaving}
                                onPress={() => toggle(opt)} // Use toggle function
                                style={{ // Style each option Pressable - match example style
                                    width: '90%', // Make options slightly narrower
                                    paddingVertical: 14, // Match example padding
                                    paddingHorizontal: 24, // Match example padding
                                    marginVertical: spacing.xs, // Use smaller vertical margin
                                    borderRadius: 16, // Match example radius
                                    borderWidth: 1.5, // Use slightly thicker border
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
                    disabled={selected.length === 0 || isSaving} // Require at least one selection
                    onPress={handleSubmit} // Use updated handleSubmit
                    loading={isSaving}
                    style={[
                      globalStyles.button,
                      {
                        position: 'absolute',
                        bottom: 30,
                        alignSelf: 'center',
                        backgroundColor: selected.length > 0 ? colors.primary : colors.muted,
                      },
                    ]}
                    contentStyle={globalStyles.buttonContent} // Global padding
                    labelStyle={{ color: colors.white, fontWeight: '600' }} // Global text style
                >
                    {isSaving ? 'Saving...' : 'Next'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}