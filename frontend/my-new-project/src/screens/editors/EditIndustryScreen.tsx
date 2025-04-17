import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

const industries = [
  'Retail', 'Food Service', 'Hospitality', 'Construction', 'Transportation',
  'Delivery', 'Warehouse', 'Cleaning', 'Security', 'Customer Support',
  'Software Development', 'Frontend Development', 'Backend Development',
  'UI/UX Design', 'Graphic Design', 'Education', 'Tutoring', 'Marketing',
  'Sales', 'Accounting', 'Finance', 'Real Estate', 'Legal', 'Fitness', 'Medical',
  'Photography', 'Barista', 'Chef', 'Waiter', 'Event Planning', 'Fashion',
  'Hair & Beauty', 'Freelance', 'Remote Work', 'Driving', 'Startup', 'Corporate'
];

export default function EditIndustryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(route.params?.currentIndustries || []);
  const [search, setSearch] = useState('');

  const toggle = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleSave = () => {
    route.params?.onSave?.(selectedIndustries);
    navigation.goBack();
  };

  const filtered = industries.filter((industry) =>
    industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={{ padding: spacing.l }}>
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: 'Nunito_700Bold',
          marginBottom: spacing.m
        }}>
          Edit Industry Preferences
        </Text>

        <TextInput
          placeholder="Search industries..."
          value={search}
          onChangeText={setSearch}
          style={{
            height: 44,
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: spacing.m,
            borderColor: colors.muted,
            borderWidth: 1,
            marginBottom: spacing.m,
          }}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          paddingHorizontal: spacing.l,
          gap: 8,
          paddingBottom: 140,
        }}
      >
        {filtered.map((industry) => {
          const isSelected = selectedIndustries.includes(industry);
          return (
            <Pressable
              key={industry}
              onPress={() => toggle(industry)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: isSelected ? colors.primary : '#81c9f0',
                borderWidth: 1.5,
                borderColor: isSelected ? colors.primary : '#81c9f0',
                margin: 4,
              }}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : '#222',
                  fontFamily: 'Nunito_400Regular',
                  fontSize: 16,
                }}
              >
                {industry}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
      }}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
          }}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{ color: 'white', fontWeight: '600', fontSize: 16 }}
        >
          Save
        </Button>
      </View>
    </View>
  );
}
