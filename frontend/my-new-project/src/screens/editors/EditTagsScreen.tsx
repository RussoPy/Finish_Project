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

const tagOptions = [
  "Retail", "Food Service", "Hospitality", "Construction", "Transportation", "Delivery",
  "Warehouse", "Cleaning", "Security", "Call Center", "Customer Support", "Tech Support",
  "Frontend Development", "Backend Development", "UI/UX Design", "Graphic Design",
  "Marketing", "Sales", "Accounting", "Education", "Tutoring", "Fitness", "Medical",
  "Photography", "Chef", "Waiter", "Barista", "Real Estate", "Legal", "Babysitting",
  "Remote Work", "Volunteer", "Internship", "Part-Time", "Full-Time", "Startup", "Corporate"
];

export default function EditTagsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [tags, setTags] = useState<string[]>(route.params?.currentTags || []);
  const [search, setSearch] = useState('');

  const toggle = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    route.params?.onSave?.(tags);
    navigation.goBack();
  };

  const filtered = tagOptions.filter((tag) =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={{ padding: 40,alignItems: 'center' }}>
        <Text style={{
          fontSize: 22,
          fontFamily: 'Nunito_700Bold',

          marginBottom: 10
        }}>
          Edit Your Tags
        </Text>

        <TextInput
          placeholder="Search tags..."
          value={search}
          onChangeText={setSearch}
          style={{
            height: 44,
            fontFamily: 'Nunito_400Regular',
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
        {filtered.map((tag) => {
          const isSelected = tags.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggle(tag)}
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
                {tag}
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
