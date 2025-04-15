// src/auth/LoginScreen.tsx
import { useState, useRef, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  View as RNView,
  Text as RNText,
  Animated,
  Easing,
  ActivityIndicator,
  Pressable,
  Switch,
} from 'react-native';
import { styled } from 'nativewind';
import { AppButton } from '../components/AppButton';
import { useAuth } from './useAuth';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

const View = styled(RNView);
const Text = styled(RNText);
const TextInput = styled(RNTextInput);

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Welcome back 👋',
        text2: 'Logged in successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login failed ❌',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#f0f9ff',
        padding: 20,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        justifyContent: 'center',
      }}
    >
      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-blue-600 text-center">Welcome Back</Text>
        <Text className="text-base text-blue-800 text-center mt-2">Login to your Flowjob account</Text>
      </View>

      <TextInput
        className="bg-white p-3 rounded-xl mb-4 border border-blue-200"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className="flex-row items-center border border-blue-200 rounded-xl px-3 mb-2 bg-white">
        <TextInput
          className="flex-1 py-3"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#64748b"
          />
        </Pressable>
      </View>

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

        {loading && (
          <ActivityIndicator size="small" color="#0ea5e9" />
        )}
      </View>

      <AppButton
        title="Login"
        onPress={handleLogin}
        
      />

      <Text className="mt-6 text-center text-blue-700">
        Don’t have an account?{' '}
        <Text
          onPress={() => navigation.navigate('Register')}
          className="text-indigo-600 font-bold"
        >
          Register
        </Text>
      </Text>
    </Animated.View>
  );
}
