import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { z } from 'zod';

const TASK_NAME = 'SENSOR_DATA_UPLOAD';
const API_KEY_STORAGE = 'API_KEY';
const API_ENDPOINT = 'https://your-api-endpoint.com/data'; // 실제 엔드포인트로 교체 필요
const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const apiKey = await AsyncStorage.getItem(API_KEY_STORAGE);
    const buffer = await AsyncStorage.getItem('BUFFER');
    if (!apiKey || !buffer) return BackgroundFetch.Result.NoData;
    const data = JSON.parse(buffer);
    if (!data.length) return BackgroundFetch.Result.NoData;
    const res = await axios.post(API_ENDPOINT, { data }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      timeout: 10000,
    });
    const parsed = ApiResponseSchema.safeParse(res.data);
    if (!parsed.success) throw new Error('API 응답 형식 오류');
    await AsyncStorage.setItem('BUFFER', JSON.stringify([]));
    return BackgroundFetch.Result.NewData;
  } catch (e) {
    return BackgroundFetch.Result.Failed;
  }
});

export async function registerBackgroundTask() {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60, // 60초
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
