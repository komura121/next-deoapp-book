import { Flex, Box, Heading, Text, Image, Divider, HStack, VStack } from "@chakra-ui/react";
import React from "react";

function index() {
  return (
    <Flex pl={{ base: "2vw", sm: "4vw", md: "8vw", lg: "6vw" }}>
      <HStack w="full" m={20} bgColor="white" p={5} borderRadius={20}>
        {/* LeftHStack  */}
        <VStack align="start">
          <Heading>Judul Buku</Heading>
          <Text>by: author</Text>
          <Text>Deskripsi: Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, est explicabo ea error eaque dolores ipsa quae. Nemo facilis impedit earum ullam illo rerum facere, excepturi libero nisi harum eaque!</Text>
        </VStack>
        <Flex direction="column">
          <Image src="./HeaderLogo.png" alt="Logo" width="500px" height="500px" maxH="350px" />
          <Text fontSize="5px">UID:bookuid</Text>
        </Flex>
      </HStack>
    </Flex>
  );
}

export default index;
