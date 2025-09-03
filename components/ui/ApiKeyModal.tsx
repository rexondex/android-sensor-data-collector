import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

interface ApiKeyModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ApiKeyModal({ visible, onClose, onSaved }: ApiKeyModalProps) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const saveKey = async () => {
    if (!key.trim()) {
      Alert.alert('API Key를 입력하세요');
      return;
    }
    setLoading(true);
    await SecureStore.setItemAsync('MY_API_KEY', key.trim());
    setLoading(false);
    onClose();
    onSaved?.();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>API Key 입력</Text>
          <TextInput
            style={styles.input}
            value={key}
            onChangeText={setKey}
            placeholder="x-api-key를 입력하세요"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button title={loading ? '저장 중...' : '저장'} onPress={saveKey} disabled={loading} />
          <Button title="닫기" onPress={onClose} color="#888" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: 320,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
});
