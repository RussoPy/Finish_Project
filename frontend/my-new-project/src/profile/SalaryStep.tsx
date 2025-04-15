import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import { Button } from 'react-native-paper';

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

    if (!uid || isNaN(parsedMin) || (parsedMax && parsedMin > parsedMax)) {
      Alert.alert('Please enter a valid salary range');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        salary_min: parsedMin,
        salary_max: parsedMax || null,
        salary_unit: unit,
      });

      navigation.navigate('Availability');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const isValid = !isNaN(parseInt(min));

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
      {/* 🔙 Header */}
      <ProfileNavHeader
        stepText="7/10"
        progress={0.7}
        onSkip={() => navigation.navigate('Availability')}
        showBack={true}
        showSkip={true}
      />

      {/* 💸 Title */}
      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        Salary <Text style={{ color: colors.secondary }}>Expectations?</Text>
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
        What’s your expected salary range?
      </Text>

      {/* 🧾 Minimum Salary */}
      <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: 4 }}>
        Minimum Salary (₪)
      </Text>
      <TextInput
        placeholder="e.g. 6000"
        value={min}
        onChangeText={setMin}
        keyboardType="numeric"
        style={{
          height: 48,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingHorizontal: spacing.m,
          borderColor: colors.muted,
          borderWidth: 1,
          textAlign: 'center',
          marginBottom: spacing.m,
        }}
      />

      {/* 🧾 Maximum Salary */}
      <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: 4 }}>
        Maximum Salary (₪)
      </Text>
      <TextInput
        placeholder="Optional"
        value={max}
        onChangeText={setMax}
        keyboardType="numeric"
        style={{
          height: 48,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingHorizontal: spacing.m,
          borderColor: colors.muted,
          borderWidth: 1,
          textAlign: 'center',
          marginBottom: spacing.m,
        }}
      />

      {/* ⏱ Salary Unit Toggle */}
      <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: spacing.s }}>
        Salary Unit
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: spacing.xl,
        }}
      >
        {['hour', 'month'].map((u) => {
          const isActive = unit === u;
          return (
            <Pressable
              key={u}
              onPress={() => setUnit(u as 'hour' | 'month')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: isActive ? colors.primary : '#fff',
                borderWidth: 1,
                borderColor: isActive ? colors.primary : colors.muted,
                borderTopLeftRadius: u === 'hour' ? 12 : 0,
                borderBottomLeftRadius: u === 'hour' ? 12 : 0,
                borderTopRightRadius: u === 'month' ? 12 : 0,
                borderBottomRightRadius: u === 'month' ? 12 : 0,
              }}
            >
              <Text
                style={{
                  color: isActive ? '#fff' : colors.primary,
                  fontWeight: '600',
                }}
              >
                Per {u.charAt(0).toUpperCase() + u.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ✅ Floating Next */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isValid}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor: isValid ? colors.primary : colors.muted,
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
