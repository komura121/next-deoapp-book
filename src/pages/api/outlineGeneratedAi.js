import axios from "axios";
import { db } from "../../firebase";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bookTitle, bookTopic } = req.body;

    const prompt = `I’m writing a book about ${bookTopic}. Here is an outline for a book titled "${bookTitle}":
    - Introduction
    - Chapter 1: [CHAPTER 1 TITLE]
        - Subchapter 1.1: [SUBCHAPTER 1.1 TITLE]
        - Subchapter 1.2: [SUBCHAPTER 1.2 TITLE]
    - Chapter 2: [CHAPTER 2 TITLE]
        - Subchapter 2.1: [SUBCHAPTER 2.1 TITLE]
        - Subchapter 2.2: [SUBCHAPTER 2.2 TITLE]
    - Conclusion
    Provide titles for chapters and subchapters.`;

    try {
      const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", { prompt });
      const { chapters } = response.data;

      const bookRef = doc(db, "books", bookTitle);
      await setDoc(
        bookRef,
        {
          bookTitle,
          bookTopic,
          chapters,
        },
        { merge: true }
      );

      await updateDoc(bookRef, {
        prompts: arrayUnion({
          prompt,
          response: chapters,
          timestamp: new Date(),
        }),
      });

      res.status(200).json({ message: "Outline generated and saved to Firestore", chapters });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate outline" });
    }
  } else {
    res.status(405).end();
  }
}
