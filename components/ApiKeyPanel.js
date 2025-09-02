import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';

export default function ApiKeyPanel({ apiKey, setApiKey }) {
  const [input, setInput] = useState(apiKey || '');
  return (
    <Card style={styles.card}>
      <Card.Title title="API 키 관리" />
      <Card.Content>
        <TextInput
          label="API Key"
          value={input}
          onChangeText={setInput}
          secureTextEntry
          style={{ marginBottom: 8 }}
        />
        <Button mode="contained" onPress={() => setApiKey(input)}>
          저장 및 활성화
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
});
