import * as BackgroundFetch from 'expo-background-fetch';
import { BackgroundFetchResult } from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_TASK = 'sensor-background-task';

export function registerBackgroundSensorTask(taskFn: () => Promise<void>) {
  TaskManager.defineTask(BACKGROUND_TASK, async () => {
    try {
      await taskFn();
      return BackgroundFetchResult.NewData;
    } catch (e) {
      return BackgroundFetchResult.Failed;
    }
  });
  BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
    minimumInterval: 30, // 30초(실제 환경에서는 OS 정책에 따라 더 길어질 수 있음)
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
