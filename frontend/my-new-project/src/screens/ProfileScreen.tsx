// src/screens/ProfileScreen.tsx

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text } from 'react-native-paper';
import { auth, db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';
import WorkerSettingsScreen from './WorkerSettingsScreen';
import BusinessSettingsScreen from './BusinessSettingsScreen';

export default function ProfileScreen() {
  const [role, setRole] = useState<'worker' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setRole(snap.data().role);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Text style={{ padding: 20 }}>Loading…</Text>;

  if (role === 'business') {
    return <BusinessSettingsScreen />; // ✅ No navigation prop
  }
  return <WorkerSettingsScreen />; // ✅ No navigation prop
}
