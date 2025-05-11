export default async function handler(req, res) {
  const { feeling } = req.body;

  const prompt = `
You are an Islamic assistant.
The user is feeling: "${feeling}"
Give a suitable Islamic dua with:
- Arabic text
- Bangla transliteration (in Bangla script)
- English translation
- Short Quran/Hadith reference.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // আপনার প্রকল্পের URL বা localhost
        "X-Title": "NoorAI",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // ✅ Valid & Supported Model
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("🔍 OPENROUTER RESPONSE:", data);

    const reply = data.choices?.[0]?.message?.content || "Sorry, no dua found.";
    res.status(200).json({ message: reply });

  } catch (error) {
    console.error("❌ OpenRouter API error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}
