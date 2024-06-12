import { Flex, Box, HStack, CardFooter, VStack, Tag, Text, Input, Stack, CardBody, Card, Image, Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/api/firebase";
import { useEffect, useState } from "react";
import { FcFullTrash, FcPrint, FcAddressBook } from "react-icons/fc";

export default function index() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [userName, setUserName] = useState("");
  const [newBooks, setNewBooks] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUserDataAndBooks = async (uid) => {
      try {
        const response = await fetch(`/api/books?uid=${uid}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserName(data.user.name);
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

  const handleDeleteBook = async (bookId) => {
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
    }
  };
  const handleCardClicked = (booksId) => {
    router.push(`/print/${booksId}`);
  };
  const handleBtnEditClicked = (booksId) => {
    router.push(`/project/${booksId}`);
  };

  return (
    <>
      <Flex pl={{ base: "2vw", sm: "4vw", md: "8vw", lg: "6vw" }} mx={20} my={10} gap={10}>
        {/* <Box display={{ base: "block", xl: "flex" }}>
          <Input type="text" bg="white" borderStyle="solid" align="end" m={5} placeholder="Search" />
        </Box> */}
        <Box gap={10} minW="auto">
          {newBooks.length > 0 ? (
            newBooks.map((item, index) => (
              <Card key={index} shadow="2xl" maxW="100%" direction={{ base: "column", md: "row" }} objectFit="cover" borderWidth="1px" borderStyle="solid" my={5}>
                <Box m={5} direction={{ base: "column", xl: "row" }}>
                  <Button as={Box} align="center" maxW="200px" maxH="250px" variant="unstyled" onClick={() => handleCardClicked(item.id)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }}>
                    <Image width="180px" height="250px" src={item.coverImg} alt={item.heading} objectFit="cover" borderRadius={10} />
                  </Button>
                </Box>
                <Stack>
                  <CardBody spacing={3}>
                    <Box>
                      <Text fontWeight="800" fontSize="lg" textTransform="capitalize">
                        {item.heading}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm">by : {item.pemilik}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="md">Description : {item.deskripsi}</Text>
                    </Box>
                    <HStack>
                      <Tag colorScheme="blue">{item.category}</Tag>
                      <Tag colorScheme="green">{item.label}</Tag>
                    </HStack>
                    <Box my={5}>
                      <Tag colorScheme="yellow"> Status : {item.status}</Tag>
                    </Box>
                  </CardBody>
                </Stack>
                <VStack gap={5} m={5} justify="center">
                  <Button leftIcon={<FcPrint />} minW="200px" variant="outline" size="lg" onClick={() => handleCardClicked(item.id)}>
                    Print
                  </Button>
                  <Button leftIcon={<FcAddressBook />} minW="200px" variant="outline" size="lg" onClick={() => handleBtnEditClicked(item.id)}>
                    Edit
                  </Button>
                  <Button minW="200px" leftIcon={<FcFullTrash />} variant="outline" size="lg" onClick={() => handleDeleteBook(item.id)}>
                    Hapus
                  </Button>
                </VStack>
              </Card>
            ))
          ) : (
            <Text>Buku Kamu Belum Ada</Text>
          )}
        </Box>
      </Flex>
    </>
  );
}
