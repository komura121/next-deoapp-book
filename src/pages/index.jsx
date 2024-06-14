import React, { useEffect, useState } from "react";
import { VStack, HStack, Flex, Box, Card, CardHeader, CardBody, CardFooter, Text, Heading, Button, SimpleGrid, Input, InputGroup, Tag } from "@chakra-ui/react";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Image } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/api/firebase";
import { FcFullTrash } from "react-icons/fc";
import { useRouter } from "next/router";

export default function index() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [newBooks, setNewBooks] = useState([]);
  const [newBookName, setNewBookName] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const handleInputChange = (e) => {
    setNewBookName(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchUserDataAndBooks = async (uid) => {
      try {
        const response = await fetch(`/api/books?uid=${uid}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserName(data.user.name); // Assuming "name" is the field in the user document
        setNewBooks(data.books);
      } catch (e) {
        console.error("Error fetching data: ", e);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserDataAndBooks(currentUser.uid);
      } else {
        setUser(null);
        setUserName("");
        setNewBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleAddBook = async () => {
    if (newBookName.trim() !== "" && coverImageFile) {
      setIsLoading(true); // Set loading state

      // Convert file to base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      try {
        const base64Image = await toBase64(coverImageFile);

        const formData = {
          newBookName,
          coverImageFile: {
            name: coverImageFile.name,
            data: base64Image.split(",")[1], // Remove the base64 prefix
          },
          userName,
          user: JSON.stringify(user),
        };

        const response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }

        const newBook = await response.json();
        setNewBooks([...newBooks, newBook]);
        setNewBookName("");
        setCoverImageFile(null);
        onClose();
      } catch (e) {
        console.error("Error adding book:", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteBook = async (bookId) => {
    setIsLoading(true); // Set loading state

    try {
      const response = await fetch("/api/books", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      setNewBooks(newBooks.filter((book) => book.id !== bookId));
    } catch (e) {
      console.error("Error deleting book:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClicked = (booksId) => {
    router.push(`/project/${booksId}`);
  };
  return (
    <Box>
      <HStack>
        <VStack bgImage="./fixa.gif" bgRepeat="no-repeat" bgColor="white" objectFit="contain" bgPos="center" maxW="100%" px={20}>
          <Heading size="3xl" fontFamily="poppins">
            <Image src="./HeaderLogo.png" alt="Logo" width="200" height="100" maxH="350px" />
          </Heading>

          <Heading align={{ base: "center", lg: "left" }} ml="5%" mr={{ base: "5%", lg: "40%" }}>
            Write a Book with AI Assistant.
          </Heading>
          <Text align="center" ml="5%" mr={{ base: "5%", lg: "40%" }} fontSize="md" fontWeight="600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ex, ipsum accusantium molestiae deleniti natus voluptatum iusto, voluptatem tenetur, vero nam! Ipsa optio delectus ut illo aspernatur natus iure. Debitis. Sunt ab
            dolorem saepe, repellendus, soluta sapiente recusandae at, porro eveniet similique vitae nobis iusto repellat.
          </Text>

          <Box align={{ base: "center", lg: "end" }} mx="10%" my="2%">
            <Button onClick={onOpen} colorScheme="yellow" height="50px">
              Create New Book
            </Button>
          </Box>
        </VStack>
      </HStack>

      <Flex direction="column" justify="center">
        <Box maxH="100%" pt={10} pb={20} px={{ base: "20%", md: "20%", lg: "10%" }} borderRadius={20}>
          <Heading py={6} textAlign="center" size="lg">
            Your Project
          </Heading>
          <SimpleGrid templateColumns="repeat(auto-fit, minmax(250px, 0.2fr))" gap={4}>
            <Card align="center" shadow="2xl" maxW="250px" bgColor="white">
              <CardHeader></CardHeader>
              <CardBody>
                <Box>
                  <Button bgColor="#DBE0DF" onClick={onOpen} minW="180px" minH="250px" borderRadius={10}>
                    +
                  </Button>
                </Box>
                <Text fontWeight="600" textAlign="center" fontSize="md" m={4}>
                  New Project
                </Text>
              </CardBody>
            </Card>
            {newBooks.length > 0 ? (
              newBooks.map((item, index) => (
                <Card key={index} align="center" shadow="2xl" maxW="250px" justify="center">
                  <CardBody>
                    <Box align="center">
                      <Flex justifyContent="flex-end" mb={2}>
                        <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteBook(item.id)}>
                          <FcFullTrash />
                        </Button>
                      </Flex>
                      <Button as={Box} maxW="200px" maxH="350px" variant="unstyled" onClick={() => handleCardClicked(item.id)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }} borderRadius={10}>
                        <Image width="180px" height="250px" src={item.coverImg} alt={item.heading} objectFit="cover" borderRadius={10} />
                      </Button>
                    </Box>
                    <Text fontWeight="600" fontSize="md" textAlign="center" m={4}>
                      {item.heading}
                    </Text>
                    <Text fontWeight="600" textAlign="center" fontSize="8px" color="teal">
                      author : {item.pemilik}
                    </Text>
                  </CardBody>
                  <CardFooter gap={2}>
                    <Tag colorScheme="blue" size="sm">
                      {item.category}
                    </Tag>
                    <Tag colorScheme="green" size="sm">
                      {item.label}
                    </Tag>
                  </CardFooter>
                  <Box mb={4}>
                    <Button colorScheme="yellow" onClick={() => handleCardClicked(item.id)}>
                      Edit
                    </Button>
                  </Box>
                </Card>
              ))
            ) : (
              <div></div>
            )}
          </SimpleGrid>
        </Box>
      </Flex>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <Input value={newBookName} onChange={handleInputChange} placeholder="Your Project Name"></Input>
            </InputGroup>
            <Text mt={4}>Upload Cover Image</Text>
            <Input type="file" onChange={handleImageChange} alignContent="center" />
          </ModalBody>

          <ModalFooter>
            {isLoading ? (
              <div></div>
            ) : (
              <Button colorScheme="red" mr={3} onClick={handleAddBook}>
                Create Project
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
