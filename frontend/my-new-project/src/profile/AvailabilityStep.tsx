import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from 'react-native';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import { Button, Text } from 'react-native-paper';

const options = ['Full-time', 'Part-time', 'Remote'];

export default function AvailabilityStep() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string[]>([]);
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

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((i) => i !== option) : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || selected.length === 0) {
      Alert.alert('Please select at least one availability option');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        availability: selected,
      });

      navigation.navigate('JobLocationStep');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

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
      {/* ⬅️ Header with Progress */}
      <ProfileNavHeader
        stepText="8/10"
        progress={0.8}
        onSkip={() => navigation.navigate('JobLocationStep')}
        showBack
        showSkip={false}
      />

      {/* 🏷️ Title */}
      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        your <Text style={{ color: colors.secondary }}>availability?</Text>
      </Text>

      {/* 💬 Subtitle */}
      <Text
        style={{
          color: colors.info,
          textAlign: 'center',
          fontSize: 14,
          marginBottom: spacing.l,
          paddingHorizontal: spacing.l,
        }}
      >
        Select your availability preferences.
      </Text>

      {/* ✅ Option Buttons */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              style={{
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 24,
                marginBottom: spacing.m,
                backgroundColor: isSelected ? colors.primary : '#fff',
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.muted,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : colors.primary,
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 🎯 Finish Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={selected.length === 0}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor: selected.length > 0 ? colors.primary : colors.muted,
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
