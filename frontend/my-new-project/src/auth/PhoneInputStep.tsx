import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { AppButton } from '../components/AppButton';
import colors from '../styles/colors';
import globalStyles from '../styles/globalStyles';

export default function PhoneInputStep({ phone, setPhone, sendCode }: any) {
  return (
    <>
      <Text style={globalStyles.title}>Enter Your Phone</Text>
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