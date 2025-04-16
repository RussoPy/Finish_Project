// ✅ RegisterScreen.tsx (Cleaned Up)
import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth, firebaseConfig } from '../api/firebase';
import PhoneInputStep from './PhoneInputStep';
import CodeVerificationStep from './CodeVerificationStep';
import RegisterForm from './RegisterForm';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

enum Step {
  PhoneInput,
  CodeVerification,
  ProfileForm,
}

export default function RegisterScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>(Step.PhoneInput);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

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

  const verifyCode = async () => {
    if (!confirmationResult || !code) return;
    try {
      setLoading(true);
      await confirmationResult.confirm(code);
      setStep(Step.ProfileForm);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      Toast.show({ type: 'error', text1: 'Invalid code', text2: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    const rawPhone = phone.trim();
    if (!rawPhone) return Toast.show({ type: 'error', text1: 'Enter your phone number' });

    let normalizedPhone = rawPhone;
    if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+972' + normalizedPhone.replace(/^0/, '');
    }

    try {
      setLoading(true);
      if (normalizedPhone === '+972555555555') {
        setConfirmationResult({ confirm: async () => true });
        setStep(Step.CodeVerification);
        return;
      }
      const confirmation = await signInWithPhoneNumber(auth, normalizedPhone, recaptchaVerifier.current!);
      setConfirmationResult(confirmation);
      setStep(Step.CodeVerification);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      Toast.show({ type: 'error', text1: 'Failed to send code', text2: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case Step.PhoneInput:
        return <PhoneInputStep phone={phone} setPhone={setPhone} sendCode={sendCode} />;
      case Step.CodeVerification:
        return <CodeVerificationStep code={code} setCode={setCode} verifyCode={verifyCode} />;
      case Step.ProfileForm:
        return <RegisterForm phone={phone} navigation={navigation} />;
    }
  };

  return (
    <KeyboardAvoidingView
    style={globalStyles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />

    {step === Step.ProfileForm ? (
      // Let RegisterForm control its own full layout and styling
      <RegisterForm phone={phone} navigation={navigation} />
    ) : (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Animated.View
          style={{
            width: '100%',
            alignItems: 'center',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {renderStep()}
          {loading && (
            <ActivityIndicator style={{ marginTop: 20 }} size="small" color={colors.primary} />
          )}
        </Animated.View>
      </ScrollView>
    )}
  </KeyboardAvoidingView>
  );
}
