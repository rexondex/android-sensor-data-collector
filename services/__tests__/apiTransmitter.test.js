import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks';
import { useApiTransmitter } from '../apiTransmitter';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { id: '1', key: 'sensor', version: 1, data: {}, status: 'active', createdAt: '2025-09-01T12:05:20.837Z', prevHash: null, hash: null } }))
}));

describe('useApiTransmitter', () => {
  it('API 키 저장 및 불러오기', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('test-key');
    const { result, waitForNextUpdate } = renderHook(() => useApiTransmitter([]));
    await waitForNextUpdate();
    expect(result.current.apiKey).toBe('test-key');
    await act(async () => {
      await result.current.setApiKey('new-key');
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('API_KEY', 'new-key');
  });
});
