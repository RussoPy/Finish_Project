import React, { useState } from 'react';
import { View, TextInput, Pressable, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';

const allSkills = [
  "Customer Service", "Sales", "Cashier", "Teamwork", "Leadership", "Problem Solving",
  "Communication", "Multitasking", "Time Management", "Flexibility", "Work Ethic",
  "Responsibility", "Punctuality", "English", "Hebrew", "Spanish", "Arabic",
  "Call Center", "Hospitality", "Cleaning", "Cooking", "Bartending", "Driving",
  "Forklift", "Security", "Retail", "Cash Register", "Stocking", "Typing", "Microsoft Office",
  "Excel", "Word", "PowerPoint", "Email", "Social Media", "Marketing", "Design", "Photoshop",
  "Illustrator", "Figma", "Canva", "Video Editing", "Photography", "Writing", "Content Creation",
  "Public Speaking", "Logistics", "Packing", "Shipping", "Inventory", "Bookkeeping",
  "Accounting", "Teaching", "Tutoring", "Babysitting", "Pet Sitting", "Nursing", "Caregiving",
  "First Aid", "Fitness Training", "Mechanics", "Plumbing", "Electrician", "Construction",
  "Handyman", "Painting", "Gardening", "Carpentry", "Real Estate", "Reception", "Administration",
  "Secretary", "Event Planning", "Hosting", "Translating", "Programming", "JavaScript",
  "React", "Python", "Java", "C#", "SQL", "HTML", "CSS", "Web Development", "Mobile Development",
  "Node.js", "Firebase", "Django", "FastAPI", "Data Entry", "CRM", "SAP", "ERP", "UX/UI",
  "Testing", "QA", "Automation", "AI", "Machine Learning", "Chat Support", "Tech Support",
  "Help Desk", "Hardware", "Networking", "IT Support", "SEO", "Google Ads", "Facebook Ads",
  "Analytics", "Project Management", "Agile", "Scrum", "Jira", "Notion", "Slack"
];

export default function SkillEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [search, setSearch] = useState('');

  const toggle = (skill: string) => {
    onChange(
      value.includes(skill)
        ? value.filter((s) => s !== skill)
        : [...value, skill]
    );
  };

  const filtered = allSkills.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View>
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

      <ScrollView
        style={{ maxHeight: 200 }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 12,
        }}
      >
        {filtered.map((skill) => {
          const selected = value.includes(skill);
          return (
            <Pressable
              key={skill}
              onPress={() => toggle(skill)}
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
                {skill}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
