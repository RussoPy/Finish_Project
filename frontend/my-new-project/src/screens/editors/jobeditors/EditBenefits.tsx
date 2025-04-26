// src/screens/editors/jobeditors/EditBenefits.tsx

import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import spacing from '../../../styles/spacing';
import colors from '../../../styles/colors';

const BENEFITS_OPTIONS = [
  'Health Insurance',
  'Paid Vacation',
  'Remote Work Options',
  'Stock Options',
  '401(k) / Pension Plan',
  'Training & Development',
  'Flexible Schedule',
  'Gym Membership',
  'Free Meals / Snacks',
  'Childcare Support',
];

export default function EditBenefits() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { currentBenefits, onSave } = route.params;

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(currentBenefits || []);

  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits(prev =>
      prev.includes(benefit)
        ? prev.filter(b => b !== benefit)
        : [...prev, benefit]
    );
  };

  const handleSave = () => {
    onSave(selectedBenefits);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2', paddingTop: spacing.l }}>
      <Text
        style={{
          fontSize: 22,
          textAlign: 'center',
          marginBottom: spacing.xl,
          fontFamily: 'PoetsenOne_400Regular',
          color: '#333',
        }}
      >
        Select Benefits
      </Text>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.l }}>
        {BENEFITS_OPTIONS.map((benefit) => (
          <TouchableOpacity
            key={benefit}
            onPress={() => toggleBenefit(benefit)}
            style={{
              backgroundColor: selectedBenefits.includes(benefit) ? colors.primary : '#fff',
              paddingVertical: spacing.m,
              paddingHorizontal: spacing.l,
              borderRadius: 12,
              borderColor: colors.muted,
              borderWidth: 1,
              marginBottom: spacing.m,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: selectedBenefits.includes(benefit) ? '#fff' : '#333',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {benefit}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ padding: spacing.l }}>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={selectedBenefits.length === 0}
          style={{
            backgroundColor: selectedBenefits.length > 0 ? colors.primary : colors.muted,
            borderRadius: 20,
            alignSelf: 'center',
            paddingHorizontal: 32,
            elevation: 8,
          }}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{
            fontFamily: 'RobotoMono_400Regular',
            fontWeight: '600',
            fontSize: 16,
            color: 'white',
          }}
        >
          Save Benefits
        </Button>
      </View>
    </View>
  );
}
