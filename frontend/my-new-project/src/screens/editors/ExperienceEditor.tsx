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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    marginBottom: spacing.s,
    minWidth: 300, // Match long-pill width
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: isSelected ? colors.primary : '#fff',
    borderWidth: 1.5,
    borderColor: isSelected ? colors.primary : colors.muted,
  }}
>
  <Text
    style={{
      color: isSelected ? '#fff' : colors.primary,
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
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
