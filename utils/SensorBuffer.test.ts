import { SensorBuffer } from '../utils/SensorBuffer';

describe('SensorBuffer', () => {
  it('should add and flush data', () => {
    const buffer = new SensorBuffer(3);
    buffer.add({ accelerometer: { x: 1, y: 2, z: 3 } });
    buffer.add({ gyroscope: { x: 4, y: 5, z: 6 } });
    expect(buffer.size()).toBe(2);
    const flushed = buffer.flush();
    expect(flushed.length).toBe(2);
    expect(buffer.size()).toBe(0);
  });

  it('should not exceed max size', () => {
    const buffer = new SensorBuffer(2);
    buffer.add({ accelerometer: { x: 1, y: 2, z: 3 } });
    buffer.add({ gyroscope: { x: 4, y: 5, z: 6 } });
    buffer.add({ barometer: { pressure: 1000 } });
    expect(buffer.size()).toBe(2);
  });
});
