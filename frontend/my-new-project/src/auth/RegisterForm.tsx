// ✅ RegisterForm.tsx (Themed + Firebase + Integrated logic)
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
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
import { doc, getDocs, collection, query, where, setDoc } from 'firebase/firestore';
import colors from '../styles/colors';
import spacing from '../styles/spacing';

export default function RegisterForm({ navigation, phone }: any) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    if (email !== confirmEmail) return Toast.show({ type: 'error', text1: 'Emails do not match' });
    if (password !== confirmPassword) return Toast.show({ type: 'error', text1: 'Passwords do not match' });
    if (username.length < 3) return Toast.show({ type: 'error', text1: 'Username too short' });

    try {
      setLoading(true);

      const usernameSnap = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
      if (!usernameSnap.empty) return Toast.show({ type: 'error', text1: 'Username already taken' });

      Animated.timing(formSlide, {
        toValue: -400,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        username,
        firstName,
        lastName,
        phone,
      });

      setTimeout(() => {
        Toast.show({ type: 'success', text1: 'Account created 🎉' });
        navigation.navigate('Login');
      }, 500);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error creating account', text2: err.message });
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
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: colors.primary }}>
          Create Account
        </Text>
        <Text style={{ fontSize: 14, color: colors.info, textAlign: 'center', marginTop: 8 }}>
          Join the fun, find your match 🎯
        </Text>
      </View>

      <Animated.View style={{ transform: [{ translateX: formSlide }] }}>
        {[email, confirmEmail, username, firstName, lastName].map((_, i) => (
          <TextInput
            key={i}
            placeholder={['Email', 'Confirm Email', 'Username', 'First Name', 'Last Name'][i]}
            placeholderTextColor={colors.info}
            value={[email, confirmEmail, username, firstName, lastName][i]}
            onChangeText={[setEmail, setConfirmEmail, setUsername, setFirstName, setLastName][i]}
            style={{
              backgroundColor: 'white',
              padding: spacing.m,
              borderRadius: 12,
              marginBottom: spacing.m,
              borderColor: colors.muted,
              borderWidth: 1,
              fontSize: 16,
            }}
            autoCapitalize={i < 2 ? 'none' : 'words'}
          />
        ))}

        {[password, confirmPassword].map((_, i) => (
          <TextInput
            key={i}
            placeholder={i === 0 ? 'Password' : 'Confirm Password'}
            placeholderTextColor={colors.info}
            value={i === 0 ? password : confirmPassword}
            onChangeText={i === 0 ? setPassword : setConfirmPassword}
            secureTextEntry={!showPassword}
            style={{
              backgroundColor: 'white',
              padding: spacing.m,
              borderRadius: 12,
              marginBottom: spacing.m,
              borderColor: colors.muted,
              borderWidth: 1,
              fontSize: 16,
            }}
          />
        ))}

        <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginBottom: spacing.m }}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.info} />
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.m }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#cbd5e1', true: colors.secondary }}
              thumbColor={rememberMe ? colors.primary : '#f1f5f9'}
            />
            <Text style={{ marginLeft: spacing.s, color: colors.info }}>Remember Me</Text>
          </View>
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        <AppButton title="Register" onPress={handleRegister} />
      </Animated.View>

      <Text style={{ marginTop: spacing.l, textAlign: 'center', color: colors.info }}>
        Already registered?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={{ color: colors.secondary, fontWeight: 'bold' }}>
          Login
        </Text>
      </Text>
    </Animated.ScrollView>
  );
}
