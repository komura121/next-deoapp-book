import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Button, Text, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/api/firebase";

export default function AccordionChapters() {
  const router = useRouter();
  const { booksId } = router.query;
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [chapters, setChapters] = useState([]);
  const [bookTitle, setBookTitle] = useState("");

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

  return (
    <Box flex="1" bg="white" borderRadius="lg" px="5%" w="full">
      <Heading as="h2" size="md" my={5} fontWeight="600">
        {bookTitle}
      </Heading>
      {Array.isArray(chapters) && chapters.length === 0 ? (
        <Text>Generate Your Chapters</Text>
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
