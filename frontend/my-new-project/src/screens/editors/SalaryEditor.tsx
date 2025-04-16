import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

export default function SalaryEditor({
  min,
  max,
  unit,
  onChange,
}: {
  min: number | string;
  max: number | string;
  unit: 'hour' | 'month';
  onChange: (vals: { min: string; max: string; unit: 'hour' | 'month' }) => void;
}) {
  return (
    <View>
      {/* 💰 Min Salary */}
      <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: 4 }}>
        Minimum Salary (₪)
      </Text>
      <TextInput
        placeholder="e.g. 6000"
        value={String(min)}
        keyboardType="numeric"
        onChangeText={(text) => onChange({ min: text, max: String(max), unit })}
        style={{
          height: 48,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingHorizontal: spacing.m,
          borderColor: colors.muted,
          borderWidth: 1,
          textAlign: 'center',
          marginBottom: spacing.m,
        }}
      />

      {/* 💰 Max Salary */}
      <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: 4 }}>
        Maximum Salary (₪)
      </Text>
      <TextInput
        placeholder="Optional"
        value={String(max)}
        keyboardType="numeric"
        onChangeText={(text) => onChange({ min: String(min), max: text, unit })}
        style={{
          height: 48,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingHorizontal: spacing.m,
          borderColor: colors.muted,
          borderWidth: 1,
          textAlign: 'center',
          marginBottom: spacing.m,
        }}
      />

      {/* ⏱ Unit Toggle */}
      <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: spacing.s }}>
        Salary Unit
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.m }}>
        {['hour', 'month'].map((u) => {
          const isActive = unit === u;
          return (
            <Pressable
              key={u}
              onPress={() => onChange({ min: String(min), max: String(max), unit: u as 'hour' | 'month' })}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: isActive ? colors.primary : '#fff',
                borderWidth: 1,
                borderColor: isActive ? colors.primary : colors.muted,
                borderRadius: 12,
                marginHorizontal: 4,
              }}
            >
              <Text style={{ color: isActive ? '#fff' : colors.primary, fontWeight: '600' }}>
                Per {u.charAt(0).toUpperCase() + u.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
