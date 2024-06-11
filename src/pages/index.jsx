import React, { useEffect } from "react";
import usePageStore from "../services/store/usePageStore";
import { VStack, Flex, Box, Card, CardHeader, CardBody, CardFooter, Text, Heading, Button, Image, SimpleGrid, Input, InputGroup, Tag } from "@chakra-ui/react";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/api/firebase";

export default function index() {
  const { handleDeleteBook, newBooks, newBookName, coverImageUrl, coverImageFile, user, userName, isLoading, setNewBooks, setNewBookName, setCoverImageFile, setCoverImageUrl, setUser, setUserName, setIsLoading } = usePageStore();
  const handleInputChange = (e) => {
    setNewBookName(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  // Fetch user data and books
  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().name); // Assuming "name" is the field in the user document
      }
    };

    const fetchBooks = async (uid) => {
      const booksCollection = collection(db, "books");
      const q = query(booksCollection, where("uid", "==", uid));
      const booksSnapshot = await getDocs(q);
      const booksList = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewBooks(booksList);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
        fetchBooks(currentUser.uid);
      } else {
        setUser(null);
        setNewBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add Data
  const handleAddBook = async () => {
    if (newBookName.trim() !== "" && coverImageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `covers/${coverImageFile.name}`);
      await uploadBytes(storageRef, coverImageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const newBook = {
        heading: newBookName,
        coverImg: imageUrl,
        text: "Lorem",
        deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: "",
        label: "",
        category: "",
        status: "on Proses",
        pemilik: userName,
        uid: user.uid,
      };

      try {
        const docRef = await addDoc(collection(db, "books"), newBook);
        newBook.id = docRef.id;
        setNewBooks([...newBooks, newBook]);
        setNewBookName("");
        setCoverImageFile(null);
        onClose();
        setIsLoading(false);
      } catch (e) {
        console.error("Error adding document: ", e);
        setIsLoading(false);
      }
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

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
                      <Button as={Box} maxW="200px" maxH="350px" variant="unstyled" onClick={() => handleCardClicked(item.id, item.heading)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }}>
                        <Image w="180px" h="250px" src={item.coverImg} alt={item.heading} objectFit="cover" />
                      </Button>
                    </Box>
                    <Text fontWeight="600" fontSize="md" textAlign="center" m={4}>
                      {item.heading}
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
                  <Text fontSize="8px" color="teal">
                    author : {item.pemilik}
                  </Text>
                  {/* <Text fontSize="8px" color="teal">
                Last Modified : {item.updated_at}
              </Text>
              <Text fontSize="8px" color="teal">
                Created : {item.created_at}
              </Text> */}
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
              <Image src={spinner} alt="Loading" />
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
