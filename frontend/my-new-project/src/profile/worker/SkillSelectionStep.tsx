// src/profile/worker/SkillSelectionStep.tsx // Assuming path

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
type SkillSelectionNavProp = NativeStackNavigationProp<any, 'SkillSelection'>; // Or the correct route name


// --- Skill Options (Keep or fetch dynamically) ---
const allSkills = [
    "Customer Service", "Sales", "Cashier", "Teamwork", "Leadership", "Problem Solving",
    "Communication", "Multitasking", "Time Management", "Flexibility", "Work Ethic",
    "Responsibility", "Punctuality", "English", "Hebrew", "Spanish", "Arabic",
    "Call Center", "Hospitality", "Cleaning", "Cooking", "Bartending", "Driving",
    "Forklift", "Security", "Retail", "Cash Register", "Stocking", "Typing", "Microsoft Office",
    "Excel", "Word", "PowerPoint", "Email", "Social Media", "Marketing", "Design", "Photoshop",
    "Illustrator", "Figma", "Canva", "Video Editing", "Photography", "Writing", "Content Creation",
    "Public Speaking", "Logistics", "Packing", "Shipping", "Inventory", "Bookkeeping",
    "Accounting", "Teaching", "Tutoring", "Babysitting", "Pet Sitting", "Nursing", "Caregiving",
    "First Aid", "Fitness Training", "Mechanics", "Plumbing", "Electrician", "Construction",
    "Handyman", "Painting", "Gardening", "Carpentry", "Real Estate", "Reception", "Administration",
    "Secretary", "Event Planning", "Hosting", "Translating", "Programming", "JavaScript",
    "React", "Python", "Java", "C#", "SQL", "HTML", "CSS", "Web Development", "Mobile Development",
    "Node.js", "Firebase", "Django", "FastAPI", "Data Entry", "CRM", "SAP", "ERP", "UX/UI",
    "Testing", "QA", "Automation", "AI", "Machine Learning", "Chat Support", "Tech Support",
    "Help Desk", "Hardware", "Networking", "IT Support", "SEO", "Google Ads", "Facebook Ads",
    "Analytics", "Project Management", "Agile", "Scrum", "Jira", "Notion", "Slack",
    "Warehouse", "Cleaning Services", "Hairdressing", "Makeup", "Fashion", "Modeling",
    "Cash Handling", "Heavy Lifting", "Furniture Assembly", "Laundry", "Dishwashing", "Barista",
    "Delivery", "Motorcycle", "Courier", "Driving License", "Truck Driving", "Waiter", "Chef",
    "Sous Chef", "Kitchen Help", "Hostess", "Bouncer", "Greeter", "Cleaner", "Mover", "Call Operator",
    "Technician", "Installer", "HR", "Recruitment", "Data Analysis", "Excel Pivot Tables", "QuickBooks"
]; // Consider fetching this list


export default function SkillSelectionStep() {
    const navigation = useNavigation<SkillSelectionNavProp>();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Loading state

    // Remove animation refs and useEffect

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    // --- handleSave function with loading state and error handling ---
    const handleSave = async () => {
        const uid = auth.currentUser?.uid;
        // Validate: require at least one skill
        if (selectedSkills.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one skill.');
            return;
        }
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save skills.');
            return;
        }

        setIsSaving(true);

        try {
            // Saving selected skills to 'skills' field in user doc
            await updateDoc(doc(db, 'users', uid), {
                skills: selectedSkills, // Use the field name from original logic
                last_updated_at: Timestamp.now() // Add timestamp
            });

            console.log(`User document ${uid} updated successfully with skills.`);
            // Navigate to the next step in the WORKER flow
            navigation.navigate('WorkerTags'); // Navigate as per original logic (ensure route name is correct)

        } catch (err: any) {
            console.error("Error updating skills:", err);
            Alert.alert('Save Error', err.message || 'Could not save skills.');
        } finally {
            setIsSaving(false);
        }
    };
    // --- End of handleSave function ---


    const filteredSkills = allSkills.filter((s) =>
        s.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <KeyboardAvoidingView
            style={[globalStyles.container, { justifyContent: 'flex-start' }]} // KAV setup
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
             {/* Adjust ProfileNavHeader props for Worker flow */}
            <ProfileNavHeader
                 stepText="4/12" // *** Adjust Worker Step Number ***
                 progress={4/12} // *** Adjust Worker Progress ***
                 showBack={true} // Assuming previous step exists
                 showSkip={false} // Skills usually required
                 // onSkip={() => navigation.navigate('WorkerTags')} // Optional skip logic
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
                     Your <Text style={{ color: colors.secondary }}>skills?</Text>
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
                    Select your skills so we can match you with the best job opportunities.
                 </Text>

                {/* Search Input */}
                <TextInput
                    label="Search Skills" // Use label
                    placeholder="Search skills..."
                    value={search}
                    onChangeText={setSearch}
                    mode="outlined" // Consistent style
                    style={{ width: '100%', marginBottom: spacing.m }} // Full width, margin below
                    disabled={isSaving}
                    left={<TextInput.Icon icon="magnify" />} // Add search icon
                />

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
                        justifyContent: 'center',
                        paddingVertical: spacing.s,
                        // Use gap from example if preferred over margin on items
                        // gap: 8,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {filteredSkills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                            <Pressable
                                key={skill}
                                disabled={isSaving}
                                onPress={() => toggleSkill(skill)}
                                style={{ // Style each skill Pressable - match example closely
                                    paddingVertical: spacing.s, // 8
                                    paddingHorizontal: spacing.m, // 16
                                    margin: spacing.xs, // ~4, use instead of gap
                                    borderRadius: 24, // Pill-shaped
                                    borderWidth: 1,
                                    backgroundColor: isSelected ? colors.primary : colors.white,
                                    borderColor: isSelected ? colors.primary : colors.muted,
                                }}
                            >
                                <Text style={{ // Style skill text - match example
                                    color: isSelected ? colors.white : colors.primary,
                                    fontSize: 14,
                                    fontWeight: '500', // Match example
                                }}>
                                    {skill}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Use Paper Button */}
                <Button
                    mode="contained"
                    disabled={selectedSkills.length === 0 || isSaving}
                    onPress={handleSave} // Use updated handleSave
                    loading={isSaving}
                    style={{ // Apply button styling
                        width: '100%',
                        borderRadius: 30,
                        backgroundColor: selectedSkills.length > 0 ? colors.primary : colors.muted,
                        marginTop: spacing.m, // Ensure margin if not absolute positioned
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