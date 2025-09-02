import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SensorDataPanel from '@/components/SensorDataPanel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ApiKeyModal from '@/components/ui/ApiKeyModal';
import { registerBackgroundSensorTask } from '@/hooks/useBackgroundFetch';
import { useSensorBuffer } from '@/hooks/useSensorBuffer';
import { useAvailableSensors, useSensorData } from '@/hooks/useSensors';
import { postSensorBatch } from '@/utils/api';
import { clearFailedQueue, loadFailedQueue, saveFailedBatch } from '@/utils/failedQueue';
import * as SecureStore from 'expo-secure-store';

async function backgroundSend(flush: () => any) {
  const batched = flush();
  let failed: any[] = [];
  if (batched.length > 0) {
    const results = await postSensorBatch(batched);
    failed = results.filter(r => !r.success).map(r => r.item);
  }
  const prevFailed = await loadFailedQueue();
  if (prevFailed.length > 0) {
    const retryResults = await postSensorBatch(prevFailed);
    const stillFailed = retryResults.filter(r => !r.success).map(r => r.item);
    if (stillFailed.length === 0) {
      await clearFailedQueue();
    } else {
      await saveFailedBatch(stillFailed);
    }
  }
  if (failed.length > 0) {
    await saveFailedBatch(failed);
  }
}

export default function HomeScreen() {
  const available = useAvailableSensors();
  const data = useSensorData(available, 5000);
  const { addData, flush, bufferSize } = useSensorBuffer();
  const [apiKeyModal, setApiKeyModal] = useState(false);

  // 5초마다 센서 데이터 버퍼에 추가
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      addData(data);
    }
  }, [data, addData]);

  // 30초마다 버퍼 flush (전송 로직 자리)
  useEffect(() => {
    const timer = setInterval(() => {
      const send = async () => {
        const batched = flush();
        let failed: any[] = [];
        if (batched.length > 0) {
          const results = await postSensorBatch(batched);
          failed = results.filter(r => !r.success).map(r => r.item);
        }
        // 이전 실패 큐도 재시도
        const prevFailed = await loadFailedQueue();
        if (prevFailed.length > 0) {
          const retryResults = await postSensorBatch(prevFailed);
          const stillFailed = retryResults.filter(r => !r.success).map(r => r.item);
          if (stillFailed.length === 0) {
            await clearFailedQueue();
          } else {
            await saveFailedBatch(stillFailed);
          }
        }
        if (failed.length > 0) {
          await saveFailedBatch(failed);
          Alert.alert('데이터 전송 실패', '일부 데이터가 서버에 전송되지 않았습니다.');
        }
      };
      send();
    }, 30000);
    return () => clearInterval(timer);
  }, [flush]);

  useEffect(() => {
    (async () => {
      const key = await SecureStore.getItemAsync('MY_API_KEY');
      if (!key) setApiKeyModal(true);
    })();
  }, []);

  // 백그라운드 태스크 등록 (최초 1회)
  useEffect(() => {
    registerBackgroundSensorTask(() => backgroundSend(flush));
  }, [flush]);

  return (
    <>
      <ApiKeyModal visible={apiKeyModal} onClose={() => setApiKeyModal(false)} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
            Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({
                ios: 'cmd + d',
                android: 'cmd + m',
                web: 'F12',
              })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          <ThemedText>
            {`Tap the Explore tab to learn more about what's included in this starter app.`}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
          <ThemedText>
            {`When you're ready, run `}
            <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
            <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
            <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
            <ThemedText type="defaultSemiBold">app-example</ThemedText>.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <SensorDataPanel interval={5000} />
          <ThemedText>버퍼 크기: {bufferSize}</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
