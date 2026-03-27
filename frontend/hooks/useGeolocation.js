import { useState } from 'react';

export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation not supported');
        setError(err);
        reject(err);
        return;
      }
      
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          setPosition(coords);
          setLoading(false);
          resolve(coords);
        },
        (err) => {
          setError(err);
          setLoading(false);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  const watchPosition = (callback) => {
    if (!navigator.geolocation) return () => {};
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setPosition(coords);
        if (callback) callback(coords);
      },
      (err) => setError(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  };

  return { position, error, loading, getCurrentPosition, watchPosition };
}
