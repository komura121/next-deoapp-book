import { Box } from "@chakra-ui/react";
import Image from "next/image";

function Background() {
  return (
    <>
      <Box h="100vh" w="100vw" position="fixed" top="0" left="0" zIndex="-100" overflow="hidden">
        <Image src="/blob.svg" alt="Background Image" layout="fill" objectFit="cover" quality={100} />
      </Box>
    </>
  );
}

export default Background;
