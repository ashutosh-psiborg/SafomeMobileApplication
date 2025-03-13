import axios from 'axios';
import {transliterate as tr} from 'transliteration';

const API_KEY = 'AIzaSyC7wuZhkYMEDK1vgRWBM7PsMWUmllHcXA0';
const TRANSLATE_URL =
  'https://translation.googleapis.com/language/translate/v2';
const BATCH_SIZE = 100; // Adjust batch size according to your needs and API limits

const batchRequest = async (texts, targetLanguage) => {
  const batches = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const requestBody = {
      q: batch,
      target: targetLanguage,
    };

    batches.push(axios.post(`${TRANSLATE_URL}?key=${API_KEY}`, requestBody));
  }

  const results = await Promise.all(batches);
  return results.flatMap(result =>
    result.data.data.translations.map(t => t.translatedText),
  );
};

const batchTranslateTexts = (texts, targetLanguage) => {
  return batchRequest(texts, targetLanguage);
};

const batchTransliterateTexts = async (texts, targetLanguage) => {
  try {
    return texts.map(text => tr(text));
  } catch (error) {
    console.error(
      'Transliteration failed, falling back to translation:',
      error.message,
    );
    return batchTranslateTexts(texts, targetLanguage);
  }
};

const processJson = async (json, targetLanguage) => {
  const textsToTranslate = [];
  const textsToTransliterate = [];
  const textMap = new Map();

  const collectTexts = (obj, path = '') => {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (obj[key].text) {
        if (obj[key].translate) {
          textsToTranslate.push(obj[key].text);
          textMap.set(
            `${currentPath}.text.translate`,
            textsToTranslate.length - 1,
          );
        }
        if (obj[key].transliterate) {
          textsToTransliterate.push(obj[key].text);
          textMap.set(
            `${currentPath}.text.transliterate`,
            textsToTransliterate.length - 1,
          );
        }
      } else if (Array.isArray(obj[key].segments)) {
        obj[key].segments.forEach((segment, index) => {
          const segmentPath = `${currentPath}.segments[${index}]`;
          if (segment.translate) {
            textsToTranslate.push(segment.text);
            textMap.set(
              `${segmentPath}.text.translate`,
              textsToTranslate.length - 1,
            );
          }
          if (segment.transliterate) {
            textsToTransliterate.push(segment.text);
            textMap.set(
              `${segmentPath}.text.transliterate`,
              textsToTransliterate.length - 1,
            );
          }
        });
      } else if (typeof obj[key] === 'object') {
        collectTexts(obj[key], currentPath);
      }
    }
  };

  const applyTranslations = (
    obj,
    translations,
    transliterations,
    path = '',
  ) => {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (obj[key].text) {
        if (obj[key].translate) {
          const translateIndex = textMap.get(`${currentPath}.text.translate`);
          obj[key].text = translations[translateIndex];
        }
        if (obj[key].transliterate) {
          const transliterateIndex = textMap.get(
            `${currentPath}.text.transliterate`,
          );
          obj[key].text = transliterations[transliterateIndex];
        }
      } else if (Array.isArray(obj[key].segments)) {
        obj[key].segments.forEach((segment, index) => {
          const segmentPath = `${currentPath}.segments[${index}]`;
          if (segment.translate) {
            const translateIndex = textMap.get(`${segmentPath}.text.translate`);
            segment.text = translations[translateIndex];
          }
          if (segment.transliterate) {
            const transliterateIndex = textMap.get(
              `${segmentPath}.text.transliterate`,
            );
            segment.text = transliterations[transliterateIndex];
          }
        });
      } else if (typeof obj[key] === 'object') {
        applyTranslations(
          obj[key],
          translations,
          transliterations,
          currentPath,
        );
      }
    }
  };

  collectTexts(json);

  try {
    console.log('Texts to translate:', textsToTranslate);
    console.log('Texts to transliterate:', textsToTransliterate);

    const translations = await batchTranslateTexts(
      textsToTranslate,
      targetLanguage,
    );
    const transliterations = await batchTransliterateTexts(
      textsToTransliterate,
      targetLanguage,
    );

    const processedJson = JSON.parse(JSON.stringify(json));
    applyTranslations(processedJson, translations, transliterations);

    return processedJson;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export {processJson};
