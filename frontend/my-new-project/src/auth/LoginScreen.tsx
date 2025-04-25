import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, ActivityIndicator, Animated, Easing, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AppButton } from '../components/AppButton';
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ensureUserProfileExists } from '../helpers/ensureUserProfileExists';
import colors from '../styles/colors';
import spacing from '../styles/spacing';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Ensure Firestore user profile exists
      await ensureUserProfileExists();

      Toast.show({ type: 'success', text1: 'Welcome back 👋' });
      // Let AppStack handle redirection after login
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Login failed ❌', text2: error.message });
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
        {/* Your logo area */}
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: colors.primary }}>
          Welcome Back
        </Text>
        <Text style={{ fontSize: 14, color: colors.info, textAlign: 'center', marginTop: 8 }}>
          Let's continue your journey 🚀
        </Text>
      </View>

      <Animated.View style={{ transform: [{ translateX: formSlide }] }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.info}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={inputStyle}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.info}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={inputStyle}
        />

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

        <AppButton title="Login" onPress={handleLogin} />
      </Animated.View>

      <Text style={{ marginTop: spacing.l, textAlign: 'center', color: colors.info }}>
        New here?{' '}
        <Text onPress={() => navigation.navigate('Register')} style={{ color: colors.secondary, fontWeight: 'bold' }}>
          Register
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
