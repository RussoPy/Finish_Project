import React, { useState } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
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

export default function IndustryEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [search, setSearch] = useState('');

  const toggle = (industry: string) => {
    if (value.includes(industry)) {
      onChange(value.filter((i) => i !== industry));
    } else {
      onChange([...value, industry]);
    }
  };

  const filtered = industries.filter((i) =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View>
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

      <ScrollView
        style={{ maxHeight: 200 }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 12,
        }}
      >
        {filtered.map((industry) => {
          const selected = value.includes(industry);
          return (
            <Pressable
              key={industry}
              onPress={() => toggle(industry)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: selected ? colors.primary : '#fff',
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.muted,
                margin: 4,
              }}
            >
              <Text
                style={{
                  color: selected ? '#fff' : colors.primary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {industry}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
