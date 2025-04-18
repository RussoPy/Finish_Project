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

  const toggle = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSave = () => {
    route.params?.onSave?.(skills);
    navigation.goBack();
  };

  const filtered = allSkills.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={{ padding: 40, alignItems: 'center' }}>
  <Text
    style={{
      fontSize: 22,
      fontFamily: 'Nunito_700Bold',
      marginBottom: spacing.m
    }}
  >
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
            paddingHorizontal: 100,
            borderColor: colors.muted,
            borderWidth: 1,
            marginBottom: 10,
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
          paddingBottom: 140,
        }}
      >
        {filtered.map((skill) => {
          const isSelected = skills.includes(skill);
          return (
            <Pressable
              key={skill}
              onPress={() => toggle(skill)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: isSelected ? '#81c9f0' : '#fff',
                borderWidth: 1.5,
                borderColor: isSelected ? colors.primary : '#81c9f0',
                margin: 4,
              }}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : '#222',
                  fontFamily: 'Nunito_400Regular',
                  fontSize: 16,
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
