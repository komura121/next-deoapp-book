import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Button, Text, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/api/firebase";
import axios from "axios";

export default function AccordionChapters() {
  const router = useRouter();
  const { booksId } = router.query;
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [chapters, setChapters] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewGeneratedText, setPreviewGeneratedText] = useState(null);
  const [bookTopic, setBookTopic] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setChapters([]);
  }, [setChapters]);
  useEffect(() => {
    const fetchBookData = async () => {
      if (!booksId) {
        console.error("Book ID is undefined.");
        return;
      }

      try {
        const bookRef = doc(db, "books", booksId);
        const bookSnap = await getDoc(bookRef);

        if (bookSnap.exists()) {
          const data = bookSnap.data();
          setBookTitle(data.heading || "");
          setCoverImageUrl(data.coverImg || "");
          setChapters(data.chapters || []);
        } else {
          console.error("Book document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [booksId]);

  const generateAI = async () => {
    setIsLoading(true); // Set isLoading true before sending the request

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are a book writer. Generate a minimum of 5 chapter titles and a maximum of 5 subchapter titles." },
            {
              role: "user",
              content: `Generate chapter titles and subchapter titles based on the book title "${bookTitle}" or description: "${description}". Provide the response in the following JSON format:

          {
            "chapters": [
              {
                "title": "Chapter 1 Title",
                "content": "Chapter 1 Content",
                "subchapters": [
                  {
                    "title": "Subchapter 1 Title",
                    "content": "Subchapter 1 Content"
                  },
                  {
                    "title": "Subchapter 2 Title",
                    "content": "Subchapter 2 Content"
                  }
                ]
              },
              {
                "title": "Chapter 2 Title",
                "content": "Chapter 2 Content",
                "subchapters": [
                  {
                    "title": "Subchapter 1 Title",
                    "content": "Subchapter 1 Content"
                  },
                  {
                    "title": "Subchapter 2 Title",
                    "content": "Subchapter 2 Content"
                  }
                ]
              }
            ]
          }`,
            },
          ],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: "Bearer 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", // Replace with your actual API key
          },
        }
      );

      // Get the generated data
      let generatedData = response.data.choices[0].message.content.trim();

      // Strip any non-JSON text
      const jsonStartIndex = generatedData.indexOf("{");
      const jsonEndIndex = generatedData.lastIndexOf("}");
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        generatedData = generatedData.slice(jsonStartIndex, jsonEndIndex + 1);
      } else {
        throw new Error("JSON data not found in response");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(generatedData);
      } catch (error) {
        console.error("Failed to parse generated data as JSON:", error);
        throw new Error("Invalid JSON format");
      }

      // Update state with the generated text
      setPreviewGeneratedText(parsedData); // Set previewGeneratedText instead of generatedText

      return parsedData; // Return the generated data for use in handleGenerate
    } catch (error) {
      console.error("Error generating text:", error);
      return null;
    } finally {
      setIsLoading(false); // Set isLoading false after the request is complete
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const generatedData = await generateAI();

      if (!generatedData || !Array.isArray(generatedData.chapters)) {
        console.error("Invalid response:", generatedData);
        return;
      }

      const newChapters = generatedData.chapters.map((chapter, index) => ({
        chapId: `chapter_${index + 1}`,
        title: chapter.title,
        content: chapter.content,
        subchapters: chapter.subchapters.map((subchapter, subIndex) => ({
          subId: `subchapter_${index + 1}_${subIndex + 1}`,
          title: subchapter.title,
          content: subchapter.content,
        })),
      }));

      // Save the new data to Firebase
      const bookRef = doc(db, "books", booksId);
      await updateDoc(bookRef, {
        chapters: newChapters,
      });

      // Update state chapters
      setChapters(newChapters);

      // Get the updated book data from Firebase
      const updatedBookSnap = await getDoc(bookRef);
      if (updatedBookSnap.exists()) {
        const updatedData = updatedBookSnap.data();
        setBookData(updatedData);
      } else {
        console.error("Updated book data not found in Firebase.");
      }

      console.log("Data successfully saved to Firebase.");
    } catch (error) {
      console.error("Error generating chapters:", error);
    }
  };
  return (
    <Box flex="1" bg="white" borderRadius="lg" px="5%" w="full">
      <Heading as="h2" size="md" my={5} fontWeight="600">
        {bookTitle}
      </Heading>
      {Array.isArray(chapters) && chapters.length === 0 ? (
        <Button variant="link" onClick={handleGenerate}>
          Generate Your Chapters
        </Button>
      ) : (
        <Accordion defaultIndex={[0]} allowMultiple w="full">
          {Array.isArray(chapters) &&
            chapters.map((chapter) => (
              <AccordionItem key={chapter.chapId}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">Chapter : {chapter.title}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} maxW="70%">
                  {chapter.subchapters &&
                    Array.isArray(chapter.subchapters) &&
                    chapter.subchapters.map((subchapter) => (
                      <Box key={subchapter.subId}>
                        <Button variant="ghost" fontWeight="400" onClick={() => router.push(`/project/${booksId}/chapters`)}>
                          {subchapter.title}
                        </Button>
                      </Box>
                    ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      )}
    </Box>
  );
}
