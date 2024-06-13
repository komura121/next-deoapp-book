import React from "react";
import { Box, Text } from "@chakra-ui/react";

function footbar() {
  return (
    <Box pl={{ base: "18vw", md: "12vw", lg: "6vw" }} align="center" py={2} shadow="2xl" bgColor="yellow" pos="fixed" bottom="0px" width="100%" zIndex="1">
      <Text fontWeight="600" fontSize="md" fontFamily="poppins">
        Books @2024
      </Text>
    </Box>
  );
}

export default footbar;
