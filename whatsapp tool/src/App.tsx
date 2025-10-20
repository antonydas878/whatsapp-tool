import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, MessageCircle, Zap } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { FileUpload } from './components/FileUpload';
import { LanguageSelector } from './components/LanguageSelector';
import type { ChatMessage } from './utils/chatParser';
import { translateText, detectEmotion, generateAIReply } from './utils/modelManager';

interface MessageState {
  translatedText?: string;
  isTranslating?: boolean;
  emotion?: { emotion: string; score: number };
  isDetectingEmotion?: boolean;
  aiReply?: string;
  isGeneratingReply?: boolean;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mediaFiles, setMediaFiles] = useState<Map<string, string>>(new Map());
  const [messageStates, setMessageStates] = useState<Record<string, MessageState>>({});
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [darkMode, setDarkMode] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const senderCounts: Record<string, number> = {};
      messages.forEach((msg) => {
        senderCounts[msg.sender] = (senderCounts[msg.sender] || 0) + 1;
      });

      const mostFrequentSender = Object.entries(senderCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      setCurrentUserName(mostFrequentSender);
    }
  }, [messages]);

  const handleChatLoaded = (loadedMessages: ChatMessage[], loadedMediaFiles: Map<string, string>) => {
    setMessages(loadedMessages);
    setMediaFiles(loadedMediaFiles);
    setMessageStates({});
  };

  const handleTranslate = async (messageId: string, targetLang: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    setMessageStates((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], isTranslating: true },
    }));

    const translatedText = await translateText(message.message, targetLang);

    setMessageStates((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], translatedText, isTranslating: false },
    }));
  };

  const handleDetectEmotion = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    setMessageStates((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], isDetectingEmotion: true },
    }));

    const emotion = await detectEmotion(message.message);

    setMessageStates((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], emotion, isDetectingEmotion: false },
    }));
  };

  const handleGenerateReply = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    setMessageStates((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], isGeneratingReply: true },
    }));

    let emotion = messageStates[messageId]?.emotion;
    if (!emotion) {
      emotion = await detectEmotion(message.message);
    }

    const aiReply = await generateAIReply(message.message, emotion.emotion);

    setMessageStates((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], aiReply, emotion, isGeneratingReply: false },
    }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-5xl mx-auto h-screen flex flex-col">
          <header className="bg-green-600 dark:bg-green-700 text-white shadow-lg transition-colors">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <h1 className="text-xl font-semibold">WhatsApp Chat Viewer + Translator</h1>
              </div>

              <div className="flex items-center gap-4">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />

                <FileUpload onChatLoaded={handleChatLoaded} />

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  title={darkMode ? 'Light Mode' : 'Dark Mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Welcome to WhatsApp Chat Viewer
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Upload your exported WhatsApp chat to get started. You can translate messages,
                    detect emotions, and generate AI replies - all running in your browser!
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <div className="flex items-start gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Hover over messages</strong> to translate, detect emotion, or
                        generate AI replies
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Everything runs offline</strong> after initial model download
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-6 bg-gray-100 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
              >
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.sender === currentUserName}
                    onTranslate={handleTranslate}
                    onDetectEmotion={handleDetectEmotion}
                    onGenerateReply={handleGenerateReply}
                    translatedText={messageStates[message.id]?.translatedText}
                    isTranslating={messageStates[message.id]?.isTranslating}
                    emotion={messageStates[message.id]?.emotion}
                    isDetectingEmotion={messageStates[message.id]?.isDetectingEmotion}
                    aiReply={messageStates[message.id]?.aiReply}
                    isGeneratingReply={messageStates[message.id]?.isGeneratingReply}
                    selectedLanguage={selectedLanguage}
                  />
                ))}
              </div>
            )}

            {messages.length > 0 && (
              <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{messages.length} messages loaded</span>
                  <span className="text-xs">
                    Hover over messages to access AI features
                  </span>
                </div>
              </footer>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
