import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

const options = ['Unexperienced', 'Beginner', 'Intermediate', 'Expert'];

export default function ExperienceEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View>
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 24,
              marginBottom: spacing.s,
              backgroundColor: isSelected ? colors.primary : '#fff',
              borderWidth: 1,
              borderColor: isSelected ? colors.primary : colors.muted,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: isSelected ? '#fff' : colors.primary,
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
