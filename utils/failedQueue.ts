import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'sensor_failed_queue';

export async function saveFailedBatch(batch: any[]) {
  try {
    const prev = await AsyncStorage.getItem(QUEUE_KEY);
    const arr = prev ? JSON.parse(prev) : [];
    arr.push(...batch);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
  } catch (e) {
    // ignore
  }
}

export async function loadFailedQueue() {
  try {
    const prev = await AsyncStorage.getItem(QUEUE_KEY);
    return prev ? JSON.parse(prev) : [];
  } catch (e) {
    return [];
  }
}

export async function clearFailedQueue() {
  await AsyncStorage.removeItem(QUEUE_KEY);
}
