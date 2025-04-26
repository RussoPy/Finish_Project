// src/profile/business/JobTagsStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView, // To display tags if they exceed screen height
    Pressable,  // For tag interaction
    // StyleSheet removed
    Alert
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper'; // Add TextInput if search needed
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
type JobTagsNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobTags'
>;

// Example Tag Options - Replace or fetch these as needed
const tagOptions = [
  'React', 'Node.js', 'UI/UX', 'AWS', 'TypeScript', 'JavaScript', 'Python', 'SQL',
  'NoSQL', 'Docker', 'Kubernetes', 'Agile', 'Scrum', 'Project Management', 'Sales',
  'Marketing', 'Customer Support', 'Remote', 'Full-time', 'Part-time', 'Contract'
];


export default function JobTagsStep() {
    const navigation = useNavigation<JobTagsNavProp>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    // const [search, setSearch] = useState(''); // State for optional search

    function toggleTag(tag: string) {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    }

    // Filter logic (if search is implemented)
    // const filteredTags = tagOptions.filter((tag) =>
    //  tag.toLowerCase().includes(search.toLowerCase())
    // );
    const filteredTags = tagOptions; // Use all tags if no search

    // --- handleNext function with saving logic ---
    const handleNext = async () => {
        // 1. Validate Input (optional: require at least one tag?)
        // if (selectedTags.length === 0) {
        //   Alert.alert('No Tags Selected', 'Please select at least one relevant tag.');
        //   return;
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
            // Saving to the user document under 'job_tags' field.
            // Verify this field name is correct for your 'users' document structure.
            const dataToUpdate = {
                job_tags: selectedTags, // Assumed field name for the job tags
                last_updated_at: Timestamp.now()
            };

            // 4. Get Firestore Document Reference in 'users' collection
            const userDocRef = doc(db, 'users', uid);

            // 5. Perform Firestore Update
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job tags.`);

            // 6. Navigate on success
            navigation.navigate('JobSkills'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the job tags. Please try again.');
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
                stepText="6/12" // *** Adjust Step Number ***
                progress={6 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={true} // Allow skipping tags?
                onSkip={() => navigation.navigate('JobSkills')} // Navigate if skipping
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
                    Relevant Job Tags
                </Text>

                {/* Optional Search Input
                <TextInput
                    label="Search Tags"
                    value={search}
                    onChangeText={setSearch}
                    mode="outlined"
                    style={{ width: '100%', marginBottom: spacing.m }}
                    disabled={isSaving}
                /> */}

                {/* ScrollView for Tags */}
                <ScrollView
                    style={{ // Style ScrollView itself
                        width: '100%',
                        maxHeight: 300, // Limit height to prevent pushing content too much
                        marginBottom: spacing.l, // Space below tags, above button
                    }}
                    contentContainerStyle={{ // Style the content *inside* ScrollView
                        flexDirection: 'row', // Arrange tags horizontally
                        flexWrap: 'wrap', // Allow tags to wrap to next line
                        alignItems: 'flex-start', // Align items to top of rows
                        justifyContent: 'center', // Center tags horizontally if they don't fill width
                        paddingVertical: spacing.s, // Padding inside scroll area
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {filteredTags.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <Pressable
                                key={tag}
                                disabled={isSaving}
                                onPress={() => toggleTag(tag)}
                                style={{ // Style each tag Pressable
                                    paddingHorizontal: spacing.m, // Horizontal padding
                                    paddingVertical: spacing.s, // Vertical padding
                                    margin: spacing.xs, // Margin around each tag
                                    borderRadius: 20, // Make it pill-shaped
                                    borderWidth: 1,
                                    // Conditional styling based on selection
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                }}
                            >
                                <Text style={{ // Style tag text
                                    color: isSelected ? colors.white : colors.primary,
                                    fontWeight: isSelected ? '600' : 'normal',
                                    fontSize: 14,
                                }}>
                                    {tag}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Button */}
                <Button
                    mode="contained"
                    // Optional: disable if no tags selected? Or allow empty?
                    disabled={isSaving} // selectedTags.length === 0 || isSaving
                    onPress={handleNext}
                    loading={isSaving}
                    style={{
                        width: '100%',
                        borderRadius: 30,
                        // Decide background based on selection or just saving state
                        backgroundColor: (selectedTags.length > 0 || !isSaving) ? colors.primary : colors.muted, // Example: Enable if tags selected OR not saving
                        // Or: backgroundColor: colors.primary // Always primary unless saving
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