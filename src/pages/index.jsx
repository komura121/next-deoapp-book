import React, { useEffect, useState } from "react";
import { VStack, Flex, Box, Card, CardHeader, CardBody, CardFooter, Text, Heading, Button, Image, SimpleGrid, Input, InputGroup, Tag } from "@chakra-ui/react";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
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
    <Box pl={{ base: "2vw", sm: "4vw", md: "8vw", lg: "6vw" }}>
      <VStack bg="white" px={{ base: "20%", md: "20%", lg: "10%" }} maxW="100%">
        <Heading size="3xl" fontFamily="poppins">
          <Image src="./BooksLogo.png" alt="Logo" maxH="350px" />
        </Heading>
        <Text align="center" mx="20%" fontSize="md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ex, ipsum accusantium molestiae deleniti natus voluptatum iusto, voluptatem tenetur, vero nam! Ipsa optio delectus ut illo aspernatur natus iure. Debitis. Sunt ab
          dolorem saepe, repellendus, soluta sapiente recusandae at, porro eveniet similique vitae nobis iusto repellat.
        </Text>
        <Box align={{ base: "center", lg: "end" }} mx="5%" my="2%">
          <Button onClick={onOpen} colorScheme="red" height="50px">
            Create New Book
          </Button>
        </Box>
      </VStack>
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
                  <Button onClick={onOpen} minW="180px" minH="250px">
                    +
                  </Button>
                </Box>
                <Text fontWeight="600" textAlign="center" fontSize="md" m={4}>
                  New Project
                </Text>
              </CardBody>
              <CardFooter gap={2}>
                <Tag colorScheme="blue" size="sm"></Tag>
                <Tag colorScheme="red" size="sm"></Tag>
              </CardFooter>
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
                      <Button as={Box} maxW="200px" maxH="350px" variant="unstyled" onClick={() => handleCardClicked(item.id)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }}>
                        <Image w="180px" h="250px" src={item.coverImg} alt={item.heading} objectFit="cover" />
                      </Button>
                    </Box>
                    <Text fontWeight="600" fontSize="md" textAlign="center" m={4}>
                      {item.heading}
                    </Text>
                    <Text fontWeight="600" textAlign="center" m={4} fontSize="8px" color="teal">
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
