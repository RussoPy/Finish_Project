// src/screens/editors/jobeditors/EditMinimumAge.tsx

import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import spacing from '../../../styles/spacing';
import colors from '../../../styles/colors';

export default function EditMinimumAge() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { currentAge, onSave } = route.params;

  const [age, setAge] = useState<string>(currentAge || '');

  const handleSave = () => {
    if (age) {
      onSave(age);
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2', padding: spacing.l }}>
      <Text style={{
        fontSize: 22,
        textAlign: 'center',
        marginBottom: spacing.xl,
        fontFamily: 'PoetsenOne_400Regular',
        color: '#333',
      }}>
        Set Minimum Age
      </Text>

      <TextInput
        value={age}
        onChangeText={setAge}
        placeholder="Enter minimum age"
        keyboardType="numeric"
        style={{
          backgroundColor: '#fff',
          padding: spacing.m,
          borderRadius: 12,
          borderColor: colors.muted,
          borderWidth: 1,
          fontSize: 18,
          marginBottom: spacing.l,
        }}
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!age}
        style={{
          backgroundColor: age ? colors.primary : colors.muted,
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
        Save Age
      </Button>
    </View>
  );
}
