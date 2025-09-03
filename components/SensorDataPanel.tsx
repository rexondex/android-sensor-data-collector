import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAvailableSensors, useSensorData } from '../hooks/useSensors';

interface Props {
  interval?: number;
}

export default function SensorDataPanel({ interval = 5000 }: Props) {
  const available = useAvailableSensors();
  const data = useSensorData(available, interval);

  const sensorList = useMemo(() => available, [available]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>센서 데이터</Text>
      {sensorList.length === 0 && <Text>지원되는 센서가 없습니다.</Text>}
      {sensorList.map((sensor) => (
        <View key={sensor} style={styles.item}>
          <Text style={styles.sensor}>{sensor}</Text>
          <Text style={styles.value}>{JSON.stringify(data[sensor] ?? null)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  item: { marginBottom: 8 },
  sensor: { fontWeight: 'bold' },
  value: { fontFamily: 'monospace' },
});
