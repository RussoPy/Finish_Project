// src/screens/editors/jobeditors/EditDescription.tsx

import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import spacing from '../../../styles/spacing';
import colors from '../../../styles/colors';

export default function EditDescription() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { currentDescription, onSave } = route.params;

  const [description, setDescription] = useState<string>(currentDescription || '');

  const handleSave = () => {
    if (description.trim()) {
      onSave(description);
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
        Business Description
      </Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Tell more about your company, mission, etc."
        multiline
        numberOfLines={8}
        style={{
          backgroundColor: '#fff',
          padding: spacing.m,
          borderRadius: 12,
          borderColor: colors.muted,
          borderWidth: 1,
          fontSize: 16,
          height: 200,
          textAlignVertical: 'top',
          marginBottom: spacing.l,
        }}
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!description.trim()}
        style={{
          backgroundColor: description.trim() ? colors.primary : colors.muted,
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
        Save Description
      </Button>
    </View>
  );
}
