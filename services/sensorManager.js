import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

const SENSOR_INTERVAL = 100; // ms
const BUFFER_INTERVAL = 5000; // ms

const SENSOR_LIST = [
  { key: 'accelerometer', module: Accelerometer },
  { key: 'gyroscope', module: Gyroscope },
  { key: 'location', module: Location },
];

export function useSensorManager() {
  const [sensorData, setSensorData] = useState({});
  const [buffer, setBuffer] = useState([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState(null);
  const [supportedSensors, setSupportedSensors] = useState([]);
  const bufferRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    detectSupportedSensors();
  }, []);

  async function detectSupportedSensors() {
    const supported = [];
    for (const s of SENSOR_LIST) {
      if (s.key === 'location') {
        // 위치 권한이 있으면 location 지원
        const perm = await Location.getProviderStatusAsync().catch(() => null);
        if (perm) supported.push('location');
      } else if (s.module && s.module.isAvailableAsync) {
        try {
          if (await s.module.isAvailableAsync()) supported.push(s.key);
        } catch {}
      }
    }
    setSupportedSensors(supported);
  }

  useEffect(() => {
    if (isCollecting) {
      startAll();
    } else {
      stopAll();
    }
    return () => stopAll();
    // eslint-disable-next-line
  }, [isCollecting, supportedSensors]);

  const startAll = async () => {
    setError(null);
    try {
      let accSub, gyroSub, locSub;
      if (supportedSensors.includes('accelerometer')) {
        Accelerometer.setUpdateInterval(SENSOR_INTERVAL);
        accSub = Accelerometer.addListener(data => {
          setSensorData(prev => ({ ...prev, accelerometer: data }));
          bufferRef.current.push({ type: 'accelerometer', data, ts: Date.now() });
        });
      }
      if (supportedSensors.includes('gyroscope')) {
        Gyroscope.setUpdateInterval(SENSOR_INTERVAL);
        gyroSub = Gyroscope.addListener(data => {
          setSensorData(prev => ({ ...prev, gyroscope: data }));
          bufferRef.current.push({ type: 'gyroscope', data, ts: Date.now() });
        });
      }
      if (supportedSensors.includes('location')) {
        let locPerm = await Location.requestForegroundPermissionsAsync();
        if (!locPerm.granted) throw new Error('위치 권한 필요');
        locSub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: SENSOR_INTERVAL, distanceInterval: 0 },
          loc => {
            setSensorData(prev => ({ ...prev, location: loc.coords }));
            bufferRef.current.push({ type: 'location', data: loc.coords, ts: Date.now() });
          }
        );
      }
      intervalRef.current = setInterval(() => {
        setBuffer([...bufferRef.current]);
        bufferRef.current = [];
      }, BUFFER_INTERVAL);
      // Save subscriptions for cleanup
      intervalRef.current._subs = [accSub, gyroSub, locSub];
    } catch (e) {
      setError(e.message);
      setIsCollecting(false);
    }
  };

  const stopAll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if (intervalRef.current._subs) {
        intervalRef.current._subs.forEach(sub => sub && sub.remove && sub.remove());
      }
      intervalRef.current = null;
    }
  };

  return {
    sensorData,
    buffer,
    bufferSize: buffer.length,
    startSensors: () => setIsCollecting(true),
    stopSensors: () => setIsCollecting(false),
    isCollecting,
    error,
    supportedSensors,
  };
}
