import { useEffect, useRef, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
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
import { ProfileNavHeader } from '../components/ProfileNavHeader';
 
const View = styled(RNView);
const Text = styled(RNText);
const Pressable = styled(RNPressable);

const options = [
  { label: 'Close to where I live', radius: 15 },
  { label: 'I’m flexible', radius: 50 },
];

export default function JobLocationStep() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<number | null>(null);
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

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || selected === null) {
      Alert.alert('Please select a job location preference');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        job_search_radius: selected,
      });

      Alert.alert('🎉 Job preferences complete!');
      navigation.replace('Home'); // or go to summary
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#f0f9ff',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <ProfileNavHeader onSkip={() => navigation.navigate('Salary')} />
      <Text className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Job Location Preference
      </Text>

      {options.map((opt) => (
        <Pressable
          key={opt.label}
          onPress={() => setSelected(opt.radius)}
          className={`mb-3 rounded-xl p-4 border ${
            selected === opt.radius
              ? 'bg-blue-500 border-blue-700'
              : 'bg-white border-blue-300'
          }`}
        >
          <Text
            className={`text-center text-lg font-semibold ${
              selected === opt.radius ? 'text-white' : 'text-blue-800'
            }`}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}

      <AppButton
        title="Save & Continue"
        onPress={handleSubmit}
      />
    </Animated.View>
  );
}
