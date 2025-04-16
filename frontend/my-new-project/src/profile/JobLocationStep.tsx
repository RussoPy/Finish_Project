import { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import { Button } from 'react-native-paper';
import Slider from '../components/Slider';

export default function JobLocationStep() {
  const navigation = useNavigation<any>();
  const [sliderValue, setSliderValue] = useState(5); // animating as you slide
  const [committedValue, setCommittedValue] = useState(5); // final value on release

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
    if (!uid) {
      Alert.alert('Please select your preferred distance');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        job_search_radius: committedValue,
        profileComplete: true,
      });

      Alert.alert('🎉 Job preferences complete!');
      navigation.replace('Home');
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
      {/* 🧭 Header */}
      <ProfileNavHeader
        stepText="9/10"
        progress={0.9}
        onSkip={() => navigation.replace('Home')}
        showBack
        showSkip={false}
      />

      {/* 📦 Shifted Content Higher */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* 🎯 Title */}
        <Text style={[globalStyles.title]}>
          Job's <Text style={{ color: colors.secondary }}>distance</Text>?
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
          Use the slider to set the maximum distance you’d like potential jobs to be located.
        </Text>

        {/* 📏 Slider */}
        <View style={{ paddingHorizontal: spacing.l }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontWeight: '600', color: colors.primary }}>Distance</Text>
            <Text style={{ fontWeight: '600', color: colors.primary }}>{sliderValue} km</Text>
          </View>

          <Slider
            initialValue={sliderValue}
            onValueChange={(val) => {
              setSliderValue(val);
              setCommittedValue(val);
            }}
          />
        </View>

        {/* ℹ️ Info */}
        <Text
          style={{
            color: colors.info,
            fontSize: 12,
            textAlign: 'center',
            marginTop: spacing.m,
          }}
        >
          You can change this preference later in settings.
        </Text>
      </View>

      {/* ✅ Finish Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor: colors.primary,
          },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Finish
      </Button>
    </Animated.View>
  );
}
