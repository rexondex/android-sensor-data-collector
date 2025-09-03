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
    failCount,
  } = useApiTransmitter(buffer);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (sensorError) {
      if (sensorError.includes('권한')) {
        setSnackbarMsg('센서 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
      } else {
        setSnackbarMsg(sensorError);
      }
      setSnackbarVisible(true);
    } else if (apiError) {
      if (apiError.includes('Network')) {
        setSnackbarMsg('네트워크 오류: 인터넷 연결을 확인하세요.');
      } else {
        setSnackbarMsg(apiError);
      }
      setSnackbarVisible(true);
    } else if (failCount >= 3) {
      setSnackbarMsg('데이터 전송이 3회 이상 연속 실패했습니다. 네트워크 상태를 확인하세요.');
      setSnackbarVisible(true);
    }
  }, [sensorError, apiError, failCount]);

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
