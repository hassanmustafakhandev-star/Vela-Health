export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  });

  mediaRecorder.start();
  return { mediaRecorder, audioChunks };
}

export function stopRecording(mediaRecorder, audioChunks) {
  return new Promise((resolve) => {
    mediaRecorder.addEventListener('stop', () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      resolve(blob);
    });
    mediaRecorder.stop();
  });
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function sendToWhisper(blob, token) {
  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');
  
  const response = await fetch('/api/ai/voice', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const data = await response.json();
  return data.text;
}
