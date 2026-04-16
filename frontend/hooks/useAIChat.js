import { useState } from 'react';
import useAuthStore from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_URL = API_URL ? `${API_URL}` : null;

// Realistic mock AI responses for demo mode
const MOCK_RESPONSES = [
  'Based on the symptoms you have described, this may indicate a mild viral infection. I recommend rest, adequate hydration (8-10 glasses of water daily), and paracetamol for fever if present. If symptoms persist beyond 5 days or worsen, please consult with a specialist. **URGENCY: green**',
  'The symptoms you have mentioned could have several causes. I would recommend monitoring your temperature and noting any additional symptoms. If you experience chest pain, severe difficulty breathing, or symptoms lasting more than a week, please seek immediate medical attention. **URGENCY: yellow**',
  'Thank you for sharing your symptoms. Based on the pattern, this appears to be consistent with seasonal allergies or a mild respiratory infection. Antihistamines and nasal saline rinse may provide relief. A doctor consultation is advisable for accurate diagnosis. **URGENCY: green**',
  'I understand your concern. The combination of symptoms you have described warrants a professional evaluation. Please schedule a consultation with a physician for proper diagnosis. In the meantime, maintain hydration and rest. **URGENCY: green**',
  'Your symptoms could indicate multiple conditions. I strongly recommend booking an appointment with one of our specialist doctors for a thorough evaluation. If you develop difficulty breathing, severe chest pain, or high fever above 103°F, please seek emergency care immediately. **URGENCY: yellow**',
];

let mockIndex = 0;

/**
 * Simulates a streaming AI response for demo mode.
 * Streams words progressively to mimic real SSE streaming.
 */
async function streamMockResponse(text, onChunk, onDone) {
  const words = text.split(' ');
  let accumulated = '';

  for (let i = 0; i < words.length; i++) {
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 30));
    accumulated += (i === 0 ? '' : ' ') + words[i];
    onChunk(accumulated);
  }
  onDone(accumulated);
}

export default function useAIChat() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState(null);

  const token = useAuthStore((state) => state.token);

  const extractUrgency = (text) => {
    if (text.includes('URGENCY: red')) return 'red';
    if (text.includes('URGENCY: yellow')) return 'yellow';
    if (text.includes('URGENCY: green')) return 'green';
    return null;
  };

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsThinking(true);

    // Add placeholder for the AI response
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    // If no backend, use mock streaming response
    if (!BACKEND_URL) {
      const mockText = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
      mockIndex++;

      await streamMockResponse(
        mockText,
        (partial) => {
          setMessages((prev) => {
            const last = { ...prev[prev.length - 1], content: partial };
            return [...prev.slice(0, -1), last];
          });
        },
        (final) => {
          const urgency = extractUrgency(final);
          if (urgency) setUrgencyLevel(urgency);
          setIsThinking(false);
        }
      );
      return;
    }

    // Real backend streaming
    try {
      const response = await fetch(`${BACKEND_URL}/ai/symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(-10),
          language: 'auto',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiText += chunk;

        setMessages((prev) => {
          const last = { ...prev[prev.length - 1], content: aiText };
          return [...prev.slice(0, -1), last];
        });
      }

      const urgency = extractUrgency(aiText);
      if (urgency) setUrgencyLevel(urgency);

      // Non-blocking save
      if (token) {
        fetch(`${BACKEND_URL}/ai/save-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            messages: [...newMessages, { role: 'assistant', content: aiText }],
            urgency: urgency || 'green',
          }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('[SehatAI] Backend unavailable, using mock response:', e.message);
      // Graceful fallback to mock on any error
      const mockText = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
      mockIndex++;

      await streamMockResponse(
        mockText,
        (partial) => {
          setMessages((prev) => {
            const last = { ...prev[prev.length - 1], content: partial };
            return [...prev.slice(0, -1), last];
          });
        },
        (final) => {
          const urgency = extractUrgency(final);
          if (urgency) setUrgencyLevel(urgency);
        }
      );
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUrgencyLevel(null);
  };

  return { messages, isThinking, sendMessage, clearChat, urgencyLevel };
}
