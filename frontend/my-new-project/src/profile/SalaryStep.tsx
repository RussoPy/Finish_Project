import { useState, useRef, useEffect } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  Alert,
  Animated,
  Easing,
  Pressable as RNPressable,
} from 'react-native';
import { styled } from 'nativewind';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../components/ProfileNavHeader';

const View = styled(RNView);
const Text = styled(RNText);
const TextInput = styled(RNTextInput);
const Pressable = styled(RNPressable);

export default function SalaryStep() {
  const navigation = useNavigation<any>();
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [unit, setUnit] = useState<'hour' | 'month'>('month');

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
    const parsedMin = parseInt(min);
    const parsedMax = parseInt(max);

    if (!uid || isNaN(parsedMin) || parsedMin > parsedMax) {
      Alert.alert('Please enter a valid salary range');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        salary_min: parsedMin,
        salary_max: parsedMax,
        salary_unit: unit,
      });

      navigation.navigate('Availability');
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
      <ProfileNavHeader onSkip={() => navigation.navigate('Availability')} />
      <Text className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Expected Salary Range
      </Text>

      <Text className="text-blue-600 mb-1 font-semibold">Minimum Salary (₪)</Text>
      <TextInput
        className="bg-white p-3 rounded-xl border border-blue-200 text-center mb-4"
        placeholder="e.g. 6000"
        value={min}
        onChangeText={setMin}
        keyboardType="numeric"
      />

      <Text className="text-blue-600 mb-1 font-semibold">Maximum Salary (₪)</Text>
      <TextInput
        className="bg-white p-3 rounded-xl border border-blue-200 text-center mb-4"
        placeholder="Optional"
        value={max}
        onChangeText={setMax}
        keyboardType="numeric"
      />

      <Text className="text-blue-600 mb-2 font-semibold">Salary Unit</Text>
      <View className="flex-row justify-center mb-6">
        <Pressable
          onPress={() => setUnit('hour')}
          className={`px-4 py-2 rounded-l-xl border ${
            unit === 'hour'
              ? 'bg-blue-500 border-blue-700'
              : 'bg-white border-blue-300'
          }`}
        >
          <Text className={unit === 'hour' ? 'text-white' : 'text-blue-800'}>Per Hour</Text>
        </Pressable>
        <Pressable
          onPress={() => setUnit('month')}
          className={`px-4 py-2 rounded-r-xl border ${
            unit === 'month'
              ? 'bg-blue-500 border-blue-700'
              : 'bg-white border-blue-300'
          }`}
        >
          <Text className={unit === 'month' ? 'text-white' : 'text-blue-800'}>Per Month</Text>
        </Pressable>
      </View>

      <AppButton
        title="Save & Continue"
        onPress={handleSubmit}
      />
    </Animated.View>
  );
}
