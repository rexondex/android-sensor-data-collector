import * as Location from 'expo-location';
import { Accelerometer, Barometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

export type SensorType = 'accelerometer' | 'gyroscope' | 'magnetometer' | 'barometer' | 'location';

export interface SensorData {
  accelerometer?: { x: number; y: number; z: number };
  gyroscope?: { x: number; y: number; z: number };
  magnetometer?: { x: number; y: number; z: number };
  barometer?: { pressure: number };
  location?: { latitude: number; longitude: number; accuracy: number };
}

export function useAvailableSensors() {
  const [available, setAvailable] = useState<SensorType[]>([]);

  useEffect(() => {
    (async () => {
      const sensors: SensorType[] = [];
      if (await Accelerometer.isAvailableAsync()) sensors.push('accelerometer');
      if (await Gyroscope.isAvailableAsync()) sensors.push('gyroscope');
      if (await Magnetometer.isAvailableAsync()) sensors.push('magnetometer');
      if (await Barometer.isAvailableAsync()) sensors.push('barometer');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') sensors.push('location');
      setAvailable(sensors);
    })();
  }, []);

  return available;
}

export function useSensorData(enabledSensors: SensorType[], interval: number = 5000) {
  const [data, setData] = useState<SensorData>({});

  useEffect(() => {
    let locationSub: Location.LocationSubscription | null = null;
    const listeners: any[] = [];

    if (enabledSensors.includes('accelerometer')) {
      listeners.push(
        Accelerometer.addListener((d) => setData((prev) => ({ ...prev, accelerometer: d })))
      );
      Accelerometer.setUpdateInterval(interval);
    }
    if (enabledSensors.includes('gyroscope')) {
      listeners.push(
        Gyroscope.addListener((d) => setData((prev) => ({ ...prev, gyroscope: d })))
      );
      Gyroscope.setUpdateInterval(interval);
    }
    if (enabledSensors.includes('magnetometer')) {
      listeners.push(
        Magnetometer.addListener((d) => setData((prev) => ({ ...prev, magnetometer: d })))
      );
      Magnetometer.setUpdateInterval(interval);
    }
    if (enabledSensors.includes('barometer')) {
      listeners.push(
        Barometer.addListener((d) => setData((prev) => ({ ...prev, barometer: d })))
      );
      Barometer.setUpdateInterval(interval);
    }
    if (enabledSensors.includes('location')) {
      (async () => {
        locationSub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: interval, distanceInterval: 0 },
          (loc) => setData((prev) => ({ ...prev, location: loc.coords }))
        );
      })();
    }
    return () => {
      listeners.forEach((l) => l.remove());
      if (locationSub) locationSub.remove();
    };
  }, [enabledSensors, interval]);

  return data;
}
