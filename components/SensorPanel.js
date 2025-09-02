import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function SensorPanel({ sensorData, isCollecting, startSensors, stopSensors, supportedSensors }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="실시간 센서 데이터" />
      <Card.Content>
        {supportedSensors.includes('accelerometer') && (
          <Text>가속도계: {sensorData.accelerometer ? JSON.stringify(sensorData.accelerometer) : '-'}</Text>
        )}
        {supportedSensors.includes('gyroscope') && (
          <Text>자이로: {sensorData.gyroscope ? JSON.stringify(sensorData.gyroscope) : '-'}</Text>
        )}
        {supportedSensors.includes('location') && (
          <Text>GPS: {sensorData.location ? JSON.stringify(sensorData.location) : '-'}</Text>
        )}
        {supportedSensors.length === 0 && <Text>지원되는 센서가 없습니다.</Text>}
      </Card.Content>
      <Card.Actions>
        {isCollecting ? (
          <Button onPress={stopSensors}>중지</Button>
        ) : (
          <Button onPress={startSensors}>시작</Button>
        )}
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
});
