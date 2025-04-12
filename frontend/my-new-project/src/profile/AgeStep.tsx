import { useEffect, useRef, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  Platform,
  Alert,
  Animated,
  Easing,
  Pressable as RNPressable,
} from 'react-native';
import { styled } from 'nativewind';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import Toast from 'react-native-toast-message';

const View = styled(RNView);
const Text = styled(RNText);
const TextInput = styled(RNTextInput);
const Pressable = styled(RNPressable);

export default function BirthDateStep() {
  const navigation = useNavigation<any>();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [isValidAge, setIsValidAge] = useState(true);

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

  const parseInputDate = (input: string): Date | null => {
    const parts = input.trim().split(/[./]/); // supports DD.MM.YY or DD/MM/YY
    if (parts.length !== 3) return null;

    const [dayStr, monthStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    if (yearStr.length === 2) {
      year += year < 30 ? 2000 : 1900;
    } else if (yearStr.length !== 4) {
      return null;
    }

    const date = new Date(year, month, day);
    const age = calculateAge(date);

    if (isNaN(date.getTime()) || age < 1 || age > 99) {
      setIsValidAge(false);
      return null;
    }

    setIsValidAge(true);
    return date;
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

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !birthDate) {
      Alert.alert('Please select your birth date');
      return;
    }

    const age = calculateAge(birthDate);
    if (age < 13) {
      Toast.show({
        type: 'error',
        text1: 'Cannot be under 13 years old',
      });
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        birth_date: Timestamp.fromDate(birthDate),
      });

      navigation.navigate('Location');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const formatDateInput = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString().slice(-2);
    return `${d}.${m}.${y}`;
  };

  useEffect(() => {
    if (birthDate) {
      setInputDate(formatDateInput(birthDate));
    }
  }, [birthDate]);

  const handleInputChange = (text: string) => {
    const parsedDate = parseInputDate(text);
    if (parsedDate) {
      setBirthDate(parsedDate);
    }
    setInputDate(text);
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
      <ProfileNavHeader onSkip={() => navigation.navigate('Location')} showSkip={false} showBack={false} />

      <Text className="text-2xl font-bold text-blue-700 mb-6 text-center">
        What’s your birth date?
      </Text>

      <TextInput
        placeholder="DD.MM.YY or DD/MM/YY"
        className="bg-white p-3 rounded-xl border border-blue-300 text-center mb-3"
        value={inputDate}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />

      <Pressable className="items-center mb-4" onPress={() => setShowPicker(true)}>
        <Text className="text-blue-600 text-base font-medium">Or select from calendar</Text>
        <Feather name="calendar" size={22} color="#2563eb" />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={birthDate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) {
              const age = calculateAge(selected);
              setIsValidAge(age >= 1 && age <= 99);
              setBirthDate(selected);
            }
          }}
        />
      )}

      {birthDate && (
        <View className="items-center mt-4 mb-4">
          {isValidAge ? (
            <>
              <Text className="text-blue-800 text-lg">
                You are {calculateAge(birthDate)} years old.
              </Text>
              <Text className="text-slate-600 mt-1">
                ({birthDate.toDateString()})
              </Text>
            </>
          ) : (
            <Text className="text-red-600 font-medium">
              ⚠️ Please select a valid age.
            </Text>
          )}
        </View>
      )}

      <AppButton title="Save & Continue" onPress={handleSubmit} />
    </Animated.View>
  );
}
