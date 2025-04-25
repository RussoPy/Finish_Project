// src/navigation/AppStack.tsx
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileSetupNavigator from './ProfileSetupNavigator';
import EditSkillsScreen from '../screens/editors/EditSkillsScreen';
import EditTagsScreen from '../screens/editors/EditTagsScreen';
import EditIndustryScreen from '../screens/editors/EditIndustryScreen';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '../api/firebase';
import { ActivityIndicator, View as RNView } from 'react-native';
import { styled } from 'nativewind';

const Stack = createNativeStackNavigator();
const View = styled(RNView);

export default function AppStack() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
  
    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (!snap.exists()) {
        console.warn("User document does not exist yet. Going to ProfileSetup.");
        setInitialRoute('ProfileSetup'); // 👈 VERY IMPORTANT!
        return;
      }
    
      const data = snap.data();
      if (data?.profileComplete) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('ProfileSetup');
      }
    });
  
    return unsub;
  }, []);
  if (!initialRoute) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupNavigator} />
      <Stack.Screen name="EditSkills" component={EditSkillsScreen} />
      <Stack.Screen name="EditTags" component={EditTagsScreen} />
      <Stack.Screen name="EditIndustry" component={EditIndustryScreen} />
    </Stack.Navigator>
  );
}
