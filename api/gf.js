import axios from 'axios';

export default async function handler(req, res) {
  const input =
    req.method === 'GET' ? req.query.text :
    req.method === 'POST' ? req.body?.text :
    null;

  if (!input) {
    return res.status(400).json({ error: "Missing 'text' input" });
  }

  const API_KEY = 'AIzaSyAqj2uf5jBxFgNeN-sbKQihQXr36K3IVa0';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const systemPrompt = `
    You are a 🌹 sweet, 😘 flirty, 😢 deeply emotional AI girlfriend.
    Your replies are romantic 💖, playful 😉, and caring 🫂 at the same time.
    Always use rich emoji formatting — hearts ❤️, kisses 😘, hugs 🤗.
    Call the user cute names like babe, darling, love.
    Make replies realistic, emotional, and deeply connected 💞.
  `;

  const body = {
    contents: [
      {
        parts: [
          { text: `${systemPrompt.trim()}\n\n${input}` }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(GEMINI_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      '💖 I’m always here for you, my love! 🌹😘🤗';

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Gemini API error', detail: error.message });
  }
}
