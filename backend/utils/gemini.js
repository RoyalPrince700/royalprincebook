const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

const modelCandidates = () => {
  const preferred = String(process.env.GEMINI_MODEL || '').trim();
  return [...new Set([preferred, ...DEFAULT_MODELS].filter(Boolean))];
};

const parseModelJson = (raw) => {
  const text = String(raw || '').trim();
  if (!text) throw new Error('Empty model response');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text;
  return JSON.parse(candidate);
};

const generateGeminiText = async (prompt, options = {}) => {
  const {
    temperature = 0.3,
    blockedMessage = 'This could not be written. Try again with less sensitive detail.',
    emptyMessage = 'The AI returned an empty response. Try again.'
  } = options;

  const apiKey = String(process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    const error = new Error('Gemini is not configured. Add GEMINI_API_KEY to the backend environment.');
    error.status = 503;
    throw error;
  }

  let lastStatus = 502;
  let lastData = null;

  for (const model of modelCandidates()) {
    const response = await axios.post(
      `${GEMINI_URL}/${model}:generateContent`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          responseMimeType: 'application/json'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        timeout: 30000,
        validateStatus: () => true
      }
    );

    if (response.status === 404 || response.status === 429 || response.status === 503) {
      lastStatus = response.status;
      lastData = response.data;
      continue;
    }

    if (response.status < 200 || response.status >= 300) {
      const apiMessage = response.data?.error?.message || '';
      let message = 'Could not complete the AI request. Try again in a moment.';
      if (response.status === 401 || response.status === 403) {
        message = 'Gemini rejected the API key. Check GEMINI_API_KEY in the backend environment.';
      } else if (/safety|blocked/i.test(apiMessage)) {
        message = blockedMessage;
      }
      const error = new Error(message);
      error.status = response.status >= 500 ? 502 : response.status;
      throw error;
    }

    const parts = response.data?.candidates?.[0]?.content?.parts || [];
    const raw = parts
      .filter((part) => part?.text && !part.thought)
      .map((part) => part.text)
      .pop()
      ?.trim();

    if (!raw) {
      const blockReason = response.data?.promptFeedback?.blockReason;
      const error = new Error(blockReason ? blockedMessage : emptyMessage);
      error.status = 502;
      throw error;
    }

    return raw;
  }

  console.error('Gemini request failed:', lastStatus, lastData?.error?.message || '');
  const error = new Error(
    lastStatus === 429 || lastStatus === 503
      ? 'The AI service is busy. Try again in a moment.'
      : 'The configured Gemini model is unavailable.'
  );
  error.status = 502;
  throw error;
};

module.exports = {
  generateGeminiText,
  parseModelJson
};
