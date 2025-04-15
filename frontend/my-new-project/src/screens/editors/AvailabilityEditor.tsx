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
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 20,
              marginBottom: spacing.s,
              backgroundColor: selected ? colors.primary : '#fff',
              borderWidth: 1,
              borderColor: selected ? colors.primary : colors.muted,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: selected ? '#fff' : colors.primary,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
