// src/profile/business/ConfirmPublishStep.tsx

import * as React from 'react';
import { useState } from 'react';
import { View as RNView, Alert } from 'react-native';
import { styled } from 'nativewind';
import {
  CommonActions,
  useNavigation,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator';
import type { AppStackParamList } from '../../navigation/AppStack'; // <-- import your AppStack types

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button, Text as PaperText } from 'react-native-paper';
import { auth, db } from '../../api/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const View = styled(RNView);
const Text = styled(PaperText);

// Still type your local navigator for params you use here:
type ConfirmPublishNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'ConfirmPublish'
>;

export default function ConfirmPublishStep() {
  const navigation = useNavigation<ConfirmPublishNavProp>();
  // Now grab the parent AppStack navigator:
  const rootNav = navigation.getParent<
    NativeStackNavigationProp<AppStackParamList>
  >();

  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return Alert.alert('Error', 'User not authenticated.');
    }

    setPublishing(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        business_id: uid,
        title: 'Untitled Job',
        description: '',
        tags: [],
        skills_needed: [],
        experience_required: '',
        availability: '',
        is_active: true,
        applicants: [],
        matches: [],
        rejected: {},
        created_at: serverTimestamp(),
      });

      Alert.alert('Success', 'Your first job is live!');

      // Reset the **root** navigator to Home:
      rootNav?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (err: any) {
      Alert.alert('Publish failed', err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <ProfileNavHeader
        stepText="12/12"
        progress={1}
        showBack
        showSkip={false}
      />

      <Text className="text-2xl font-bold" style={{ marginTop: spacing.xl + 40, textAlign: 'center' }}>
        All set!
      </Text>

      <Text style={{ color: colors.info, textAlign: 'center', marginVertical: spacing.l }}>
        Review your settings and publish your first job posting. You can edit it anytime from the dashboard.
      </Text>

      <Button
        mode="contained"
        onPress={handlePublish}
        disabled={publishing}
        style={[
          globalStyles.button,
          {
            backgroundColor: publishing ? colors.muted : colors.primary,
          },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        {publishing ? 'Publishing…' : 'Publish Job'}
      </Button>
    </View>
  );
}
