// src/components/editors/AvailabilityEditor.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

const options = ['Full-time', 'Part-time', 'Remote'];

export default function AvailabilityEditor({ value = [], onChange }: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <View style={{ paddingBottom: 12 }}>
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <Pressable
            key={opt}
            onPress={() => toggle(opt)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 9999,
              marginRight: 8,
              marginBottom: 8,
              minWidth: 300, // ✅ Force pills to be longer
              justifyContent: 'center',
              backgroundColor: selected ? colors.primary : '#fff',
              borderWidth: 1.5,
              borderColor: selected ? colors.primary : colors.muted,
              alignSelf: 'center',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              textAlign: 'center',
              color: selected ? '#fff' : colors.primary,
            }}>
              {opt}
            </Text>
          </Pressable>




        );
      })}
    </View>
  );
}
