// src/profile/RoleStep.tsx

import React from 'react';
import {
  View as RNView,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  Alert,
} from 'react-native';
import { styled } from 'nativewind';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { auth, db } from '../api/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// ① Import your ParamList
import type { ProfileSetupParamList } from '../navigation/ProfileSetupNavigator';

const View = styled(RNView);
const Text = styled(RNText);
const Button = styled(RNTouchableOpacity);

// ② Create a navigation prop type for the 'Role' screen
type RoleNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'Role'
>;

export default function RoleStep() {
  // ③ Tell TS which stack & screen we're in
  const navigation = useNavigation<RoleNavProp>();

  async function selectRole(role: 'worker' | 'business') {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return Alert.alert('Error', 'No authenticated user.');
    }

    // seed the user doc
    await setDoc(
      doc(db, 'users', uid),
      {
        role,
        profileComplete: false,
        created_at: serverTimestamp(),
      },
      { merge: true }
    );

    // ④ Reset into the correct first step; 'WorkerAge' | 'BusinessName' are valid keys
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: role === 'worker' ? 'WorkerAge' : 'BusinessName',
          },
        ],
      })
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl mb-8">What brings you here?</Text>

      <Button
        className="w-full bg-blue-500 p-4 rounded-lg mb-4"
        onPress={() => selectRole('worker')}
      >
        <Text className="text-center text-white">I’m looking for a Job</Text>
      </Button>

      <Button
        className="w-full bg-green-500 p-4 rounded-lg"
        onPress={() => selectRole('business')}
      >
        <Text className="text-center text-white">I want to Post Jobs</Text>
      </Button>
    </View>
  );
}
