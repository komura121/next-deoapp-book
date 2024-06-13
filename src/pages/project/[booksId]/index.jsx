import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import usePageStore from "@/services/store/usePageStore";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  IconButton,
  FormControl,
  FormHelperText,
  Textarea,
  ButtonGroup,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { FcEditImage } from "react-icons/fc";
import { GiChaingun } from "react-icons/gi";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, doc, storage } from "@/services/api/firebase";
import { getDoc, updateDoc } from "firebase/firestore";

export default function Project() {
  const router = useRouter();
  const { booksId, booksHeading } = router.query;
  const { fetchBookData, handleAccordionClicked, chapters, newChapter, description, coverImageUrl, setChapters, setNewChapters, setDescription, setCoverImageUrl } = usePageStore();
  const { isOpen: isImageBoxVisible, onOpen: openImageBox, onClose: closeImageBox } = useDisclosure();
  const { isOpen: isSpinnerVisible, onOpen: openSpinnerBox, onClose: closeSpinnerBox } = useDisclosure();
  const [bookTitle, setBookTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewGeneratedText, setPreviewGeneratedText] = useState(null);
  const [bookData, setBookData] = useState(null); // Define bookData state
  // Ensure chapters is initialized as an array
  useEffect(() => {
    setChapters([]);
  }, [setChapters]);

  // Fetch Data
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
          setBookTitle(data.title || "");
          if (data.coverImg) {
            setCoverImageUrl(data.coverImg);
          } else {
            console.error("Cover image data not found in the book data.");
          }

          setChapters(data.chapters || []);
          setBookData(data); // Set bookData state here
        } else {
          console.error("Book document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [booksId, setCoverImageUrl, setChapters]);

  // Change Images
  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `covers/${file.name}`);
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      setCoverImageUrl(downloadURL);

      closeImageBox();
      closeSpinnerBox();

      if (!booksId) {
        throw new Error("booksId is not defined");
      }

      const bookRef = doc(db, "books", booksId);
      await updateDoc(bookRef, {
        coverImg: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Generate AI
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
              content: `Generate chapter titles and subchapter titles based on the book title "${booksHeading}" or description: "${description}". Provide the response in the following JSON format:
      
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

      // Validate if the response is a valid JSON
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
    <div>
      <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
        <Flex direction={{ base: "column", lg: "row" }} pt="1.5" mx={{ base: "20%", md: "10%", lg: "10%" }} my={{ base: 4, md: 4 }} gap={4}>
          <Box>
            <Box minW="300px" textAlign="center" p={{ base: "3%", lg: "5%" }} bg="white" borderRadius="lg">
              <Text p="2%">Cover Book</Text>
              <Image src={coverImageUrl} alt="Cover Image" minH={{ base: "180px", sm: "230px", md: "250px", lg: "300px" }} maxW={{ base: "130px", sm: "180px", md: "200px", lg: "200px" }} mx="auto" objectFit="cover" borderRadius={10} />
              <Flex justify="center" my={4} direction={{ base: "column", xl: "row" }}>
                <ButtonGroup justifyContent="center" p={5}>
                  <Button onClick={openImageBox} leftIcon={<FcEditImage size="25px" />} colorScheme="blue" variant="solid" size="md">
                    <Text fontWeight="100" display={{ base: "none", sm: "flex" }}>
                      Change Image
                    </Text>
                  </Button>
                </ButtonGroup>
              </Flex>
            </Box>
          </Box>
          <Flex w="full" direction="column">
            <Box flex="1" bg="white" borderRadius="lg" px="5%" w="full">
              <Heading as="h2" size="md" my={5} fontWeight="600">
                {booksHeading}
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
                              <Text fontWeight="bold">{chapter.title}</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} maxW="70%">
                          {chapter.subchapters &&
                            Array.isArray(chapter.subchapters) &&
                            chapter.subchapters.map((subchapter) => (
                              <Box key={subchapter.subId}>
                                <Button variant="ghost" fontWeight="400" onClick={() => handleCardClicked(subchapter.id)}>
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
            <Box>{/* <Text>{result}</Text> */}</Box>
          </Flex>
        </Flex>
        <Flex w="full" direction="column">
          <Box flex="1" borderRadius="lg" px="5%" w="full">
            <Heading as="h2" size="md" my={5} fontWeight="600">
              {bookTitle}
            </Heading>
            <Box>
              {bookData &&
                bookData.chapters &&
                Object.keys(bookData.chapters).map((key) => (
                  <Button key={key} onClick={() => handleCardClicked(bookData.chapters[key].heading)}>
                    {bookData.chapters[key].heading}
                  </Button>
                ))}
            </Box>
          </Box>
          <Box>{/* <Text>{result}</Text> */}</Box>
        </Flex>
      </Flex>

      <Flex direction="column" px={{ base: "20%", md: "8%", lg: "8%" }}>
        <Box px="2%" py="2%" mx="2%" mb="5%" bg="white" borderRadius="xl">
          <Box align="end">
            <ButtonGroup size="md" isAttached variant="solid" borderWidth={1} borderRadius={8}>
              <Button w={{ base: "100%", md: "auto" }} colorScheme="yellow" onClick={handleGenerate}>
                Generate
              </Button>
              <IconButton bg="white" aria-label="Generate" icon={<GiChaingun />} size="md" />
            </ButtonGroup>
          </Box>
          <Box>
            <Text>Description :</Text>
            <FormControl>
              <Textarea placeholder="Your Description" h={{ base: "180px", md: "200px" }} onChange={(e) => setDescription(e.target.value)} />
              <FormHelperText>Describe Your Books</FormHelperText>
            </FormControl>
          </Box>
        </Box>
      </Flex>

      {/* modal image Change */}
      <Modal isOpen={isImageBoxVisible} onClose={closeImageBox}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Cover Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Image upload form or input */}
            <Input h="200px" borderStyle="dashed" alignContent="center" type="file" onChange={handleChangeImage} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeImageBox}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSpinnerVisible}>
        <ModalOverlay />
        <ModalContent h="400px" bgColor="transparent">
          <ModalBody align="center" mt="30%">
            <Spinner size="xl" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
