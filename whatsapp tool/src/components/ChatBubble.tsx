import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Languages, Heart, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../utils/chatParser';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  onTranslate: (messageId: string, targetLang: string) => void;
  onDetectEmotion: (messageId: string) => void;
  onGenerateReply: (messageId: string) => void;
  translatedText?: string;
  isTranslating?: boolean;
  emotion?: { emotion: string; score: number };
  isDetectingEmotion?: boolean;
  aiReply?: string;
  isGeneratingReply?: boolean;
  selectedLanguage: string;
}

export function ChatBubble({
  message,
  isCurrentUser,
  onTranslate,
  onDetectEmotion,
  onGenerateReply,
  translatedText,
  isTranslating,
  emotion,
  isDetectingEmotion,
  aiReply,
  isGeneratingReply,
  selectedLanguage,
}: ChatBubbleProps) {
  const [showActions, setShowActions] = useState(false);

  const emotionEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-lg px-4 py-2 shadow-md ${
            isCurrentUser
              ? 'bg-green-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          {!isCurrentUser && (
            <div className="font-semibold text-sm text-green-600 mb-1">{message.sender}</div>
          )}

          {message.isMedia && message.mediaUrl && (
            <img
              src={message.mediaUrl}
              alt="Media"
              className="rounded-md mb-2 max-w-full"
            />
          )}

          <div className="text-sm whitespace-pre-wrap break-words">{message.message}</div>

          {translatedText && (
            <div className="mt-2 pt-2 border-t border-opacity-20 border-gray-400">
              <div className="text-xs opacity-75 mb-1">Translation:</div>
              <div className="text-sm italic">{translatedText}</div>
            </div>
          )}

          {emotion && (
            <div className="mt-2 pt-2 border-t border-opacity-20 border-gray-400 flex items-center gap-2">
              <span className="text-lg">{emotionEmojis[emotion.emotion]}</span>
              <span className="text-xs opacity-75">
                {emotion.emotion} ({Math.round(emotion.score * 100)}%)
              </span>
            </div>
          )}

          {aiReply && (
            <div className="mt-2 pt-2 border-t border-opacity-20 border-gray-400">
              <div className="text-xs opacity-75 mb-1">AI Suggestion:</div>
              <div className="text-sm italic">{aiReply}</div>
            </div>
          )}

          <div className={`text-xs mt-1 ${isCurrentUser ? 'text-green-100' : 'text-gray-500'}`}>
            {message.time}
          </div>
        </div>

        {(isTranslating || isDetectingEmotion || isGeneratingReply) && (
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            {isTranslating && 'Translating...'}
            {isDetectingEmotion && 'Detecting emotion...'}
            {isGeneratingReply && 'Generating reply...'}
          </div>
        )}

        {showActions && !isTranslating && !isDetectingEmotion && !isGeneratingReply && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex gap-2"
          >
            <button
              onClick={() => onTranslate(message.id, selectedLanguage)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Translate"
            >
              <Languages className="w-3 h-3" />
              Translate
            </button>

            <button
              onClick={() => onDetectEmotion(message.id)}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Detect Emotion"
            >
              <Heart className="w-3 h-3" />
              Emotion
            </button>

            {!isCurrentUser && (
              <button
                onClick={() => onGenerateReply(message.id)}
                className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                title="Generate AI Reply"
              >
                <MessageSquare className="w-3 h-3" />
                Reply
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
