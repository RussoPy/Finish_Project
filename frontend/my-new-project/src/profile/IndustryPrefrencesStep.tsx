import { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import { Button, Text } from 'react-native-paper';

const industries = [
  "Retail", "Food Service", "Hospitality", "Construction", "Transportation",
  "Delivery", "Warehouse", "Cleaning", "Security", "Customer Support",
  "Software Development", "Frontend Development", "Backend Development",
  "UI/UX Design", "Graphic Design", "Education", "Tutoring", "Marketing",
  "Sales", "Accounting", "Finance", "Real Estate", "Legal", "Fitness", "Medical",
  "Photography", "Barista", "Chef", "Waiter", "Event Planning", "Fashion",
  "Hair & Beauty", "Freelance", "Remote Work", "Driving", "Startup", "Corporate"
];

export default function IndustryPreferencesStep() {
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
      style={[
        globalStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* 🧭 Top Navigation */}
      <ProfileNavHeader
        stepText="5/10"
        progress={0.5}
        onSkip={() => navigation.navigate('Experience')}
        showBack
        showSkip={false}
      />

      {/* 🏷️ Title */}
      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        your <Text style={{ color: colors.secondary }}>industry?</Text>
      </Text>

      {/* 📄 Subtitle */}
      <Text
        style={{
          color: colors.info,
          textAlign: 'center',
          fontSize: 14,
          marginBottom: spacing.l,
          paddingHorizontal: spacing.l,
        }}
      >
        Select industries you’d like to work in. You can choose more than one.
      </Text>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search industries..."
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

      {/* 🧠 Pill Grid */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 100,
        }}
      >
        {filtered.map((industry) => {
          const isSelected = selected.includes(industry);
          return (
            <Pressable
              key={industry}
              onPress={() => toggle(industry)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: isSelected ? colors.primary : '#fff',
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.muted,
              }}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : colors.primary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {industry}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ✅ Continue */}
      <Button
        mode="contained"
        onPress={handleSave}
        disabled={selected.length === 0}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor: selected.length === 0 ? colors.muted : colors.primary,
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
