// src/profile/worker/IndustryPreferencesStep.tsx // Assuming path

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
import { Button, Text, TextInput } from 'react-native-paper';
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
type IndustryPrefsNavProp = NativeStackNavigationProp<any, 'IndustryPreferences'>; // Or correct route name

// --- Industry Options (Keep or fetch dynamically) ---
const industries = [
    "Retail", "Food Service", "Hospitality", "Construction", "Transportation",
    "Delivery", "Warehouse", "Cleaning", "Security", "Customer Support",
    "Software Development", "Frontend Development", "Backend Development",
    "UI/UX Design", "Graphic Design", "Education", "Tutoring", "Marketing",
    "Sales", "Accounting", "Finance", "Real Estate", "Legal", "Fitness", "Medical",
    "Photography", "Barista", "Chef", "Waiter", "Event Planning", "Fashion",
    "Hair & Beauty", "Freelance", "Remote Work", "Driving", "Startup", "Corporate"
]; // Consider fetching this list


export default function IndustryPreferencesStep() {
    const navigation = useNavigation<IndustryPrefsNavProp>();
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Loading state

    // Remove animation refs and useEffect

    const toggle = (industry: string) => {
        setSelected((prev) =>
            prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
        );
    };

    // --- handleSave function with loading state and error handling ---
    const handleSave = async () => {
        const uid = auth.currentUser?.uid;
        // Validate: require at least one industry
        if (selected.length === 0) {
            Alert.alert('Selection Required', 'Please choose at least one industry.');
            return;
        }
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save preferences.');
            return;
        }

        setIsSaving(true);

        try {
            // Saving selected industries to 'preferred_tags' field in user doc
            // Note: Field name 'preferred_tags' comes from original code, verify if still correct
            await updateDoc(doc(db, 'users', uid), {
                preferred_tags: selected,
                last_updated_at: Timestamp.now() // Add timestamp
            });

            console.log(`User document ${uid} updated successfully with industry preferences (preferred_tags).`);
            // Navigate to the next step in the WORKER flow
            navigation.navigate('WorkerExperience'); // Navigate as per original logic

        } catch (err: any) {
            console.error("Error updating industry preferences:", err);
            Alert.alert('Save Error', err.message || 'Could not save preferences.');
        } finally {
            setIsSaving(false);
        }
    };
    // --- End of handleSave function ---

    const filtered = industries.filter((i) =>
        i.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]} // KAV setup
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
             {/* Adjust ProfileNavHeader props for Worker flow */}
            <ProfileNavHeader
                 stepText="7/12" // *** Adjust Worker Step Number ***
                 progress={7/12} // *** Adjust Worker Progress ***
                 showBack={true}
                 showSkip={false} // Require industry selection
                 // onSkip={() => navigation.navigate('Experience')} // Optional skip logic
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
                     Your <Text style={{ color: colors.secondary }}>industry?</Text>
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
                    Select industries you’d like to work in. You can choose more than one.
                 </Text>

                {/* Search Input */}
                <TextInput
                    label="Search Industries" // Use label
                    placeholder="Search industries..."
                    value={search}
                    onChangeText={setSearch}
                    mode="outlined" // Consistent style
                    style={{ width: '100%', marginBottom: spacing.m }} // Full width, margin below
                    disabled={isSaving}
                    left={<TextInput.Icon icon="magnify" />} // Add search icon
                />

                {/* ScrollView for Industries */}
                <ScrollView
                    style={{ // Style ScrollView itself
                        width: '100%',
                        maxHeight: 300, // Limit height
                        marginBottom: spacing.l,
                    }}
                    contentContainerStyle={{ // Style the content *inside* ScrollView
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingVertical: spacing.s,
                        // Use gap from example if preferred over margin on items
                        // gap: 8,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {filtered.map((industry) => { // Use filtered list
                        const isSelected = selected.includes(industry);
                        return (
                            <Pressable
                                key={industry}
                                disabled={isSaving}
                                onPress={() => toggle(industry)}
                                style={{ // Style each industry Pressable - match example closely
                                    paddingVertical: spacing.s, // 8
                                    paddingHorizontal: spacing.m, // 16
                                    margin: spacing.xs, // ~4, use instead of gap
                                    borderRadius: 24, // Pill-shaped from example
                                    borderWidth: 1,
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                }}
                            >
                                <Text style={{ // Style industry text - match example
                                    color: isSelected ? colors.white : colors.primary,
                                    fontSize: 14,
                                    fontWeight: '500', // Match example
                                }}>
                                    {industry}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Use Paper Button */}
                <Button
                    mode="contained"
                    // Disable if no industries selected or if saving
                    disabled={selected.length === 0 || isSaving}
                    onPress={handleSave} // Use updated handleSave
                    loading={isSaving}
                    style={{ // Apply button styling
                        width: '100%',
                        borderRadius: 30,
                        backgroundColor: selected.length > 0 ? colors.primary : colors.muted,
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