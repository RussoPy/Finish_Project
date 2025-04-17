import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppButton } from '../components/AppButton';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';


export default function PhoneInputStep({ phone, setPhone, sendCode }: any) {
  const navigation = useNavigation();

  return (
    <>

      <Text style={globalStyles.title}>
        Your <Text style={globalStyles.highlightText}>Number?</Text>
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: colors.muted, paddingHorizontal: 10, marginBottom: 12 }}>
        <Text style={{ color: colors.primary, fontSize: 16, marginRight: 4 }}>+972</Text>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor={colors.info}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={{ flex: 1, paddingVertical: 14, fontSize: 16 }}
        />
      </View>
      <AppButton title="Send Code" onPress={sendCode} />
    </>
  );
}