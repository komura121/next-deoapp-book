import React from "react";
import { Box, Text } from "@chakra-ui/react";

function footbar() {
  return (
    <Box pl={{ base: "18vw", md: "12vw", lg: "6vw" }} align="center" py={4} shadow="2xl" bgColor="white" pos="fixed" bottom="0px" width="100%" zIndex="1">
      <Text>Books @2024</Text>
    </Box>
  );
}

export default footbar;
