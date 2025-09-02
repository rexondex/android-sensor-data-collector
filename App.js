import { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './screens/MainScreen';
import { registerBackgroundTask } from './utils/backgroundTask';

export default function App() {
  useEffect(() => {
    registerBackgroundTask();
  }, []);

  return (
    <PaperProvider>
      <MainScreen />
    </PaperProvider>
  );
}
