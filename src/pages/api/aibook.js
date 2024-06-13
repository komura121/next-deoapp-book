import { Groq } from "groq-sdk";
import axios from "axios"; // Import axios

export default async function handler(req, res) {
  const groq = new Groq();

  try {
    // Mendapatkan data yang diperlukan dari body permintaan
    const { messages, model, temperature, max_tokens, top_p, stream, stop } = req.body;

    // Membuat permintaan ke endpoint Groq dengan menggunakan axios
    const response = await axios.post(
      "URL_ENDPOINT_GROQ", // Ganti dengan URL endpoint Groq yang sesuai
      {
        messages,
        model,
        temperature,
        max_tokens,
        top_p,
        stream,
        stop,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sk_veDbUjB71laRJ4iA4YvJWGdyb3FYF6N0Egl5z1GCb5xlM1oIaBcR", // Ganti dengan API key yang sesuai
        },
      }
    );

    // Mendapatkan hasil dari respons Groq
    const generatedData = response.data.choices[0]?.delta?.content || "";

    res.status(200).json({ generatedData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
