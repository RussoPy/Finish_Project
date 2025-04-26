// src/screens/WorkerSettingsScreen.tsx

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import Icon from 'react-native-vector-icons/Feather';
import ProfileImageEditor from './editors/ProfileImageEditor';
import AvailabilityEditor from './editors/AvailabilityEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import SalaryEditor from './editors/SalaryEditor';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';

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

type WorkerForm = {
  availability: string[];
  experience_level: string;
  preferred_tags: string[];
  preferences: string[];
  skills: string[];
  salary_min: string;
  salary_max: string;
  salary_unit: 'hour' | 'month';
};

export default function WorkerSettingsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<WorkerForm>({
    availability: [],
    experience_level: '',
    preferred_tags: [],
    preferences: [],
    skills: [],
    salary_min: '',
    salary_max: '',
    salary_unit: 'month',
  });

  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) {
        setLoading(false);
        return;
      }
      const d = snap.data();
      setData(d);
      setForm({
        availability: d.availability || [],
        experience_level: d.experience_level || '',
        preferred_tags: d.preferred_tags || [],
        preferences: d.preferences || [],
        skills: d.skills || [],
        salary_min: d.salary_min ?? '',
        salary_max: d.salary_max ?? '',
        salary_unit: d.salary_unit || 'month',
      });
      setLoading(false);
    })();
  }, []);

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => (prev === key ? null : key));
  };

  const saveAll = async () => {
    try {
      const uid = auth.currentUser!.uid;
      await updateDoc(doc(db, 'users', uid), { ...form });
      Toast.show({ type: 'success', text1: 'Changes saved!', visibilityTime: 2000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error saving changes', text2: e.message });
    }
  };

  if (loading || !data) {
    return <Text style={{ padding: 20 }}>Loading…</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Header */}
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

        <Text style={{ fontSize: 22, fontFamily: 'PoetsenOne_400Regular', marginTop: 30, marginBottom: 25, color: '#222', letterSpacing: 0.3 }}>
          Worker Settings
        </Text>

        <View style={{ position: 'relative', marginBottom: 16 }}>
          <ProfileImageEditor
            imageUri={data.profileImage}
            onChange={(url: string) => setData((prev: any) => ({ ...prev, profileImage: url }))}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 12, padding: 8, elevation: 3 }}>
            <Icon name="upload" size={14} color="#333" />
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', fontFamily: 'PoetsenOne_400Regular' }}>
          {data.firstName} {data.lastName}
        </Text>

        <Text style={{ color: '#666', marginTop: 6, fontFamily: 'PoetsenOne_400Regular', fontSize: 13 }}>
          {data.location_address || 'No location added'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <SettingsItem icon="calendar" label="Availability" onPress={() => toggle('availability')} />
        {expanded === 'availability' && (
          <AvailabilityEditor
            value={form.availability}
            onChange={(val) => setForm((prev) => ({ ...prev, availability: val }))}
          />
        )}

        <SettingsItem icon="briefcase" label="Experience" onPress={() => toggle('experience')} />
        {expanded === 'experience' && (
          <ExperienceEditor
            value={form.experience_level}
            onChange={(val) => setForm((prev) => ({ ...prev, experience_level: val }))}
          />
        )}

        <SettingsItem icon="layers" label="Industry" onPress={() => navigation.navigate('EditIndustry')} />
        <SettingsItem icon="tag" label="Tags" onPress={() => navigation.navigate('EditTags')} />
        <SettingsItem icon="sliders" label="Skills" onPress={() => navigation.navigate('EditSkills')} />

        <SettingsItem icon="dollar-sign" label="Salary" onPress={() => toggle('salary')} />
        {expanded === 'salary' && (
          <SalaryEditor
            min={form.salary_min}
            max={form.salary_max}
            unit={form.salary_unit}
            onChange={({ min, max, unit }) =>
              setForm((prev) => ({ ...prev, salary_min: min, salary_max: max, salary_unit: unit }))
            }
          />
        )}

        {/* Save Button */}
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
            labelStyle={{ fontFamily: 'RobotoMono_400Regular', fontWeight: '600', color: 'black', fontSize: 16 }}
          >
            Save All Changes
          </Button>
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
}