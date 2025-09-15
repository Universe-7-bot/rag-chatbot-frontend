const API_BASE_URL = 'http://localhost:3001/api';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  sources?: Array<{
    title: string;
    url?: string;
    date?: string;
  }>;
  isError?: boolean;
}

export interface ChatResponse {
  message: string;
  isStreaming?: boolean;
  sources?: Array<{
    title: string;
    url?: string;
    date?: string;
  }>;
}

export class ChatService {
  static async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async sendMessageStreaming(
    sessionId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (sources?: any[]) => void
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    try {
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'chunk') {
                onChunk(parsed.content);
              } else if (parsed.type === 'complete') {
                onComplete(parsed.sources);
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  static async getChatHistory(sessionId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/history`);

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }

  static async clearSession(sessionId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}