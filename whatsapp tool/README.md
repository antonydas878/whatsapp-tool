# WhatsApp Chat Viewer + Translator

A powerful, fully client-side web application for viewing, analyzing, and translating WhatsApp chat exports. Everything runs in your browser with no server required!

## Features

- **Upload & Parse**: Import WhatsApp chat exports (.txt or .zip with media)
- **WhatsApp-Style UI**: Beautiful chat bubbles with sender names and timestamps
- **Real-time Translation**: Translate messages to multiple languages (English, Hindi, Spanish, French, German, Chinese)
- **Emotion Detection**: Analyze the emotional tone of messages (happy, sad, angry, neutral)
- **AI Reply Generation**: Generate contextual AI replies matching the emotion and tone
- **Media Support**: View images from ZIP exports
- **Dark Mode**: Toggle between light and dark themes
- **Fully Offline**: Works offline after initial model download
- **Privacy-First**: All processing happens in your browser - no data is sent to servers

## How to Use

1. **Export Your WhatsApp Chat**
   - Open WhatsApp on your phone
   - Go to the chat you want to export
   - Tap the three dots menu → More → Export chat
   - Choose "Without Media" for .txt or "With Media" for .zip

2. **Upload to the App**
   - Click the "Upload Chat" button
   - Select your exported .txt or .zip file
   - Wait for the chat to load

3. **Interact with Messages**
   - Hover over any message to see action buttons
   - Click "Translate" to translate the message
   - Click "Emotion" to detect the emotional tone
   - Click "Reply" to generate an AI-suggested response

4. **Customize**
   - Use the language selector to choose translation language
   - Toggle dark mode with the sun/moon icon

## Technical Details

### Technologies Used

- **React + Vite + TypeScript**: Modern web framework
- **Tailwind CSS**: Utility-first styling
- **Transformers.js**: In-browser machine learning
- **WebLLM**: Client-side large language model
- **JSZip**: ZIP file handling
- **Framer Motion**: Smooth animations

### Models Used

- **Translation**: Xenova/nllb-200-distilled-600M (multilingual translation)
- **Emotion Detection**: Xenova/distilbert-base-uncased-finetuned-sst-2-english
- **AI Replies**: Phi-3-mini-4k-instruct (via WebLLM)

### Browser Requirements

- Modern browser with WebGPU support recommended
- Sufficient RAM (4GB+ recommended) for loading ML models
- IndexedDB support for model caching

## Sample Chat

A sample chat file is included at `public/sample-chat.txt` for testing purposes.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Privacy & Security

- All processing happens locally in your browser
- No data is uploaded to any server
- Models are cached in browser storage for offline use
- Your chat data never leaves your device

## License

MIT License - Feel free to use and modify!
