import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './screens/MainScreen';

export default function App() {
  return (
    <PaperProvider>
      <MainScreen />
    </PaperProvider>
  );
}
