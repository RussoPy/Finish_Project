import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileScreen from './ProfileScreen';
import MatchScreen from './MatchScreen';
import ChatScreen from './ChatScreen';

export default function HomeScreen() {
  const [selected, setSelected] = useState<'profile' | 'match' | 'chat'>('match');

  const renderContent = () => {
    switch (selected) {
      case 'profile':
        return <ProfileScreen />;
      case 'chat':
        return <ChatScreen />;
      default:
        return <MatchScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Custom Icon Bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 5,
        }}
      >
        <TouchableOpacity onPress={() => setSelected('profile')}>
          <MaterialCommunityIcons
            name={selected === 'profile' ? 'account-circle' : 'account-circle-outline'}
            size={30}
            color={selected === 'profile' ? '#ff6b00' : '#888'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected('match')}>
          <MaterialCommunityIcons
            name={selected === 'match' ? 'gesture-swipe-horizontal' : 'gesture-swipe'}
            size={30}
            color={selected === 'match' ? '#ff6b00' : '#888'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected('chat')}>
          <MaterialCommunityIcons
            name={selected === 'chat' ? 'chat' : 'chat-outline'}
            size={30}
            color={selected === 'chat' ? '#ff6b00' : '#888'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
