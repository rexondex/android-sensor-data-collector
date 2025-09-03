import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function BufferStatusPanel({ bufferSize }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="버퍼 상태" />
      <Card.Content>
        <Text>버퍼 크기: {bufferSize}개</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
});
