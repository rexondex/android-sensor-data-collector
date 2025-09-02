import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const API_KEY_STORAGE = 'API_KEY';
const API_ENDPOINT = 'https://your-api-endpoint.com/data'; // 실제 엔드포인트로 교체 필요
const TRANSMIT_INTERVAL = 30000; // 30초
const MAX_RETRIES = 3;

const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export function useApiTransmitter(buffer) {
  const [apiKey, setApiKeyState] = useState('');
  const [transmissionStatus, setTransmissionStatus] = useState('대기');
  const [lastTransmission, setLastTransmission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE).then(stored => {
      if (stored) setApiKeyState(stored);
    });
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    const interval = setInterval(() => {
      if (buffer && buffer.length > 0) {
        transmitBuffer(buffer);
      }
    }, TRANSMIT_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [apiKey, buffer]);

  const setApiKey = async (key) => {
    await AsyncStorage.setItem(API_KEY_STORAGE, key);
    setApiKeyState(key);
  };

  const transmitBuffer = async (data) => {
    setTransmissionStatus('전송 중');
    setError(null);
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const res = await axios.post(API_ENDPOINT, { data }, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          timeout: 10000,
        });
        const parsed = ApiResponseSchema.safeParse(res.data);
        if (!parsed.success) throw new Error('API 응답 형식 오류');
        setTransmissionStatus('성공');
        setLastTransmission(Date.now());
        break;
      } catch (e) {
        retries++;
        if (retries >= MAX_RETRIES) {
          setTransmissionStatus('실패');
          setError('전송 실패: ' + e.message);
        }
      }
    }
  };

  return {
    apiKey,
    setApiKey,
    transmissionStatus,
    lastTransmission,
    error,
  };
}
