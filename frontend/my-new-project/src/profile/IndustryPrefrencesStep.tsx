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

const industries = [
  "Retail", "Food Service", "Hospitality", "Construction", "Transportation",
  "Delivery", "Warehouse", "Cleaning", "Security", "Customer Support",
  "Software Development", "Frontend Development", "Backend Development",
  "UI/UX Design", "Graphic Design", "Education", "Tutoring", "Marketing",
  "Sales", "Accounting", "Finance", "Real Estate", "Legal", "Fitness", "Medical",
  "Photography", "Barista", "Chef", "Waiter", "Event Planning", "Fashion",
  "Hair & Beauty", "Freelance", "Remote Work", "Driving", "Startup", "Corporate"
];

export default function IndustryPrefrencesStep() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string[]>([]);
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

  const toggle = (industry: string) => {
    setSelected((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || selected.length === 0) {
      Alert.alert('Please choose at least one industry');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        preferred_tags: selected,
      });

      navigation.navigate('Experience'); // next step
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const filtered = industries.filter((i) =>
    i.toLowerCase().includes(search.toLowerCase())
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
        Select Industries You’d Like to Work In
      </Text>

      <TextInput
        placeholder="Search industries..."
        value={search}
        onChangeText={setSearch}
        className="bg-white p-3 rounded-xl border border-blue-200 mb-4"
      />

      <ScrollView className="flex-1 mb-4">
        {filtered.map((industry) => (
          <Pressable
            key={industry}
            onPress={() => toggle(industry)}
            className={`p-2 px-4 rounded-full my-1 mr-2 border ${
              selected.includes(industry)
                ? 'bg-blue-500 border-blue-700'
                : 'bg-white border-blue-300'
            }`}
          >
            <Text
              className={`text-sm ${
                selected.includes(industry) ? 'text-white' : 'text-blue-800'
              }`}
            >
              {industry}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <AppButton
        title="Save & Continue"
        onPress={handleSave}
        bg="bg-gradient-to-r from-indigo-500 to-indigo-700"
      />
    </Animated.View>
  );
}
