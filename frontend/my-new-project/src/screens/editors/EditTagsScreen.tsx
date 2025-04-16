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

  const getColorForOption = (label: string): string => {
    let sum = 0;
    for (let i = 0; i < label.length; i++) {
      sum += label.charCodeAt(i);
    }
    return pastelColors[sum % pastelColors.length];
  };

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
      <View style={{ padding: spacing.l }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: spacing.m }}>
          Edit Your Tags
        </Text>
  
        <TextInput
          placeholder="Search tags..."
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
          paddingBottom: 140,
        }}
      >
        {filtered.map((tag) => {
          const selected = tags.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggle(tag)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: selected ? colors.primary : getColorForOption(tag),
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
