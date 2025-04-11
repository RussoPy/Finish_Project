import { useEffect, useRef, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  Platform,
  Button,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { styled } from 'nativewind';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const View = styled(RNView);
const Text = styled(RNText);

export default function BirthDateStep() {
  const navigation = useNavigation<any>();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
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
    if (!uid || !birthDate) {
      Alert.alert('Please select your birth date');
      return;
    }

    const age = calculateAge(birthDate);
    if (age < 18 || age > 99) {
      Alert.alert('You must be between 18 and 99 years old');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        birth_date: Timestamp.fromDate(birthDate),
      });

      navigation.navigate('Experience');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
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
        What’s your birth date?
      </Text>

      <View className="items-center mb-4">
        <Button
          title={birthDate ? birthDate.toDateString() : 'Select Birth Date'}
          onPress={() => setShowPicker(true)}
          color="#3b82f6"
        />
      </View>

      {showPicker && (
        <DateTimePicker
          value={birthDate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) setBirthDate(selected);
          }}
        />
      )}

      <AppButton
        title="Save & Continue"
        onPress={handleSubmit}
        bg="bg-gradient-to-r from-indigo-500 to-indigo-700"
      />
    </Animated.View>
  );
}
