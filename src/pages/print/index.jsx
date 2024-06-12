import { Flex, Box, Text, CardBody, Card, CardFooter, CardHeader, Button, useDisclosure, Tag } from "@chakra-ui/react";
export default function index() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex pl="6vw" m={20} gap={10}>
        <Box w="auto" h="40%" align="center">
          <Card align="center" maxW="250px" borderRadius={20} borderWidth="0.5px" borderStyle="groove">
            <CardHeader>
              <Text> Judul</Text>
            </CardHeader>
            <CardBody>
              <Box>
                <Button onClick={onOpen} minW="220px" minH="300px">
                  +
                </Button>
              </Box>
            </CardBody>
            <CardFooter gap={2}>
              <Button colorScheme="red"> Cetak </Button>
            </CardFooter>
          </Card>
        </Box>
        <Box w="auto" h="40%" align="center">
          <Card align="center" maxW="250px" borderRadius={20} borderWidth="0.5px" borderStyle="groove">
            <CardHeader>
              <Text> Judul</Text>
            </CardHeader>
            <CardBody>
              <Box>
                <Button onClick={onOpen} minW="220px" minH="300px">
                  +
                </Button>
              </Box>
            </CardBody>
            <CardFooter gap={2}>
              <Button colorScheme="red"> Cetak </Button>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    </>
  );
}
