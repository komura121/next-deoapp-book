import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Button, Text } from "@chakra-ui/next-js";

export default function Accordion() {
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [chapters, setChapters] = useState([]);

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
          const bookData = bookSnap.data();
          if (bookData && bookData.coverImg) {
            setCoverImageUrl(bookData.coverImg);
          } else {
            console.error("Cover image data not found in the book data.");
          }
          if (bookData && bookData.chapters) {
            // Convert chapters object to an array
            const chaptersArray = Object.values(bookData.chapters);
            setChapters(chaptersArray);
          } else {
            console.error("Chapters data not found in the book data.");
          }
        } else {
          console.error("Book document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [booksId]);
  return (
    <Accordion defaultIndex={[0]} allowMultiple w="full">
      <AccordionItem key={chapters.chapId}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontWeight="bold">{chapters.title}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} maxW="70%">
          {chapters.subchapters &&
            Array.isArray(chapters.subchapters) &&
            chapters.subchapters.map((subchapter) => (
              <Box key={subchapter.subId}>
                <Button variant="ghost" fontWeight="400" onClick={() => handleCardClicked(chapters.id)}>
                  {subchapter.title}
                </Button>
              </Box>
            ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
