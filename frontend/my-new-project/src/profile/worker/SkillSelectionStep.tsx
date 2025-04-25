import { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  Alert,
  TextInput,
} from 'react-native';
import { auth, db } from '../../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button, Text } from 'react-native-paper';


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
"Technician", "Installer", "HR", "Recruitment", "Data Analysis", "Excel Pivot Tables", "QuickBooks"]

export default function SkillSelectionStep() {
  const navigation = useNavigation<any>();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || selectedSkills.length === 0) {
      Alert.alert('Please select at least one skill');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        skills: selectedSkills,
      });
      navigation.navigate('JobPreferences');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const filteredSkills = allSkills.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Animated.View
      style={[
        globalStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* 🔙 Header */}
      <ProfileNavHeader
        stepText="4/10"
        progress={0.4}
        showBack
        showSkip={false}
      />

      {/* 🎯 Title */}
      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        your <Text style={{ color: colors.secondary }}>skills?</Text>
      </Text>

      {/* 📓 Subtitle */}
      <Text
        style={{
          color: colors.info,
          textAlign: 'center',
          fontSize: 14,
          marginBottom: spacing.l,
          paddingHorizontal: spacing.l,
        }}
      >
        Select your skills so we can match you with the best job opportunities.
      </Text>

      {/* 🔍 Search Input */}
      <TextInput
        placeholder="Search skills..."
        value={search}
        onChangeText={setSearch}
        style={{
          height: 44,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingHorizontal: spacing.m,
          borderColor: colors.muted,
          borderWidth: 1,
          marginBottom: spacing.m,
        }}
      />

      {/* 🧠 Skill Pills */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 100,
        }}
      >
        {filteredSkills.map((skill) => {
          const selected = selectedSkills.includes(skill);
          return (
            <Pressable
              key={skill}
              onPress={() => toggleSkill(skill)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: selected ? colors.primary : '#fff',
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.muted,
              }}
            >
              <Text
                style={{
                  color: selected ? '#fff' : colors.primary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {skill}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ✅ Continue Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        disabled={selectedSkills.length === 0}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor:
              selectedSkills.length === 0 ? colors.muted : colors.primary,
          },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </Animated.View>
  );
}
