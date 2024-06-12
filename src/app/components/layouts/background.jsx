import { Box } from "@chakra-ui/react";
import Image from "next/image";

function Background() {
  return (
    <>
      <Box h="100vh" w="100vw" position="fixed" top="0px" zIndex="-100">
        <Image src="/blob.png" alt="Logo" width="1920" height="1080" />
      </Box>
    </>
  );
}

export default Background;
