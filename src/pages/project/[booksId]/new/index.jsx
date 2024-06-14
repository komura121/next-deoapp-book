import { Flex, Box, useDisclosure, Text, Button, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerFooter } from "@chakra-ui/react";
import React from "react";
import AccordionChapters from "@/app/components/ui/accordionChapters";
import dynamic from "next/dynamic";
import { IoIosArrowBack } from "react-icons/io";
const QuillReact = dynamic(() => import("@/app/components/ui/QuillReact"), { ssr: false });
function index() {
  const { isOpen, onOpen, onClose } = useDisclosure;
  return (
    <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
      <Flex bg="white" mx="9vw" borderRadius={20} h="auto" my={10}>
        <Box p={10} display={{ base: "none", xl: "flex" }}>
          <AccordionChapters />
        </Box>
        <QuillReact />
      </Flex>
      <Box
        pos="fixed"
        top={0}
        right={0}
        bottom={0}
        justifyContent="center"
        alignItems="center"
        pr={4} // Padding right to add some space from the edge
        display={{ base: "flex", lg: "none" }}
      >
        <IconButton onClick={onOpen} color="white" size="lg" icon={<IoIosArrowBack />} colorScheme="red" />

        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Chapters</DrawerHeader>
            <DrawerBody>
              <AccordionChapters />
            </DrawerBody>
            <DrawerFooter>
              <Button>Back</Button>
            </DrawerFooter>
          </DrawerContent>
          <Box pt={20}></Box>
        </Drawer>
      </Box>
    </Flex>
  );
}

export default index;
