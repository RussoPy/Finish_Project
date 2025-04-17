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
    <View style={{ paddingTop: spacing.m }}>
      {/* 💰 Min Salary */}
      <Text
        style={{
          color: colors.primary,
          fontFamily: 'Nunito_700Bold',
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        Minimum Salary (₪)
      </Text>
      <TextInput
        placeholder="e.g. 6000"
        value={String(min)}
        keyboardType="numeric"
        onChangeText={(text) => onChange({ min: text, max: String(max), unit })}
        style={{
          height: 48,
          backgroundColor: '#81c9f0',
          borderRadius: 999,
          paddingHorizontal: spacing.m,
          borderColor: 'transparent',
          borderWidth: 1.5,
          textAlign: 'center',
          fontFamily: 'Nunito_400Regular',
          fontSize: 16,
          color: '#222',
          marginBottom: spacing.m,
        }}
      />

      {/* 💰 Max Salary */}
      <Text
        style={{
          color: colors.primary,
          fontFamily: 'Nunito_700Bold',
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        Maximum Salary (₪)
      </Text>
      <TextInput
        placeholder="Optional"
        value={String(max)}
        keyboardType="numeric"
        onChangeText={(text) => onChange({ min: String(min), max: text, unit })}
        style={{
          height: 48,
          backgroundColor: '#81c9f0',
          borderRadius: 999,
          paddingHorizontal: spacing.m,
          borderColor: 'transparent',
          borderWidth: 1.5,
          textAlign: 'center',
          fontFamily: 'Nunito_400Regular',
          fontSize: 16,
          color: '#222',
          marginBottom: spacing.m,
        }}
      />

      {/* ⏱ Unit Toggle */}
      <Text
        style={{
          color: colors.primary,
          fontFamily: 'Nunito_700Bold',
          fontSize: 18,
          textAlign: 'center',
          marginBottom: spacing.s,
        }}
      >
        Salary Unit
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: spacing.m,
        }}
      >
        {['hour', 'month'].map((u) => {
          const isActive = unit === u;
          return (
            <Pressable
              key={u}
              onPress={() => onChange({ min: String(min), max: String(max), unit: u as 'hour' | 'month' })}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 24,
                backgroundColor: isActive ? colors.primary : '#81c9f0',
                borderWidth: 1.5,
                borderColor: isActive ? colors.primary : '#81c9f0',
                borderRadius: 999,
                marginHorizontal: 6,
              }}
            >
              <Text
                style={{
                  color: isActive ? '#fff' : '#222',
                  fontFamily: 'Nunito_400Regular',
                  fontSize: 15,
                }}
              >
                Per {u.charAt(0).toUpperCase() + u.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
