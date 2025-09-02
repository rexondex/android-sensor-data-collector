import { renderHook } from '@testing-library/react-hooks';
import { useSensorManager } from '../sensorManager';

describe('useSensorManager', () => {
  it('초기 상태는 비어있어야 한다', () => {
    const { result } = renderHook(() => useSensorManager());
    expect(result.current.sensorData).toEqual({});
    expect(result.current.buffer).toEqual([]);
    expect(result.current.isCollecting).toBe(false);
  });
});

// 테스트 비활성화: Jest 환경 문제로 임시 주석 처리
// describe('useSensorManager', () => {
//   it('초기 상태는 비어있어야 한다', () => {
//     const { result } = renderHook(() => useSensorManager());
//     expect(result.current.sensorData).toEqual({});
//     expect(result.current.buffer).toEqual([]);
//     expect(result.current.isCollecting).toBe(false);
//   });
// });
