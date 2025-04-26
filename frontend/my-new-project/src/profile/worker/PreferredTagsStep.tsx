// src/profile/worker/TagPreferencesStep.tsx // Assuming path

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
// Removed nativewind imports and AppButton

// --- Navigation Prop Type ---
// Replace 'any' with your actual ParamList and Route Name if available
type TagPreferencesNavProp = NativeStackNavigationProp<any, 'TagPreferences'>;

// --- Tag Options (Keep or fetch dynamically) ---
const tagOptions = [
    "Retail", "Food Service", "Hospitality", "Construction", "Transportation", "Delivery",
    "Warehouse", "Cleaning", "Security", "Call Center", "Customer Support", "Tech Support",
    "Software Development", "Frontend Development", "Backend Development", "UI/UX Design",
    "Graphic Design", "Content Writing", "Translation", "Education", "Tutoring", "Marketing",
    "Sales", "Social Media", "Accounting", "Finance", "Real Estate", "Legal", "Medical Assistant",
    "Nursing", "Caregiving", "Fitness Trainer", "Hairdresser", "Makeup Artist", "Event Planning",
    "Photography", "Video Editing", "Project Management", "Operations", "Human Resources",
    "Recruitment", "Data Entry", "Driving", "Motorbike Delivery", "Truck Driver", "Barista",
    "Waiter", "Bartender", "Chef", "Kitchen Assistant", "Dishwasher", "Mover", "Installer",
    "Electrician", "Plumber", "Mechanic", "Technician", "Fashion", "Modeling", "Telemarketing",
    "Admin Assistant", "Reception", "Hosting", "Babysitting", "Pet Sitting", "Gardening",
    "Painting", "Carpentry", "Cleaning Services", "Laundry", "Warehouse Operator", "Stocking",
    "QA Tester", "Automation", "Data Analyst", "Product Manager", "Scrum Master", "Jira Expert",
    "Notion Specialist", "SEO Expert", "Google Ads", "Facebook Ads", "CRM", "SAP", "ERP",
    "Copywriting", "Script Writing", "Voiceover", "Remote Work", "Freelance Gigs", "Part-Time",
    "Full-Time", "Internship", "Volunteer Work", "Short-Term", "Startup", "Corporate", "Night Shifts",
    "Day Shifts", "Flexible", "Work from Home", "Hybrid", "On-Site"
]; // Consider fetching this list


export default function TagPreferencesStep() {
    const navigation = useNavigation<TagPreferencesNavProp>();
    const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Loading state

    // Remove animation refs and useEffect

    const togglePref = (pref: string) => {
        setSelectedPrefs((prev) =>
            prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
        );
    };

    // --- handleSave function with loading state and error handling ---
    const handleSave = async () => {
        const uid = auth.currentUser?.uid;
        // Validate: require at least one preference?
        if (selectedPrefs.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one tag preference.');
            return;
        }
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save preferences.');
            return;
        }

        setIsSaving(true);

        try {
            // Saving selected preferences to 'preferences' field in user doc
            await updateDoc(doc(db, 'users', uid), {
                preferences: selectedPrefs, // Use the field name from original logic
                last_updated_at: Timestamp.now() // Add timestamp
            });

            console.log(`User document ${uid} updated successfully with tag preferences.`);
            // Navigate to the next step in the WORKER flow
            navigation.navigate('WorkerJobPreferences'); // Navigate as per original logic

        } catch (err: any) {
            console.error("Error updating preferences:", err);
            Alert.alert('Save Error', err.message || 'Could not save preferences.');
        } finally {
            setIsSaving(false);
        }
    };
    // --- End of handleSave function ---


    const filtered = tagOptions.filter((j) =>
        j.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]} // KAV setup
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            {/* Adjust ProfileNavHeader props */}
            <ProfileNavHeader
                 stepText="5/12" // *** Adjust Worker Step Number ***
                 progress={5/12} // *** Adjust Worker Progress ***
                 showBack={true} // Assuming previous step exists
                 showSkip={true} // Allow skipping preferences?
                 // Update skip target if needed for worker flow
                 onSkip={() => navigation.navigate('WorkerJobPreferences')}
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
                    { marginBottom: spacing.m } // Reduced margin
                ]}>
                    Choose Tag Preferences
                </Text>
                <Text style={{ // Optional Subtitle
                    color: colors.textSecondary,
                    marginBottom: spacing.m,
                    textAlign: 'center'
                 }}>
                    Select tags related to jobs you're interested in.
                </Text>


                {/* Search Input */}
                <TextInput
                    label="Search Tags" // Use label
                    placeholder="Search tag types..."
                    value={search}
                    onChangeText={setSearch}
                    mode="outlined" // Consistent style
                    style={{ width: '100%', marginBottom: spacing.m }} // Full width, margin below
                    disabled={isSaving}
                    left={<TextInput.Icon icon="magnify" />} // Add search icon
                />

                {/* ScrollView for Tags */}
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
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {filtered.map((pref) => { // Use filtered list
                        const isSelected = selectedPrefs.includes(pref);
                        return (
                            <Pressable
                                key={pref}
                                disabled={isSaving}
                                onPress={() => togglePref(pref)}
                                style={{ // Style each tag Pressable
                                    paddingHorizontal: spacing.m,
                                    paddingVertical: spacing.s,
                                    margin: spacing.xs,
                                    borderRadius: 20, // Pill-shaped
                                    borderWidth: 1,
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                }}
                            >
                                <Text style={{ // Style tag text
                                    color: isSelected ? colors.white : colors.primary,
                                    fontWeight: isSelected ? '600' : 'normal',
                                    fontSize: 14,
                                }}>
                                    {pref}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Replace AppButton with Paper Button */}
                <Button
                    mode="contained"
                    // Disable if no preferences selected or if saving
                    disabled={selectedPrefs.length === 0 || isSaving}
                    onPress={handleSave} // Use updated handleSave
                    loading={isSaving}
                    style={{ // Apply button styling
                        width: '100%',
                        borderRadius: 30,
                        backgroundColor: selectedPrefs.length > 0 ? colors.primary : colors.muted,
                        marginTop: spacing.m,
                    }}
                    contentStyle={globalStyles.buttonContent} // Global padding
                    labelStyle={{ color: colors.white, fontWeight: '600' }} // Global text style
                >
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}