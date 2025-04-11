import { useEffect, useRef, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
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
const Pressable = styled(RNPressable);
const ScrollView = styled(RNScrollView);

const allCities = [
  { city: 'Tel Aviv', state: 'Center' },
  { city: 'Jerusalem', state: 'Jerusalem' },
  { city: 'Haifa', state: 'North' },
  { city: 'Beersheba', state: 'South' },
  { city: 'Petah Tikva', state: 'Center' },
  { city: 'Netanya', state: 'Center' },
  { city: 'Rishon LeZion', state: 'Center' },
  { city: 'Ashdod', state: 'South' },
  { city: 'Herzliya', state: 'Center' },
  { city: 'Bat Yam', state: 'Center' },
  { city: 'Kfar Saba', state: 'Center' },
  { city: 'Eilat', state: 'South' },
  { city: 'Acre', state: 'North' },
  { city: 'Tiberias', state: 'North' },
  { city: 'Nazareth', state: 'North' },
  { city: 'Modi’in', state: 'Center' },
  { city: 'Ra’anana', state: 'Center' },
  { city: 'Ashkelon', state: 'South' },
  { city: 'Nahariya', state: 'North' },
];

export default function LocationStep() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<{ city: string; state: string } | null>(null);
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

  const filtered = allCities.filter((loc) =>
    loc.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !selected) {
      Alert.alert('Please select a city');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        location: selected,
      });

      navigation.navigate('Salary');
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
      }}
    >
      <Text className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Where Do You Live?
      </Text>

      <TextInput
        placeholder="Search city..."
        value={search}
        onChangeText={setSearch}
        className="bg-white p-3 rounded-xl border border-blue-200 mb-2"
      />

      <ScrollView className="mb-4 max-h-[240px]">
        {filtered.map((loc) => (
          <Pressable
            key={loc.city}
            onPress={() => {
              setSelected(loc);
              setSearch(loc.city);
            }}
            className={`p-3 rounded-lg mb-1 border ${
              selected?.city === loc.city
                ? 'bg-blue-500 border-blue-700'
                : 'bg-white border-blue-300'
            }`}
          >
            <Text
              className={`text-sm ${
                selected?.city === loc.city ? 'text-white' : 'text-blue-800'
              }`}
            >
              {loc.city}, {loc.state}
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
