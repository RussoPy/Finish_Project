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
];

export default function TagPrefrencesStep() {
  const navigation = useNavigation<any>();
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
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

  const togglePref = (pref: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || selectedPrefs.length === 0) {
      Alert.alert('Please select at least one job preference');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        preferences: selectedPrefs,
      });
      navigation.navigate('Location');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const filtered = tagOptions.filter((j) =>
    j.toLowerCase().includes(search.toLowerCase())
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
        Choose Job Preferences
      </Text>

      <TextInput
        placeholder="Search job types..."
        value={search}
        onChangeText={setSearch}
        className="bg-white p-3 rounded-xl border border-blue-200 mb-4"
      />

      <ScrollView className="flex-1 mb-4">
        {filtered.map((pref) => (
          <Pressable
            key={pref}
            onPress={() => togglePref(pref)}
            className={`p-2 px-4 rounded-full my-1 mr-2 border ${
              selectedPrefs.includes(pref)
                ? 'bg-blue-500 border-blue-700'
                : 'bg-white border-blue-300'
            }`}
          >
            <Text
              className={`text-sm ${
                selectedPrefs.includes(pref) ? 'text-white' : 'text-blue-800'
              }`}
            >
              {pref}
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
