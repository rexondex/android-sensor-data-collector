import { SensorData } from '../hooks/useSensors';

export class SensorBuffer {
  private buffer: { timestamp: number; data: SensorData }[] = [];
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  add(data: SensorData) {
    this.buffer.push({ timestamp: Date.now(), data });
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  flush(): { timestamp: number; data: SensorData }[] {
    const copy = [...this.buffer];
    this.buffer = [];
    return copy;
  }

  getAll(): { timestamp: number; data: SensorData }[] {
    return [...this.buffer];
  }

  size() {
    return this.buffer.length;
  }
}
