import 'react-native-gesture-handler'; // 👈 must be first
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';
import { Provider as PaperProvider } from 'react-native-paper';
import colors from './src/styles/colors';

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
  return (
    <>
     <PaperProvider theme={theme}>
      <AppNavigator />
      <Toast />
      <StatusBar style="dark" />
     </PaperProvider>
    </>
  );
}
