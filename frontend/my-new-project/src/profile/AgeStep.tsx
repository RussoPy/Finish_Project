import React, { useState, useRef, useEffect } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, IconButton, useTheme, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../api/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import globalStyles from '../styles/globalStyles';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import colors from '../styles/colors';

export default function BirthDateStep() {
  const navigation = useNavigation<any>();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [isValidAge, setIsValidAge] = useState(true);

  const theme = useTheme();



  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async () => {
    if (!birthDate) return;

    const age = calculateAge(birthDate);
    if (age < 13) {
      setIsValidAge(false);
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    await updateDoc(doc(db, 'users', uid), {
      birth_date: Timestamp.fromDate(birthDate),
    });

    navigation.navigate('Location');
  };

  const parseInputDate = (input: string): Date | null => {
    const parts = input.trim().split(/[./]/); // supports DD.MM.YY or DD/MM/YY
    if (parts.length !== 3) return null;

    const [dayStr, monthStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    // Handle 2-digit year
    if (yearStr.length === 2) {
      year += year < 30 ? 2000 : 1900;
    } else if (yearStr.length !== 4) {
      return null;
    }

    const date = new Date(year, month, day);
    const age = calculateAge(date);

    if (isNaN(date.getTime()) || age < 1 || age > 99) {
      return null;
    }

    return date;
  };

  const formatDateInput = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // 2-digit year
    return `${day}.${month}.${year}`; // or use '/' if you prefer
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const age = calculateAge(selectedDate);
      setIsValidAge(age >= 13 && age <= 99);
      setBirthDate(selectedDate);
      setInputDate(selectedDate.toLocaleDateString());
    }
  };

  const handleInputChange = (text: string) => {
    setInputDate(text);

    const parsedDate = parseInputDate(text);
    if (parsedDate) {
      setBirthDate(parsedDate);
      const age = calculateAge(parsedDate);
      setIsValidAge(age >= 13 && age <= 99);
    }
  };


  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior="padding">
      {/* Header */}
      <ProfileNavHeader
        stepText="1/10"
        progress={0.1}
        showBack={false}
        showSkip={true}
        onSkip={() => navigation.navigate('JobLocationStep')}
      />

      {/* Title */}
      <Text style={globalStyles.title}>
        Your <Text style={globalStyles.highlightText}>b-day?</Text>
      </Text>

      {/* Input */}
      <TextInput
        label="Enter your date of birth"
        value={inputDate}
        onChangeText={handleInputChange}
        onFocus={() => setShowPicker(false)}
        style={globalStyles.input}
        mode="outlined" // use Paper's outlined style
        keyboardType="numeric"
        right={
          <TextInput.Icon
            icon="calendar"
            onPress={() => setShowPicker(true)}
          />
        }
      />

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={birthDate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setBirthDate(selectedDate);
              setInputDate(formatDateInput(selectedDate));
              const age = calculateAge(selectedDate);
              setIsValidAge(age >= 13 && age <= 99);
            }
          }}
        />
      )}

      {/* Error */}
      {!isValidAge && (
        <HelperText type="error" visible={true}>
          You must be 13 or older to use this app.
        </HelperText>
      )}

      {/* Next Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!birthDate}
        style={[
          globalStyles.button,
          { backgroundColor: birthDate ? colors.primary : colors.muted },
        ]}
        
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </KeyboardAvoidingView>
  );
}

