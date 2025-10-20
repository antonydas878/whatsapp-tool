export interface ChatMessage {
  id: string;
  date: string;
  time: string;
  sender: string;
  message: string;
  isMedia: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

export function parseWhatsAppChat(content: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const lines = content.split('\n');

  const messagePattern = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s*[-–]\s*([^:]+):\s*(.*)$/i;

  let currentMessage: ChatMessage | null = null;

  lines.forEach((line, index) => {
    const match = line.match(messagePattern);

    if (match) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const [, date, time, sender, message] = match;

      const isMedia = message.includes('<attached:') ||
                      message.includes('(file attached)') ||
                      message.includes('.jpg') ||
                      message.includes('.png') ||
                      message.includes('.mp4');

      currentMessage = {
        id: `${index}-${Date.now()}`,
        date: date.trim(),
        time: time.trim(),
        sender: sender.trim(),
        message: message.trim(),
        isMedia,
      };
    } else if (currentMessage && line.trim()) {
      currentMessage.message += '\n' + line;
    }
  });

  if (currentMessage) {
    messages.push(currentMessage);
  }

  return messages;
}

export function extractMediaFromMessage(message: string): { type: string; filename: string } | null {
  const imagePattern = /\.(jpg|jpeg|png|gif|webp)/i;
  const videoPattern = /\.(mp4|mov|avi)/i;
  const audioPattern = /\.(mp3|wav|ogg|opus)/i;

  if (imagePattern.test(message)) {
    const match = message.match(/([^\s]+\.(jpg|jpeg|png|gif|webp))/i);
    return { type: 'image', filename: match ? match[1] : '' };
  }

  if (videoPattern.test(message)) {
    const match = message.match(/([^\s]+\.(mp4|mov|avi))/i);
    return { type: 'video', filename: match ? match[1] : '' };
  }

  if (audioPattern.test(message)) {
    const match = message.match(/([^\s]+\.(mp3|wav|ogg|opus))/i);
    return { type: 'audio', filename: match ? match[1] : '' };
  }

  return null;
}
