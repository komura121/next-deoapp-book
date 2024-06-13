import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
} from "@chakra-ui/react";
import { FcEditImage } from "react-icons/fc";
import { GiChaingun } from "react-icons/gi";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/services/api/firebase";

export default function Project() {
  const router = useRouter();
  const { booksId } = router.query;
  const { setChapters, setDescription, setCoverImageUrl } = usePageStore();
  const { isOpen: isImageBoxVisible, onOpen: openImageBox, onClose: closeImageBox } = useDisclosure();
  const { isOpen: isSpinnerVisible, onOpen: openSpinnerBox, onClose: closeSpinnerBox } = useDisclosure();
  const [bookTitle, setBookTitle] = useState("");
  const [bookData, setBookData] = useState(null);

  return (
    <div>
      <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
        <Flex direction={{ base: "column", lg: "row" }} pt="1.5" mx={{ base: "20%", md: "10%", lg: "10%" }} my={{ base: 4, md: 4 }} gap={4}>
          <Box>
            <Box minW="300px" textAlign="center" p={{ base: "3%", lg: "5%" }} bg="white" borderRadius="lg">
              <Text p="2%">Cover Book</Text>
              <Image src={bookData?.coverImg} alt="Cover Image" minH={{ base: "180px", sm: "230px", md: "250px", lg: "300px" }} maxW={{ base: "130px", sm: "180px", md: "200px", lg: "200px" }} mx="auto" objectFit="cover" borderRadius={10} />
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
                {bookTitle || "Loading..."}
              </Heading>
              <Box>{bookData?.chapters ? bookData.chapters.map((chapter, index) => <Button key={index}>{chapter.heading}</Button>) : <Text>No chapters available</Text>}</Box>
            </Box>
            <Box>{/* <Text>{result}</Text> */}</Box>
          </Flex>
        </Flex>

        <Flex direction="column" px={{ base: "20%", md: "8%", lg: "8%" }}>
          <Box px="2%" py="2%" mx="2%" mb="5%" bg="white" borderRadius="xl">
            <Box align="end">
              <ButtonGroup size="md" isAttached variant="solid" borderWidth={1} borderRadius={8}>
                <Button w={{ base: "100%", md: "auto" }} colorScheme="yellow">
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
    </div>
  );
}
