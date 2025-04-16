import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

const pastelColors = [
    '#FFEBEE', '#FFF3E0', '#FFF8E1', '#E8F5E9', '#E3F2FD',
    '#F3E5F5', '#E1F5FE', '#FBE9E7', '#F9FBE7', '#E0F2F1',
  ];

const allSkills: string[] = [
    'JavaScript', 'React', 'CSS', 'Python', 'Node.js', 'SQL',
    'Public Speaking', 'Customer Service', 'Leadership', 'Problem Solving',
    'Excel', 'Copywriting', 'Photography', 'Teamwork', 'Project Management',
    'Cooking', 'Sales', 'Marketing', 'HTML', 'Firebase', 'Figma'
  ];


  
export default function EditSkillsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [skills, setSkills] = useState<string[]>(route.params?.currentSkills || []);
  const [search, setSearch] = useState('');

  const getColorForOption = (label: string): string => {
    let sum = 0;
    for (let i = 0; i < label.length; i++) {
      sum += label.charCodeAt(i);
    }
    return pastelColors[sum % pastelColors.length];
  };

  const toggle = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSave = () => {
    if (route.params?.onSave) {
      route.params.onSave(skills);
    }
    navigation.goBack();
  };

  const filtered = allSkills.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={{ padding: spacing.l }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: spacing.m }}>
          Edit Your Skills
        </Text>
  
        <TextInput
          placeholder="Search skills..."
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
      </View>
  
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          paddingHorizontal: spacing.l,
          gap: 8,
          paddingBottom: 140, // enough space so last pills aren't hidden by the button
        }}
      >
        {filtered.map((skill) => {
          const selected = skills.includes(skill);
          return (
            <Pressable
              key={skill}
              onPress={() => toggle(skill)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: selected ? colors.primary : getColorForOption(skill),
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
                {skill}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
  
      <View style={{
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
      }}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
          }}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{ color: 'white', fontWeight: '600', fontSize: 16 }}
        >
          Save
        </Button>
      </View>
    </View>
  );
  
}
