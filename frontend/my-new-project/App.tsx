import 'react-native-gesture-handler'; // 👈 must be first
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <AppNavigator />
      <Toast />
      <StatusBar style="dark" />
    </>
  );
}
