import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function TransmissionStatusPanel({ status, lastTransmission }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="전송 상태" />
      <Card.Content>
        <Text>상태: {status}</Text>
        <Text>마지막 전송: {lastTransmission ? new Date(lastTransmission).toLocaleString() : '-'}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
});
