import React, { useState } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

const tagOptions = [
  "Retail", "Food Service", "Hospitality", "Construction", "Transportation", "Delivery",
  "Warehouse", "Cleaning", "Security", "Call Center", "Customer Support", "Tech Support",
  "Software Development", "Frontend Development", "Backend Development", "UI/UX Design",
  "Graphic Design", "Content Writing", "Translation", "Education", "Tutoring", "Marketing",
  "Sales", "Social Media", "Accounting", "Finance", "Real Estate", "Legal", "Medical Assistant",
  "Nursing", "Caregiving", "Fitness Trainer", "Hairdresser", "Makeup Artist", "Event Planning",
  "Photography", "Video Editing", "Project Management", "Operations", "Human Resources",
  "Recruitment", "Data Entry", "Driving", "Motorbike Delivery", "Truck Driver", "Barista",
  "Waiter", "Bartender", "Chef", "Kitchen Assistant", "Dishwasher", "Mover", "Installer",
  "Electrician", "Plumber", "Mechanic", "Technician", "Fashion", "Modeling", "Telemarketing",
  "Admin Assistant", "Reception", "Hosting", "Babysitting", "Pet Sitting", "Gardening",
  "Painting", "Carpentry", "Cleaning Services", "Laundry", "Warehouse Operator", "Stocking",
  "QA Tester", "Automation", "Data Analyst", "Product Manager", "Scrum Master", "Jira Expert",
  "Notion Specialist", "SEO Expert", "Google Ads", "Facebook Ads", "CRM", "SAP", "ERP",
  "Copywriting", "Script Writing", "Voiceover", "Remote Work", "Freelance Gigs", "Part-Time",
  "Full-Time", "Internship", "Volunteer Work", "Short-Term", "Startup", "Corporate", "Night Shifts",
  "Day Shifts", "Flexible", "Work from Home", "Hybrid", "On-Site"
];

export default function TagsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [search, setSearch] = useState('');

  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const filtered = tagOptions.filter((tag) =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View>
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

      <ScrollView
        style={{ maxHeight: 200 }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 12,
        }}
      >
        {filtered.map((tag) => {
          const selected = value.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggle(tag)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: selected ? colors.primary : '#fff',
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
    </View>
  );
}
