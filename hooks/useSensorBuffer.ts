import { useCallback, useRef, useState } from 'react';
import { SensorData } from '../hooks/useSensors';
import { SensorBuffer } from '../utils/SensorBuffer';

export function useSensorBuffer(interval: number = 5000) {
  const bufferRef = useRef(new SensorBuffer(1000));
  const [bufferSize, setBufferSize] = useState(0);

  const addData = useCallback((data: SensorData) => {
    bufferRef.current.add(data);
    setBufferSize(bufferRef.current.size());
  }, []);

  const flush = useCallback(() => {
    const flushed = bufferRef.current.flush();
    setBufferSize(0);
    return flushed;
  }, []);

  return { addData, flush, bufferSize };
}
