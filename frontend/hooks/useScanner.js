import { useState, useCallback } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';
import { post } from '@/lib/api';

export default function useScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [reader, setReader] = useState(null);

  const startScan = useCallback(async (videoElementId) => {
    try {
      setScanning(true);
      setResult(null);
      setError(null);
      
      const codeReader = new BrowserBarcodeReader();
      setReader(codeReader);
      
      const videoInputDevices = await codeReader.getVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;
      
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoElementId, async (res, err) => {
        if (res) {
          codeReader.reset();
          setScanning(false);
          
          if (navigator.vibrate) navigator.vibrate(100);
          
          try {
            const { data } = await post('/vela/ai/scan', { barcode: res.getText() });
            setResult(data);
          } catch (e) {
            setError(e);
          }
        }
      });
    } catch (e) {
      setError(e);
      setScanning(false);
    }
  }, []);

  const stopScan = useCallback(() => {
    if (reader) {
      reader.reset();
    }
    setScanning(false);
  }, [reader]);

  return { scanning, result, error, startScan, stopScan };
}
