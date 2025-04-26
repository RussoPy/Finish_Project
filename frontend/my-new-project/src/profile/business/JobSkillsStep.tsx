// src/profile/business/JobSkillsStep.tsx

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView, // To display skills
    Pressable,  // For skill interaction
    // StyleSheet removed
    Alert
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper'; // Keep TextInput import if search might be added
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
type JobSkillsNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobSkills'
>;

// Example Skill Options - Replace or fetch these as needed
const skillOptions = [
    'JavaScript', 'TypeScript', 'React', 'React Native', 'Node.js', 'Python', 'Django', 'Flask',
    'Java', 'Spring', 'C#', '.NET', 'SQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'AWS',
    'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'HTML', 'CSS', 'Sass',
    'Tailwind CSS', 'UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Communication', 'Teamwork',
    'Problem Solving', 'Agile', 'Scrum', 'Project Management', 'Customer Service', 'Sales', 'Marketing'
];


export default function JobSkillsStep() {
    const navigation = useNavigation<JobSkillsNavProp>();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    // const [search, setSearch] = useState(''); // State for optional search

    function toggleSkill(skill: string) {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    }

    // Filter logic (if search is implemented)
    // const filteredSkills = skillOptions.filter((skill) =>
    //  skill.toLowerCase().includes(search.toLowerCase())
    // );
    const filteredSkills = skillOptions; // Use all skills if no search

    // --- handleNext function with saving logic ---
    const handleNext = async () => {
        // 1. Validate Input (e.g., require at least one skill)
        if (selectedSkills.length === 0) {
           Alert.alert('No Skills Selected', 'Please select at least one required skill.');
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
            // Saving to the user document under 'job_skills_needed' field.
            // Verify this field name is correct for your 'users' document structure.
            const dataToUpdate = {
                job_skills_needed: selectedSkills, // Assumed field name for job skills
                last_updated_at: Timestamp.now()
            };

            // 4. Get Firestore Document Reference in 'users' collection
            const userDocRef = doc(db, 'users', uid);

            // 5. Perform Firestore Update
            await updateDoc(userDocRef, dataToUpdate);

            console.log(`User document ${uid} updated successfully with job skills.`);

            // 6. Navigate on success
            navigation.navigate('JobExperienceRequired'); // Navigate to the next step

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the required skills. Please try again.');
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
                stepText="7/12" // *** Adjust Step Number ***
                progress={7 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={false} // Skills are usually required
                 // onSkip={() => navigation.navigate('JobExperienceRequired')} // Optional skip logic
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
                    Required Skills
                </Text>

                {/* Optional Search Input
                <TextInput
                    label="Search Skills"
                    value={search}
                    onChangeText={setSearch}
                    mode="outlined"
                    style={{ width: '100%', marginBottom: spacing.m }}
                    disabled={isSaving}
                /> */}

                {/* ScrollView for Skills */}
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
                        justifyContent: 'center', // Center skills horizontally
                        paddingVertical: spacing.s,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {filteredSkills.map(skill => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                            <Pressable
                                key={skill}
                                disabled={isSaving}
                                onPress={() => toggleSkill(skill)}
                                style={{ // Style each skill Pressable
                                    paddingHorizontal: spacing.m,
                                    paddingVertical: spacing.s,
                                    margin: spacing.xs,
                                    borderRadius: 20, // Pill-shaped
                                    borderWidth: 1,
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                }}
                            >
                                <Text style={{ // Style skill text
                                    color: isSelected ? colors.white : colors.primary,
                                    fontWeight: isSelected ? '600' : 'normal',
                                    fontSize: 14,
                                }}>
                                    {skill}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Button */}
                <Button
                    mode="contained"
                    disabled={selectedSkills.length === 0 || isSaving} // Require at least one skill
                    onPress={handleNext}
                    loading={isSaving}
                    style={{
                        width: '100%',
                        borderRadius: 30,
                        backgroundColor: selectedSkills.length > 0 ? colors.primary : colors.muted,
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