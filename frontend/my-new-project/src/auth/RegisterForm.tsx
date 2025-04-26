import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  Pressable,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import colors from '../styles/colors';
import spacing from '../styles/spacing';

export default function RegisterForm({ navigation, phone }: any) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlide = useRef(new Animated.Value(0)).current;

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

  const handleRegister = async () => {
    if (email !== confirmEmail)
      return Toast.show({ type: 'error', text1: 'Emails do not match' });
    if (password !== confirmPassword)
      return Toast.show({ type: 'error', text1: 'Passwords do not match' });
    if (username.length < 3)
      return Toast.show({ type: 'error', text1: 'Username too short' });

    try {
      setLoading(true);

      // check username
      const snap = await getDocs(
        query(collection(db, 'users'), where('username', '==', username))
      );
      if (!snap.empty)
        return Toast.show({ type: 'error', text1: 'Username already taken' });

      // create auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // **force a fresh token** so Firestore sees `request.auth.uid` immediately
      await auth.currentUser?.getIdToken(true);

      // write profile
      const uid = cred.user.uid;
      await setDoc(doc(db, 'users', uid), {
        id: uid,
        email,
        username,
        firstName,
        lastName,
        phone,
        profileComplete: false,
        liked_jobs: [],
        matched_jobs: [],
        disliked_jobs: {},
        created_at: serverTimestamp(),
      });

      Toast.show({ type: 'success', text1: 'Account created 🎉' });
      navigation.replace('Location'); 
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error creating account',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      contentContainerStyle={{ padding: spacing.l }}
    >
      <View style={{ marginBottom: spacing.l }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            color: colors.primary,
          }}
        >
          Create Account
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.info,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Join the fun, find your match 🎯
        </Text>
      </View>

      <Animated.View style={{ transform: [{ translateX: formSlide }] }}>
        {[
          { v: email,    p: setEmail,    ph: 'Email',         secure: false },
          { v: confirmEmail, p: setConfirmEmail, ph: 'Confirm Email', secure: false },
          { v: username, p: setUsername, ph: 'Username',     secure: false },
          { v: firstName,p: setFirstName,ph: 'First Name',   secure: false },
          { v: lastName, p: setLastName, ph: 'Last Name',    secure: false },
          { v: password, p: setPassword, ph: 'Password',      secure: !showPassword },
          { v: confirmPassword,p: setConfirmPassword, ph: 'Confirm Password', secure: !showPassword },
        ].map((f, i) => (
          <TextInput
            key={i}
            placeholder={f.ph}
            placeholderTextColor={colors.info}
            value={f.v}
            onChangeText={f.p}
            secureTextEntry={f.secure}
            style={inputStyle}
            autoCapitalize="none"
          />
        ))}

        <Pressable
          onPress={() => setShowPassword((v) => !v)}
          style={{ marginBottom: spacing.m }}
        >
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color={colors.info}
          />
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.m,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#cbd5e1', true: colors.secondary }}
              thumbColor={rememberMe ? colors.primary : '#f1f5f9'}
            />
            <Text style={{ marginLeft: spacing.s, color: colors.info }}>
              Remember Me
            </Text>
          </View>
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        <AppButton title="Register" onPress={handleRegister} />
      </Animated.View>

      <Text style={{ marginTop: spacing.l, textAlign: 'center', color: colors.info }}>
        Already have an account?{' '}
        <Text
          onPress={() => navigation.navigate('Login')}
          style={{ color: colors.secondary, fontWeight: 'bold' }}
        >
          Login
        </Text>
      </Text>
    </Animated.ScrollView>
  );
}

const inputStyle = {
  backgroundColor: 'white',
  padding: spacing.m,
  borderRadius: 12,
  marginBottom: spacing.m,
  borderColor: colors.muted,
  borderWidth: 1,
  fontSize: 16,
};
