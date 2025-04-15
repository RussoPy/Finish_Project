import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import AvailabilityEditor from './editors/AvailabilityEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import IndustryEditor from './editors/IndustryEditor';
import TagsEditor from './editors/TagsEditor';
import SkillEditor from './editors/SkillEditor';
import SalaryEditor from './editors/SalaryEditor';
import { GOOGLE_MAPS_API_KEY } from '@env';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ProfileForm = {
  availability: string[];
  experience_level: string;
  preferred_tags: string[];
  preferences: string[];
  skills: string[];
  salary_min: number | string;
  salary_max: number | string;
  salary_unit: 'hour' | 'month';
};

const Section = ({
  title,
  children,
  expanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <View style={{ marginBottom: spacing.l }}>
    <TouchableOpacity
      onPress={onToggle}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: spacing.m,
        borderColor: colors.muted,
        borderWidth: 1,
        marginBottom: expanded ? spacing.s : 0,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>{title}</Text>
    </TouchableOpacity>
    {expanded && <View style={{ paddingHorizontal: spacing.m }}>{children}</View>}
  </View>
);

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

async function getReadableAddress(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    return data.results?.[0]?.formatted_address || `(${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  } catch {
    return `(${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  }
}

export default function ProfileScreen() {
  const [data, setData] = useState<any>(null);
  const [locationText, setLocationText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    availability: [],
    experience_level: '',
    preferred_tags: [],
    preferences: [],
    skills: [],
    salary_min: '',
    salary_max: '',
    salary_unit: 'month',
  });

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userSnap = await getDoc(doc(db, 'users', uid));
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setData(userData);
        setForm({
          availability: userData.availability || [],
          experience_level: userData.experience_level || '',
          preferred_tags: userData.preferred_tags || [],
          preferences: userData.preferences || [],
          skills: userData.skills || [],
          salary_min: userData.salary_min || '',
          salary_max: userData.salary_max || '',
          salary_unit: userData.salary_unit || 'month',
        });

        // Fetch readable address
        if (userData.location_lat && userData.location_lng) {
          const address = await getReadableAddress(userData.location_lat, userData.location_lng);
          setLocationText(address);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => (prev === key ? null : key));
  };

  const handleSaveAll = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await updateDoc(doc(db, 'users', uid), { ...form });
      Toast.show({
        type: 'success',
        text1: 'Changes saved!',
        visibilityTime: 2000,
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error saving changes',
        text2: err.message,
      });
    }
  };

  if (loading || !data) return <Text style={{ padding: 20 }}>Loading...</Text>;

  const age = data.birth_date?.seconds
    ? calculateAge(new Date(data.birth_date.seconds * 1000))
    : '—';

  return (
    <>
      <ScrollView style={{ padding: spacing.l, backgroundColor: '#f5f5f5' }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: spacing.l,
            borderRadius: 12,
            marginBottom: spacing.xl,
            alignItems: 'center',
          }}
        >
          {data.profileImage && (
            <Image
              source={{ uri: data.profileImage }}
              style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {auth.currentUser?.displayName || 'User'}
          </Text>
          <Text style={{ color: '#666', marginTop: 4 }}>
            Age: {age} | Location: {locationText || 'Unknown'}
          </Text>
        </View>

        {/* All Editable Sections */}
        <Section title="Availability" expanded={expanded === 'availability'} onToggle={() => handleToggle('availability')}>
          <AvailabilityEditor
            value={form.availability}
            onChange={(val: string[]) => setForm((prev) => ({ ...prev, availability: val }))}
          />
        </Section>

        <Section title="Experience" expanded={expanded === 'experience'} onToggle={() => handleToggle('experience')}>
          <ExperienceEditor
            value={form.experience_level}
            onChange={(val: string) => setForm((prev) => ({ ...prev, experience_level: val }))}
          />
        </Section>

        <Section title="Industry" expanded={expanded === 'industry'} onToggle={() => handleToggle('industry')}>
          <IndustryEditor
            value={form.preferred_tags}
            onChange={(val: string[]) => setForm((prev) => ({ ...prev, preferred_tags: val }))}
          />
        </Section>

        <Section title="Tags" expanded={expanded === 'tags'} onToggle={() => handleToggle('tags')}>
          <TagsEditor
            value={form.preferences}
            onChange={(val: string[]) => setForm((prev) => ({ ...prev, preferences: val }))}
          />
        </Section>

        <Section title="Skills" expanded={expanded === 'skills'} onToggle={() => handleToggle('skills')}>
          <SkillEditor
            value={form.skills}
            onChange={(val: string[]) => setForm((prev) => ({ ...prev, skills: val }))}
          />
        </Section>

        <Section title="Salary" expanded={expanded === 'salary'} onToggle={() => handleToggle('salary')}>
          <SalaryEditor
            min={form.salary_min}
            max={form.salary_max}
            unit={form.salary_unit}
            onChange={({ min, max, unit }) =>
              setForm((prev) => ({
                ...prev,
                salary_min: min,
                salary_max: max,
                salary_unit: unit,
              }))
            }
          />
        </Section>

        <Button
          mode="contained"
          onPress={handleSaveAll}
          style={{
            marginTop: spacing.xl,
            marginBottom: 60,
            backgroundColor: colors.primary,
            borderRadius: 12,
          }}
          contentStyle={globalStyles.buttonContent}
          labelStyle={{ fontWeight: '600', color: 'white' }}
        >
          Save All Changes
        </Button>
      </ScrollView>

      <Toast />
    </>
  );
}
