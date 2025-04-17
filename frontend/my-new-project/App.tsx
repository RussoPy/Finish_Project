import 'react-native-gesture-handler'; // 👈 must be first
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';
import { Provider as PaperProvider } from 'react-native-paper';
import colors from './src/styles/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useFonts as usePoetsenFonts, PoetsenOne_400Regular } from '@expo-google-fonts/poetsen-one';
import { useFonts as useRobotoMonoFonts, RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';

import AppLoading from 'expo-app-loading';

const theme = {
  roundness: 12,
  colors: {
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: '#ffffff',
    text: colors.primary,
    placeholder: colors.info,
    error: colors.error,
    disabled: '#b0bec5',
  },
};

export default function App() {
  const [fontsLoaded] = usePoetsenFonts({
    PoetsenOne_400Regular,
    RobotoMono_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AppNavigator />
        <Toast />
        <StatusBar style="dark" />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
