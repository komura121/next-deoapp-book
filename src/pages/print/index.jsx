import { Flex, Box, CardFooter, Tag, Text, Input, Stack, CardBody, Card, Image, Button, useDisclosure } from "@chakra-ui/react";
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
  const handleCardClicked = (booksId) => {
    router.push(`/print/${booksId}`);
  };
  return (
    <>
      <Flex pl="6vw" mx={20} my={10} gap={10}>
        <Box>
          <Input type="text" bg="white" borderStyle="solid" align="end" m={5} placeholder="Search" />
        </Box>
        <Box gap={10} w="full">
          {newBooks.length > 0 ? (
            newBooks.map((item, index) => (
              <Card key={index} shadow="2xl" minW="90%" direction={{ base: "column", md: "row" }} objectFit="cover" borderWidth="1px" borderStyle="solid" my={5}>
                <Box m={5}>
                  <Button as={Box} maxW="200px" maxH="250px" variant="unstyled" onClick={() => handleCardClicked(item.id)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }}>
                    <Image width="180px" height="250px" src={item.coverImg} alt={item.heading} objectFit="cover" borderRadius={10} />
                  </Button>
                </Box>
                <Stack>
                  <CardBody bgColor="pink" minW="50%">
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
                    <Box>
                      <Tag colorScheme="blue">{item.category}</Tag>
                      <Tag colorScheme="green">{item.label}</Tag>
                    </Box>
                  </CardBody>
                </Stack>
                <Stack>
                  <Button minW="100px" variant="link" size="md">
                    <FcPrint />
                    Print
                  </Button>
                  <Button minW="100px" variant="link" size="md">
                    <FcAddressBook />
                    Edit
                  </Button>
                  <Button minW="100px" variant="link" size="md">
                    <FcFullTrash />
                    Hapus
                  </Button>
                </Stack>
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
