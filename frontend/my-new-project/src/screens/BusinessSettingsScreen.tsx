// src/screens/BusinessSettingsScreen.tsx

import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import Icon from 'react-native-vector-icons/Feather';
import ProfileImageEditor from './editors/ProfileImageEditor';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SettingsItem = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderColor: '#eee',
      backgroundColor: '#fff',
    }}
  >
    <Icon name={icon} size={20} color="#333" />
    <Text style={{ marginLeft: 16, fontSize: 16, flex: 1 }}>{label}</Text>
    <Icon name="chevron-right" size={20} color="#999" />
  </TouchableOpacity>
);

export default function BusinessSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    business_name: '',
    logo_url: '' as string | null,
    industries: [] as string[],
    benefits: [] as string[],
    location_address: '',
    availability: '',
    minimum_age: '',
    salary_min: '',
    salary_max: '',
    description: '',
    imageUrls: [] as string[], // ✅ <<< ADD THIS LINE
  });

  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          business_name: d.business_name || '',
          logo_url: d.logo_url || null,
          industries: d.industries || [],
          benefits: d.benefits || [],
          location_address: d.location_address || '',
          availability: d.availability || '',
          minimum_age: d.minimum_age ? d.minimum_age.toString() : '',
          salary_min: d.salary_min ? d.salary_min.toString() : '',
          salary_max: d.salary_max ? d.salary_max.toString() : '',
          description: d.description || '',
          imageUrls: d.imageUrls || [], // ✅ ADD THIS
        });
      }
      setLoading(false);
    })();
  }, []);

  const saveAll = async () => {
    try {
      const uid = auth.currentUser!.uid;
      await updateDoc(doc(db, 'users', uid), { ...form });
      Toast.show({ type: 'success', text1: 'Changes saved!', visibilityTime: 2000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error saving changes', text2: e.message });
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Loading…</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Top header */}
      <View style={{ backgroundColor: '#81c9f0', paddingHorizontal: 20, paddingVertical: 24, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => signOut(auth)}
          style={{
            position: 'absolute',
            top: 54,
            left: 20,
            backgroundColor: '#fff',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: '#ccc',
            zIndex: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#333' }}>Logout</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontFamily: 'PoetsenOne_400Regular', marginBottom: 25, marginTop: 30, textAlign: 'center', color: '#222222', letterSpacing: 0.3 }}>
          Business Settings
        </Text>

        <View style={{ position: 'relative', marginBottom: 16 }}>
          <ProfileImageEditor
            imageUri={form.logo_url!}
            onChange={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 12, padding: 8, elevation: 3 }}>
            <Icon name="upload" size={14} color="#333" />
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', fontFamily: 'PoetsenOne_400Regular' }}>
          {form.business_name || 'Your Business Name'}
        </Text>

        <Text style={{ color: '#666', marginTop: 6, fontFamily: 'PoetsenOne_400Regular' }}>
          {form.location_address || 'No location added'}
        </Text>
      </View>

      {/* Settings Items */}
      <ScrollView style={{ flex: 1 }}>
  <SettingsItem
    icon="map-pin"
    label="Location Address"
    onPress={() => {
      navigation.navigate('EditLocation', {
        currentAddress: form.location_address,
        onSave: (val: string) => setForm((prev) => ({ ...prev, location_address: val })),
      });
    }}
  />

  <SettingsItem
    icon="briefcase"
    label="Industry"
    onPress={() => navigation.navigate('EditIndustry', {
      currentIndustries: form.industries,
      onSave: (val: string[]) => setForm((prev) => ({ ...prev, industries: val })),
    })}
  />

  <SettingsItem
    icon="gift"
    label="Benefits"
    onPress={() => navigation.navigate('EditBenefits', {
      currentBenefits: form.benefits,
      onSave: (val: string[]) => setForm((prev) => ({ ...prev, benefits: val })),
    })}
  />

  <SettingsItem
    icon="clock"
    label="Availability"
    onPress={() => navigation.navigate('EditAvailability', {
      currentAvailability: form.availability,
      onSave: (val: string) => setForm((prev) => ({ ...prev, availability: val })),
    })}
  />

  <SettingsItem
    icon="user"
    label="Minimum Age"
    onPress={() => navigation.navigate('EditMinimumAge', {
      currentAge: form.minimum_age,
      onSave: (val: string) => setForm((prev) => ({ ...prev, minimum_age: val })),
    })}
  />

  <SettingsItem
    icon="dollar-sign"
    label="Salary Range"
    onPress={() => navigation.navigate('SalaryEditor', {
      salaryMin: form.salary_min,
      salaryMax: form.salary_max,
      onSave: (min: string, max: string) => setForm((prev) => ({ ...prev, salary_min: min, salary_max: max })),
    })}
  />

<SettingsItem
  icon="image"
  label="Upload Company Images"
  onPress={() => {
    navigation.navigate('EditImages', {
      currentImages: form.imageUrls || [],
      onSave: (val: string[]) => setForm((prev) => ({ ...prev, imageUrls: val })),
    });
  }}
/>

  <SettingsItem
    icon="file-text"
    label="Business Description"
    onPress={() => navigation.navigate('EditDescription', {
      currentDescription: form.description,
      onSave: (val: string) => setForm((prev) => ({ ...prev, description: val })),
    })}
  />

  {/* Save button */}
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Button
      mode="contained"
      onPress={saveAll}
      style={{
        backgroundColor: '#81c9f0',
        borderRadius: 20,
        alignSelf: 'center',
        paddingHorizontal: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 8,
      }}
      contentStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
      labelStyle={{
        fontFamily: 'RobotoMono_400Regular',
        fontWeight: '600',
        color: 'black',
        fontSize: 16,
      }}
    >
      Save All Changes
    </Button>
  </View>
</ScrollView>

      <Toast />
    </View>
  );
}
