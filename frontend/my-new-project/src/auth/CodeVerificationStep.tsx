import React, { useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { AppButton } from '../components/AppButton';
import colors from '../styles/colors';

export default function CodeVerificationStep({ code, setCode, verifyCode }: any) {
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleDigitChange = (text: string, index: number) => {
    const updated = [...codeDigits];
    if (text.length === 1) {
      updated[index] = text;
      setCodeDigits(updated);
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text.length > 1) {
      const newDigits = text.split('').slice(0, 6);
      setCodeDigits(newDigits);
      newDigits.forEach((val, i) => {
        if (inputs.current[i]) inputs.current[i]!.setNativeProps({ text: val });
      });
    }
    if (index === 5 || updated.every((d) => d !== '')) {
      const fullCode = updated.join('');
      setCode(fullCode);
    }
  };

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            value={codeDigits[i] || ''}
            onChangeText={(text) => handleDigitChange(text, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={{
              width: 44,
              height: 50,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: colors.muted,
              backgroundColor: 'white',
              textAlign: 'center',
              fontSize: 18,
              color: colors.primary,
            }}
            autoFocus={i === 0}
          />
        ))}
      </View>
      <AppButton title="Verify" onPress={verifyCode} />
    </>
  );
}