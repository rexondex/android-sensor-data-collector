import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiResponseSchema } from './apiSchema';

const API_URL = 'https://data-anchor-api-173411279831.asia-northeast3.run.app/records';

// 응답 스키마 정의 (Zod)
// export const ApiResponseSchema = z.object({
//   id: z.string(),
//   key: z.string(),
//   version: z.number(),
//   data: z.object({
//     url: z.string().optional(),
//     name: z.string().optional(),
//     value: z.string().optional(),
//     where: z.string().optional(),
//   }),
//   status: z.string(),
//   createdAt: z.string(),
//   prevHash: z.string().nullable(),
//   hash: z.string().nullable(),
// });

export async function getApiKey() {
  // SecureStore 또는 .env에서 API KEY를 읽어옴
  let key = await SecureStore.getItemAsync('MY_API_KEY');
  if (!key && process.env.MY_API_KEY) key = process.env.MY_API_KEY;
  return key;
}

export async function postSensorBatch(batch: any[]): Promise<any[]> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API Key not set');
  const results = [];
  for (const item of batch) {
    let retry = 0;
    let success = false;
    let lastError = null;
    while (retry < 3 && !success) {
      try {
        const res = await axios.post(
          API_URL,
          item,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
            timeout: 10000,
          }
        );
        ApiResponseSchema.parse(res.data);
        results.push({ success: true, data: res.data });
        success = true;
      } catch (e) {
        retry++;
        lastError = e;
        if (retry >= 3) {
          results.push({ success: false, error: e, item });
        }
      }
    }
  }
  return results;
}
