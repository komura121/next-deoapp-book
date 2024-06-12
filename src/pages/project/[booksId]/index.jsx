import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import usePageStore from "@/services/store/usePageStore";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
} from "@chakra-ui/react";
import { FcEditImage } from "react-icons/fc";
import { GiChaingun } from "react-icons/gi";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, doc, storage } from "@/services/api/firebase";
import { getFirestore, getDoc, updateDoc } from "firebase/firestore";

export default function Project() {
  const router = useRouter();
  const { booksId } = router.query;
  const { fetchBookData, handleAccordionClicked, chapters, newChapter, description, coverImageUrl, setChapters, setNewChapters, setDescription, setCoverImageUrl } = usePageStore();
  const { isOpen: isImageBoxVisible, onOpen: openImageBox, onClose: closeImageBox } = useDisclosure();
  const { isOpen: isSpinnerVisible, onOpen: openSpinnerBox, onClose: closeSpinnerBox } = useDisclosure();

  // fetch Data
  useEffect(() => {
    fetchBookData(booksId);
  }, [booksId, fetchBookData]);

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
  // change Images
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
  const handleGenerate = async (e) => {
    e.preventDefault();
  };

  const handleCardClicked = (booksHeading) => {
    router.push(`/project/${booksId}/${booksHeading}`);
  };
  const handleBtnBackClicked = () => {
    router.push("/");
  };

  return (
    <div>
      <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
        <Flex direction={{ base: "column", lg: "row" }} pt="1.5" mx={{ base: "20%", md: "10%", lg: "10%" }} my={{ base: 4, md: 4 }} gap={4}>
          <Box>
            <Box minW="300px" textAlign="center" p={{ base: "3%", lg: "5%" }} bg="white" borderRadius="lg">
              <Text p="2%">Cover Book</Text>
              <Image src={coverImageUrl} alt="Cover Image" minH={{ base: "180px", sm: "230px", md: "250px", lg: "300px" }} maxW={{ base: "130px", sm: "180px", md: "200px", lg: "200px" }} mx="auto" objectFit="cover" />
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
                Title Books
              </Heading>
              {/* Accordion  */}
              {chapters.length === 0 ? (
                <Text>Generate Your Chapters</Text>
              ) : (
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
              )}
            </Box>
            <Box>{/* <Text>{result}</Text> */}</Box>
          </Flex>
        </Flex>

        <Flex direction="column" px={{ base: "20%", md: "8%", lg: "8%" }}>
          <Box px="2%" py="2%" mx="2%" mb="5%" bg="white" borderRadius="xl">
            <Box align="end">
              <ButtonGroup size="md" isAttached variant="outline">
                <Button w={{ base: "100%", md: "auto" }} color="white" bgColor="blueviolet" onClick={handleGenerate}>
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
