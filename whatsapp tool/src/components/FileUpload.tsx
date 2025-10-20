import { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import JSZip from 'jszip';
import { parseWhatsAppChat, type ChatMessage } from '../utils/chatParser';
import { extractMediaFromMessage } from '../utils/chatParser';

interface FileUploadProps {
  onChatLoaded: (messages: ChatMessage[], mediaFiles: Map<string, string>) => void;
}

export function FileUpload({ onChatLoaded }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const mediaFiles = new Map<string, string>();

    if (file.name.endsWith('.zip')) {
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);

        let chatText = '';
        const filePromises: Promise<void>[] = [];

        contents.forEach((relativePath, file) => {
          if (relativePath.endsWith('.txt')) {
            filePromises.push(
              file.async('string').then((text) => {
                chatText = text;
              })
            );
          } else if (relativePath.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i)) {
            filePromises.push(
              file.async('blob').then((blob) => {
                const url = URL.createObjectURL(blob);
                const filename = relativePath.split('/').pop() || relativePath;
                mediaFiles.set(filename, url);
              })
            );
          }
        });

        await Promise.all(filePromises);

        if (chatText) {
          const messages = parseWhatsAppChat(chatText);

          messages.forEach((msg) => {
            const mediaInfo = extractMediaFromMessage(msg.message);
            if (mediaInfo && mediaFiles.has(mediaInfo.filename)) {
              msg.mediaUrl = mediaFiles.get(mediaInfo.filename);
              msg.mediaType = mediaInfo.type;
            }
          });

          onChatLoaded(messages, mediaFiles);
        }
      } catch (error) {
        console.error('Error processing ZIP file:', error);
        alert('Failed to process ZIP file. Please ensure it contains a valid WhatsApp chat export.');
      }
    } else if (file.name.endsWith('.txt')) {
      try {
        const text = await file.text();
        const messages = parseWhatsAppChat(text);
        onChatLoaded(messages, mediaFiles);
      } catch (error) {
        console.error('Error processing text file:', error);
        alert('Failed to process text file. Please ensure it is a valid WhatsApp chat export.');
      }
    } else {
      alert('Please upload a .txt or .zip file containing WhatsApp chat export.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.zip"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Upload Chat</span>
        <FileText className="w-4 h-4 sm:hidden" />
      </label>
    </>
  );
}
