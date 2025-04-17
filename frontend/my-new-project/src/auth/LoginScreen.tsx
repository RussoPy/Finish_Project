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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { styled } from 'nativewind';
import { AppButton } from '../components/AppButton';
import { useAuth } from './useAuth';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';
import { Image } from 'react-native';


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
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={{ alignItems: 'center' }}>
  <Image
    source={require('../assets/icon.png')}
    style={{
      width: 110,
    height: 110,
    marginBottom: 28,
    borderRadius: 24,
    }}
    resizeMode="contain"
  />
<Text
  style={{
    fontFamily: 'BubblegumSans_400Regular',
    fontSize: 32,
    textAlign: 'center',
    color: colors.primary,
  }}
>
  Welcome Back
</Text>
<Text style={{ textAlign: 'center', color: colors.info, marginBottom: 24 }}>
    Login to your Flowjob account
  </Text>
</View>

          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.info}
            style={[globalStyles.input, {
              backgroundColor: 'white',
              padding: 14,
              borderWidth: 1,
              borderColor: colors.muted,
            }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={[
            globalStyles.input,
            {
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: colors.muted,
            }
          ]}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.info}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{ flex: 1, paddingVertical: 14 }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.info}
              />
            </Pressable>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: colors.muted, true: colors.secondary }}
                thumbColor={rememberMe ? colors.primary : '#f1f5f9'}
              />
              <Text style={{ marginLeft: 8, color: colors.info }}>Remember Me</Text>
            </View>
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>

          <AppButton title="Login" onPress={handleLogin} />

          <Text style={{ marginTop: 40, textAlign: 'center', color: colors.primary }}>
            Don’t have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={globalStyles.highlightText}
            >
              Register
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
