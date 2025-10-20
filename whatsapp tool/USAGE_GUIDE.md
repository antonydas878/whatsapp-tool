# WhatsApp Chat Viewer + Translator - Usage Guide

## Getting Started

### 1. Export Your WhatsApp Chat

**On iPhone:**
1. Open WhatsApp and go to the chat you want to export
2. Tap the contact/group name at the top
3. Scroll down and tap "Export Chat"
4. Choose "Without Media" (.txt) or "With Media" (.zip)
5. Save the file to your device

**On Android:**
1. Open WhatsApp and go to the chat you want to export
2. Tap the three dots menu (⋮) in the top right
3. Select "More" → "Export chat"
4. Choose "Without Media" (.txt) or "With Media" (.zip)
5. Save the file to your device

### 2. Upload Your Chat

1. Open the WhatsApp Chat Viewer web app
2. Click the green "Upload Chat" button in the top right
3. Select your exported .txt or .zip file
4. Wait a moment for the chat to load and parse

### 3. Using the Features

#### Translation
- **Hover** over any message to reveal action buttons
- Click the **"Translate"** button (blue)
- The message will be translated to your selected language
- Translation appears below the original message
- First time may take longer as models download

#### Emotion Detection
- **Hover** over any message
- Click the **"Emotion"** button (purple)
- The app detects if the message is happy, sad, angry, or neutral
- Shows emotion emoji and confidence score
- Great for understanding conversation tone

#### AI Reply Generation
- **Hover** over messages from other people (not your own)
- Click the **"Reply"** button (orange)
- The AI generates a contextually appropriate response
- Takes emotion into account for better replies
- First time may take several minutes as the LLM downloads (1-2GB)

### 4. Settings & Customization

#### Change Translation Language
- Use the language dropdown in the top bar
- Choose from: English, Hindi, Spanish, French, German, Chinese
- Your selection applies to all future translations

#### Toggle Dark Mode
- Click the sun/moon icon in the top right
- Switches between light and dark themes
- Preference is saved for your next visit

## Tips & Best Practices

### Performance Tips
- **First Load**: Models download on first use (may take 1-5 minutes depending on feature)
- **After Download**: Everything runs instantly offline
- **Storage**: Models are cached in browser (uses ~2GB storage)
- **RAM**: Works best with 4GB+ available RAM
- **Browser**: Chrome, Edge, or Safari recommended

### Feature Tips
- **Batch Operations**: You can translate/analyze multiple messages
- **Results Persist**: Translations and emotions stay until you upload a new chat
- **Mobile Friendly**: Works on tablets and phones (though AI features may be slower)
- **Privacy**: All processing happens locally - nothing is sent to servers

### Troubleshooting

**Models Won't Download**
- Check your internet connection
- Try a different browser
- Clear browser cache and reload

**Features Are Slow**
- First use always slower (downloading models)
- Close other tabs to free up RAM
- Try on a desktop/laptop for better performance

**Chat Won't Parse**
- Ensure you exported from WhatsApp (not a screenshot or copy-paste)
- Check file format is .txt or .zip
- Try exporting the chat again from WhatsApp

**AI Reply Fails**
- WebLLM requires WebGPU support (newest browsers)
- May not work on older devices
- Try reloading the page and trying again

## Supported Chat Formats

The app recognizes these WhatsApp date/time formats:
- `DD/MM/YYYY, HH:MM - Name: Message`
- `MM/DD/YYYY, HH:MM - Name: Message`
- `D/M/YY, H:MM AM/PM - Name: Message`

## Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server Uploads**: Your chat data never leaves your device
- **No Tracking**: We don't collect any analytics or user data
- **Open Source**: You can review all the code
- **Offline Capable**: Works without internet after models load

## Advanced Usage

### For Developers

The app uses:
- **Transformers.js** for translation and emotion detection
- **WebLLM** for AI reply generation
- **IndexedDB** for model caching
- **Web Workers** for background processing

You can modify models in `src/utils/modelManager.ts`

### Keyboard Shortcuts
- Press `Ctrl/Cmd + U` to upload a new chat (when focused on upload button)
- Press `D` to toggle dark mode (when not in input)

## Sample Data

A sample chat is included at `public/sample-chat.txt` for testing without exporting your real chats.

## Support

For issues, questions, or contributions:
- Check the README.md file
- Review the source code in the `src/` directory
- Test with the included sample-chat.txt file first

Enjoy analyzing your WhatsApp conversations!
