import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from 'react-native';
import { auth, db } from '../../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button, Text } from 'react-native-paper';

const options = ['Unexperienced', 'Beginner', 'Intermediate', 'Expert'];

export default function ExperienceStep() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string | null>(null);
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
    if (!uid || !selected) {
      Alert.alert('Please select your experience level');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        experience_level: selected,
      });

      navigation.navigate('Salary');
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
      {/* 🔙 Nav Header */}
      <ProfileNavHeader
        stepText="6/10"
        progress={0.6}
        onSkip={() => navigation.navigate('Salary')}
        showBack={true}
        showSkip={true}
      />

      {/* 🏷️ Title */}
      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        your <Text style={{ color: colors.secondary }}>experience?</Text>
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
        Let us know your experience level to help match you with jobs that fit.
      </Text>

      {/* 💡 Experience Options */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => setSelected(opt)}
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

      {/* ✅ Floating Next Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!selected}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor: selected ? colors.primary : colors.muted,
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
