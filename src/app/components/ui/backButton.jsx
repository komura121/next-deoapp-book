import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { MdArrowBack } from "react-icons/md";

function backButton() {
  return (
    <Box pl="8vw" pos="fixed" py={6}>
      <Button colorScheme="red">
        <MdArrowBack />
      </Button>
    </Box>
  );
}

export default backButton;
