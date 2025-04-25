import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { Button } from 'react-native-paper';

export default function JobPreferences() {
  const navigation = useNavigation<any>();

  return (
    <View style={[globalStyles.container]}>
      {/* 🔙 Header */}
      <ProfileNavHeader
        stepText="5/10"
        progress={0.5}
        showBack={true}
        showSkip={false}
        onSkip={() => navigation.navigate('IndustryPrefrencesStep')}
      />

      {/* 📦 Centered block */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing.l,
        }}
      >
        {/* 🎯 Title */}
        <Text style={[globalStyles.title, { textAlign: 'center' }]}>
          Let’s find your <Text style={{ color: colors.secondary }}>Dream Job</Text>
        </Text>

        {/* 📝 Subtitle */}
        <Text
          style={{
            color: colors.info,
            textAlign: 'center',
            fontSize: 14,
            marginTop: spacing.s,
            paddingHorizontal: spacing.m,
          }}
        >
          Just a few more questions to help us understand what you're looking for.
        </Text>
      </View>

      {/* ✅ Continue Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('IndustryPrefrencesStep')}
        style={[
          globalStyles.button,
          {
            position: 'absolute',
            bottom: 30,
            alignSelf: 'center',
            backgroundColor: colors.primary,
          },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Continue
      </Button>
    </View>
  );
}
