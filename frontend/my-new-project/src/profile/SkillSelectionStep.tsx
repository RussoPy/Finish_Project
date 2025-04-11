import { useEffect, useRef, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  ScrollView as RNScrollView,
  Pressable as RNPressable,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const View = styled(RNView);
const Text = styled(RNText);
const TextInput = styled(RNTextInput);
const ScrollView = styled(RNScrollView);
const Pressable = styled(RNPressable);

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
];

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
      style={{
        flex: 1,
        backgroundColor: '#f0f9ff',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        padding: 20,
      }}
    >
      <Text className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Choose Your Skills
      </Text>

      <TextInput
        placeholder="Search skills..."
        value={search}
        onChangeText={setSearch}
        className="bg-white p-3 rounded-xl border border-blue-200 mb-4"
      />

      <ScrollView className="flex-1 mb-4">
        {filteredSkills.map((skill) => (
          <Pressable
            key={skill}
            onPress={() => toggleSkill(skill)}
            className={`p-2 px-4 rounded-full my-1 mr-2 border ${
              selectedSkills.includes(skill)
                ? 'bg-blue-500 border-blue-700'
                : 'bg-white border-blue-300'
            }`}
          >
            <Text
              className={`text-sm ${
                selectedSkills.includes(skill) ? 'text-white' : 'text-blue-800'
              }`}
            >
              {skill}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <AppButton
        title="Save & Continue"
        onPress={handleSave}
      />
    </Animated.View>
  );
}
