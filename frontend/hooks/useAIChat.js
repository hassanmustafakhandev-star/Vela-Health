import { useState } from 'react';
import useAuthStore from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

export default function useAIChat() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(Date.now().toString());
  const [urgencyLevel, setUrgencyLevel] = useState(null);

  const token = useAuthStore(state => state.token);

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsThinking(true);

    // Placeholder for streaming response
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`${API_URL}/ai/symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(-10),  // Send last 10 messages
          language: 'auto',
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${response.status}`);
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

        setMessages(prev => {
          const last = { ...prev[prev.length - 1], content: aiText };
          return [...prev.slice(0, prev.length - 1), last];
        });
      }

      // Parse urgency level from AI response
      if (aiText.includes('URGENCY: red')) setUrgencyLevel('red');
      else if (aiText.includes('URGENCY: yellow')) setUrgencyLevel('yellow');
      else if (aiText.includes('URGENCY: green')) setUrgencyLevel('green');

      // Save session to backend
      if (token) {
        fetch(`${API_URL}/ai/save-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            messages: [...newMessages, { role: 'assistant', content: aiText }],
            urgency: urgencyLevel || 'green',
          }),
        }).catch(() => {}); // Non-blocking — don't fail on save error
      }
    } catch (e) {
      console.error('AI chat error:', e);
      setMessages(prev => {
        const last = { ...prev[prev.length - 1], content: `Error: ${e.message}. Please try again.` };
        return [...prev.slice(0, prev.length - 1), last];
      });
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUrgencyLevel(null);
    setSessionId(Date.now().toString());
  };

  return { messages, isThinking, sendMessage, clearChat, urgencyLevel };
}

