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

const View = styled(RNView);
const Text = styled(RNText);
const Pressable = styled(RNPressable);

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

      navigation.navigate('JobLocationStep'); // go to next step
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
      <Text className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Job Availability
      </Text>

      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => toggle(opt)}
          className={`mb-3 rounded-xl p-4 border ${
            selected.includes(opt)
              ? 'bg-blue-500 border-blue-700'
              : 'bg-white border-blue-300'
          }`}
        >
          <Text
            className={`text-center text-lg font-semibold ${
              selected.includes(opt) ? 'text-white' : 'text-blue-800'
            }`}
          >
            {opt}
          </Text>
        </Pressable>
      ))}

      <AppButton
        title="Save & Continue"
        onPress={handleSubmit}
        bg="bg-gradient-to-r from-indigo-500 to-indigo-700"
      />
    </Animated.View>
  );
}
