// src/auth/RegisterScreen.tsx
import { useState, useRef, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  View as RNView,
  Text as RNText,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
  Pressable,
  Switch,
} from 'react-native';
import { styled } from 'nativewind';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import {
  createUserWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

const View = styled(RNView);
const Text = styled(RNText);
const TextInput = styled(RNTextInput);

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
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
    if (email !== confirmEmail) {
      return Toast.show({
        type: 'error',
        text1: 'Emails do not match',
      });
    }

    if (phone !== confirmPhone) {
      return Toast.show({
        type: 'error',
        text1: 'Phone numbers do not match',
      });
    }

    if (!username || username.length < 3) {
      return Toast.show({
        type: 'error',
        text1: 'Username too short',
      });
    }

    try {
      setLoading(true);

      const q = query(collection(db, 'users'), where('username', '==', username));
      const q2 = query(collection(db, 'users'), where('phone', '==', phone));
      const [usernameSnap, phoneSnap] = await Promise.all([
        getDocs(q),
        getDocs(q2),
      ]);

      if (usernameSnap.docs.length > 0) {
        return Toast.show({
          type: 'error',
          text1: 'Username already taken',
        });
      }

      if (phoneSnap.docs.length > 0) {
        return Toast.show({
          type: 'error',
          text1: 'Phone number already used',
        });
      }

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
        Toast.show({
          type: 'success',
          text1: 'Account created 🎉',
        });
        navigation.navigate('Login');
      }, 500);
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
        backgroundColor: '#f0f9ff',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      contentContainerStyle={{ padding: 20 }}
    >
      <View className="mt-10 mb-6">
        <Text className="text-3xl font-extrabold text-blue-600 text-center">Create Account</Text>
        <Text className="text-base text-blue-800 text-center mt-2">
          Join the fun, find your match 🎯
        </Text>
      </View>

      <Animated.View style={{ transform: [{ translateX: formSlide }] }}>
        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="Confirm Email"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View className="flex-row items-center border border-blue-200 rounded-xl px-3 mb-3 bg-white">
          <TextInput
            className="flex-1 py-3"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#64748b" />
          </Pressable>
        </View>

        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          className="bg-white p-3 rounded-xl mb-3 border border-blue-200"
          placeholder="Confirm Phone Number"
          value={confirmPhone}
          onChangeText={setConfirmPhone}
          keyboardType="phone-pad"
        />

        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#cbd5e1', true: '#38bdf8' }}
              thumbColor={rememberMe ? '#0ea5e9' : '#f1f5f9'}
            />
            <Text className="ml-2 text-slate-700">Remember Me</Text>
          </View>

          {loading && <ActivityIndicator size="small" color="#0ea5e9" />}
        </View>

        <AppButton
          title="Register"
          onPress={handleRegister}
        />
      </Animated.View>

      <Text className="mt-6 text-center text-blue-700">
        Already registered?{' '}
        <Text
          onPress={() => navigation.navigate('Login')}
          className="text-indigo-600 font-bold"
        >
          Login
        </Text>
      </Text>
    </Animated.ScrollView>
  );
}
