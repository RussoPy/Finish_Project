import { useState, useRef, useEffect } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { styled } from 'nativewind';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const View = styled(RNView);
const Text = styled(RNText);
const TextInput = styled(RNTextInput);

export default function SalaryStep() {
  const navigation = useNavigation<any>();
  const [salary, setSalary] = useState('');
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
    const parsed = parseInt(salary);

    if (!uid || isNaN(parsed)) {
      return Alert.alert('Please enter a valid number');
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        salaryExpectation: parsed,
        profileComplete: true,
      });

      Alert.alert('🎉 Profile complete!');
      navigation.replace('Home');
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
        Expected Monthly Salary
      </Text>

      <TextInput
        className="bg-white p-3 rounded-xl border border-blue-200 text-center text-xl"
        placeholder="₪ e.g. 9000"
        value={salary}
        onChangeText={setSalary}
        keyboardType="numeric"
      />

      <AppButton
        title="Finish"
        onPress={handleSubmit}
      />
    </Animated.View>
  );
}
