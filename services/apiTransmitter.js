import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const API_KEY_STORAGE = 'API_KEY';
const QUEUE_STORAGE = 'SEND_QUEUE';
const API_ENDPOINT = 'https://data-anchor-api-173411279831.asia-northeast3.run.app/records';
const TRANSMIT_INTERVAL = 30000; // 30초
const MAX_RETRIES = 3;

const ApiResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  version: z.number(),
  data: z.record(z.any()),
  status: z.string(),
  createdAt: z.string(),
  prevHash: z.any().nullable(),
  hash: z.any().nullable(),
});

export function useApiTransmitter(buffer) {
  const [apiKey, setApiKeyState] = useState('');
  const [transmissionStatus, setTransmissionStatus] = useState('대기');
  const [lastTransmission, setLastTransmission] = useState(null);
  const [error, setError] = useState(null);
  const [failCount, setFailCount] = useState(0);
  const isTransmitting = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE).then(stored => {
      if (stored) setApiKeyState(stored);
    });
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    const interval = setInterval(() => {
      if (buffer && buffer.length > 0) {
        transmitAll(buffer);
      } else {
        // 큐만 남아있을 수도 있으니 큐만 전송 시도
        transmitAll([]);
      }
    }, TRANSMIT_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [apiKey, buffer]);

  const setApiKey = async (key) => {
    await AsyncStorage.setItem(API_KEY_STORAGE, key);
    setApiKeyState(key);
  };

  // 큐 불러오기
  const getQueue = async () => {
    const q = await AsyncStorage.getItem(QUEUE_STORAGE);
    return q ? JSON.parse(q) : [];
  };
  // 큐 저장
  const setQueue = async (q) => {
    await AsyncStorage.setItem(QUEUE_STORAGE, JSON.stringify(q));
  };

  // 버퍼+큐 합쳐서 전송, 성공 시 모두 삭제, 실패 시 큐에 저장
  const transmitAll = async (bufferData) => {
    if (isTransmitting.current) return;
    isTransmitting.current = true;
    setTransmissionStatus('전송 중');
    setError(null);
    let retries = 0;
    let queue = await getQueue();
    const toSend = [...queue, ...bufferData];
    if (toSend.length === 0) {
      setTransmissionStatus('대기');
      isTransmitting.current = false;
      return;
    }
    try {
      while (retries < MAX_RETRIES) {
        try {
          // API 명세에 맞는 구조로 전송
          for (const item of toSend) {
            const payload = {
              key: item.type || 'sensor-data',
              data: item.data || item,
            };
            const res = await axios.post(API_ENDPOINT, payload, {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
              },
              timeout: 10000,
            });
            const parsed = ApiResponseSchema.safeParse(res.data);
            if (!parsed.success) throw new Error('API 응답 형식 오류');
          }
          // 모두 성공 시 큐/버퍼 삭제
          await setQueue([]);
          setTransmissionStatus('성공');
          setLastTransmission(Date.now());
          setFailCount(0);
          isTransmitting.current = false;
          return;
        } catch (e) {
          retries++;
          if (retries >= MAX_RETRIES) {
            // 실패한 데이터 큐에 저장
            await setQueue(toSend);
            setTransmissionStatus('실패');
            setError('전송 실패: ' + e.message);
            setFailCount(failCount + 1);
            isTransmitting.current = false;
            return;
          }
        }
      }
    } catch (e) {
      setTransmissionStatus('실패');
      setError('전송 실패: ' + e.message);
      setFailCount(failCount + 1);
    }
    isTransmitting.current = false;
  };

  return {
    apiKey,
    setApiKey,
    transmissionStatus,
    lastTransmission,
    error,
    failCount,
  };
}
