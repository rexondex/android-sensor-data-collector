import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

const SENSOR_INTERVAL = 100; // ms
const BUFFER_INTERVAL = 5000; // ms

export function useSensorManager() {
  const [sensorData, setSensorData] = useState({});
  const [buffer, setBuffer] = useState([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState(null);
  const bufferRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isCollecting) {
      startAll();
    } else {
      stopAll();
    }
    return () => stopAll();
    // eslint-disable-next-line
  }, [isCollecting]);

  const startAll = async () => {
    setError(null);
    try {
      Accelerometer.setUpdateInterval(SENSOR_INTERVAL);
      Gyroscope.setUpdateInterval(SENSOR_INTERVAL);
      const accSub = Accelerometer.addListener(data => {
        setSensorData(prev => ({ ...prev, accelerometer: data }));
        bufferRef.current.push({ type: 'accelerometer', data, ts: Date.now() });
      });
      const gyroSub = Gyroscope.addListener(data => {
        setSensorData(prev => ({ ...prev, gyroscope: data }));
        bufferRef.current.push({ type: 'gyroscope', data, ts: Date.now() });
      });
      let locPerm = await Location.requestForegroundPermissionsAsync();
      if (!locPerm.granted) throw new Error('위치 권한 필요');
      const locSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: SENSOR_INTERVAL, distanceInterval: 0 },
        loc => {
          setSensorData(prev => ({ ...prev, location: loc.coords }));
          bufferRef.current.push({ type: 'location', data: loc.coords, ts: Date.now() });
        }
      );
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
  };
}
