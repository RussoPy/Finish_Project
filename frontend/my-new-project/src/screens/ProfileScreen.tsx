import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  TextInput,
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
import SalaryEditor from './editors/SalaryEditor';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_MAPS_API_KEY } from '@env';
import Icon from 'react-native-vector-icons/Feather';
import ProfileImageEditor from './editors/ProfileImageEditor';
import { signOut } from 'firebase/auth';



if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ProfileForm = {
  availability: string[];
  experience_level: string;
  preferred_tags: string[];
  preferences: string[];
  skills: string[];
  salary_min: string;
  salary_max: string;
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

  const navigation = useNavigation<any>();

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
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View
        style={{
          backgroundColor: '#81c9f0',
          paddingHorizontal: 20,
          paddingVertical: 24,
          borderBottomWidth: 1,
          borderColor: '#eee',
          alignItems: 'center',
        }}
      >
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
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'PoetsenOne_400Regular',
            marginBottom: 25,
            marginTop: 30,
            textAlign: 'center',
            color: '#222222',
            letterSpacing: 0.3,
          }}
        >
          Settings
        </Text>

        <View style={{ position: 'relative', marginBottom: 16 }}>
          <ProfileImageEditor
            imageUri={data?.profileImage}
            onChange={(url: string) =>
              setData((prev: any) => ({ ...prev, profileImage: url }))
            }
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 8,
              elevation: 3,
            }}
          >
            <Icon name="upload" size={14} color="#333" />
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', fontFamily: 'PoetsenOne_400Regular', }}>
          {data?.firstName} {data?.lastName}
        </Text>

        <Text style={{ color: '#666', marginTop: 6, fontFamily: 'PoetsenOne_400Regular', }}>Age: {age}</Text>
        <Text
          style={{
            color: '#666',
            fontFamily: 'PoetsenOne_400Regular',
            fontSize: 13,
            marginTop: 2,
            textAlign: 'center',
            paddingHorizontal: 16,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {locationText || 'Unknown location'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <SettingsItem icon="calendar" label="Availability" onPress={() => handleToggle('availability')} />
        {expanded === 'availability' && (
          <AvailabilityEditor
            value={form.availability}
            onChange={(val) => setForm((prev) => ({ ...prev, availability: val }))}
          />
        )}

        <SettingsItem icon="briefcase" label="Experience" onPress={() => handleToggle('experience')} />
        {expanded === 'experience' && (
          <ExperienceEditor
            value={form.experience_level}
            onChange={(val) => setForm((prev) => ({ ...prev, experience_level: val }))}
          />
        )}

        <SettingsItem icon="layers" label="Industry" onPress={() =>
          navigation.navigate('EditIndustry', {
            currentIndustries: form.preferred_tags,
            onSave: (val: string[]) => setForm((prev) => ({ ...prev, preferred_tags: val })),
          })
        } />

        <SettingsItem icon="tag" label="Tags" onPress={() =>
          navigation.navigate('EditTags', {
            currentTags: form.preferences,
            onSave: (val: string[]) => setForm((prev) => ({ ...prev, preferences: val })),
          })
        } />

        <SettingsItem icon="sliders" label="Skills" onPress={() =>
          navigation.navigate('EditSkills', {
            currentSkills: form.skills,
            onSave: (val: string[]) => setForm((prev) => ({ ...prev, skills: val })),
          })
        } />

        <SettingsItem icon="dollar-sign" label="Salary" onPress={() => handleToggle('salary')} />
        {expanded === 'salary' && (
          <SalaryEditor
            min={form.salary_min}
            max={form.salary_max}
            unit={form.salary_unit}
            onChange={({ min, max, unit }: { min: string; max: string; unit: 'hour' | 'month' }) =>
              setForm((prev) => ({
                ...prev,
                salary_min: min,
                salary_max: max,
                salary_unit: unit,
              }))
            }
          />
        )}

        <View style={{ padding: 20 }}>
          <Button
            mode="contained"
            onPress={handleSaveAll}
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
            contentStyle={{
              paddingVertical: 10,
              paddingHorizontal: 16,
            }}
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
