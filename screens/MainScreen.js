import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import ApiKeyPanel from '../components/ApiKeyPanel';
import BufferStatusPanel from '../components/BufferStatusPanel';
import SensorPanel from '../components/SensorPanel';
import TransmissionStatusPanel from '../components/TransmissionStatusPanel';
import { useApiTransmitter } from '../services/apiTransmitter';
import { useSensorManager } from '../services/sensorManager';

export default function MainScreen() {
  // 센서 데이터, 버퍼, API 키, 전송 상태 등 커스텀 훅 사용
  const {
    sensorData,
    buffer,
    bufferSize,
    startSensors,
    stopSensors,
    isCollecting,
    error: sensorError,
    supportedSensors,
  } = useSensorManager();
  const {
    apiKey,
    setApiKey,
    transmissionStatus,
    lastTransmission,
    error: apiError,
  } = useApiTransmitter(buffer);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (sensorError) {
      setSnackbarMsg(sensorError);
      setSnackbarVisible(true);
    } else if (apiError) {
      setSnackbarMsg(apiError);
      setSnackbarVisible(true);
    }
  }, [sensorError, apiError]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="센서 데이터 수집기" />
      </Appbar.Header>
      <ScrollView>
        <ApiKeyPanel apiKey={apiKey} setApiKey={setApiKey} />
        <SensorPanel sensorData={sensorData} isCollecting={isCollecting} startSensors={startSensors} stopSensors={stopSensors} supportedSensors={supportedSensors} />
        <BufferStatusPanel bufferSize={bufferSize} />
        <TransmissionStatusPanel status={transmissionStatus} lastTransmission={lastTransmission} />
      </ScrollView>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>{snackbarMsg}</Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
