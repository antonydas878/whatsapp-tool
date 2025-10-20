import { pipeline } from '@xenova/transformers';
import * as webllm from '@mlc-ai/web-llm';

let translationPipeline: any = null;
let emotionPipeline: any = null;
let llmEngine: webllm.MLCEngine | null = null;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', model: 'Helsinki-NLP/opus-mt-hi-en' },
  { code: 'hi', name: 'Hindi', model: 'Helsinki-NLP/opus-mt-en-hi' },
  { code: 'es', name: 'Spanish', model: 'Helsinki-NLP/opus-mt-en-es' },
  { code: 'fr', name: 'French', model: 'Helsinki-NLP/opus-mt-en-fr' },
  { code: 'de', name: 'German', model: 'Helsinki-NLP/opus-mt-en-de' },
  { code: 'zh', name: 'Chinese', model: 'Helsinki-NLP/opus-mt-en-zh' },
];

export async function initTranslation() {
  if (!translationPipeline) {
    translationPipeline = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');
  }
  return translationPipeline;
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const pipe = await initTranslation();

    const langMap: Record<string, string> = {
      'en': 'eng_Latn',
      'hi': 'hin_Deva',
      'es': 'spa_Latn',
      'fr': 'fra_Latn',
      'de': 'deu_Latn',
      'zh': 'zho_Hans',
    };

    const result = await pipe(text, {
      src_lang: 'eng_Latn',
      tgt_lang: langMap[targetLang] || 'eng_Latn',
    });

    return result[0].translation_text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function detectEmotion(text: string): Promise<{ emotion: string; score: number }> {
  try {
    if (!emotionPipeline) {
      emotionPipeline = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    }

    const result = await emotionPipeline(text);

    const emotionMap: Record<string, string> = {
      'POSITIVE': 'happy',
      'NEGATIVE': 'sad',
    };

    return {
      emotion: emotionMap[result[0].label] || 'neutral',
      score: result[0].score,
    };
  } catch (error) {
    console.error('Emotion detection error:', error);
    return { emotion: 'neutral', score: 0 };
  }
}

export async function initLLM(onProgress?: (progress: string) => void): Promise<void> {
  if (llmEngine) return;

  try {
    llmEngine = new webllm.MLCEngine();

    await llmEngine.reload('Phi-3-mini-4k-instruct-q4f16_1-MLC', {
      temperature: 0.7,
      top_p: 0.9,
    });

    if (onProgress) onProgress('LLM loaded successfully');
  } catch (error) {
    console.error('LLM initialization error:', error);
    if (onProgress) onProgress('LLM failed to load');
  }
}

export async function generateAIReply(
  message: string,
  emotion: string,
  onProgress?: (text: string) => void
): Promise<string> {
  try {
    if (!llmEngine) {
      await initLLM();
    }

    const prompt = `You are having a WhatsApp conversation. The previous message was: "${message}" and the emotion detected is ${emotion}. Generate a brief, natural reply that matches this emotional tone. Keep it conversational and under 50 words.`;

    const reply = await llmEngine!.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    return reply.choices[0].message.content || 'Thanks for your message!';
  } catch (error) {
    console.error('AI reply generation error:', error);
    return 'Thanks for your message!';
  }
}
