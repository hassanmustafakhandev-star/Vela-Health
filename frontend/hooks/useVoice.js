import { useState } from 'react';
import { startRecording as libStartRecording, stopRecording, sendToWhisper } from '@/lib/voice';
import useAuthStore from '@/store/authStore';

export default function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  
  const [recorderState, setRecorderState] = useState(null);
  const token = useAuthStore(state => state.token);

  const startRecording = async () => {
    try {
      const { mediaRecorder, audioChunks } = await libStartRecording();
      setIsRecording(true);
      setRecorderState({ mediaRecorder, audioChunks });
      
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      
      mediaRecorder.addEventListener('stop', () => clearInterval(interval));
    } catch (e) {
      console.error('Microphone access denied', e);
    }
  };

  const stopAndTranscribe = async () => {
    if (!recorderState) return '';
    setIsRecording(false);
    setAudioLevel(0);
    
    try {
      const blob = await stopRecording(recorderState.mediaRecorder, recorderState.audioChunks);
      const text = await sendToWhisper(blob, token);
      setTranscript(text);
      return text;
    } catch (e) {
      console.error('Transcription error', e);
      return '';
    } finally {
      setRecorderState(null);
    }
  };

  return { isRecording, audioLevel, transcript, startRecording, stopAndTranscribe };
}
