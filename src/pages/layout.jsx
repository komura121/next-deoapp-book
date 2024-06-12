import { Box, Center, Flex, VStack, Icon, Text, Link, Image } from "@chakra-ui/react";
import { FcAddDatabase, FcPrint, FcPackage, FcGoodDecision, FcSettings } from "react-icons/fc";

export default function RootLayout({ children }) {
  const navItems = [
    { icon: FcPrint, label: "Project", href: "/" },
    { icon: FcPackage, label: "Print", href: "/print" },
    { icon: FcAddDatabase, label: "Stock", href: "/stock" },
  ];

  const bottomNavItems = [
    { icon: FcGoodDecision, label: "User", href: "/User" },
    { icon: FcSettings, label: "Settings", href: "/Settings" },
  ];
  const navbarWidth = "6%";
  return (
    <>
      <Flex bg="white" color="black" zIndex={1} w={{ base: "18vw", md: "12vw", lg: { navbarWidth } }} pos="fixed" h="100%" align="center" top="0">
        <Box w="full">
          <Center w="full" aspectRatio="1" alignItems="center">
            <Image src="" alt="Logo" w="70%" />
          </Center>
          <VStack align="center" mt={5} gap="40vh" flex="1">
            <Box>
              {navItems.map((item, index) => (
                <Link key={index} href={item.href} style={{ textDecoration: "none" }} minW="100px">
                  <Flex direction="column" gap={2} my={2} align="center" px="4" py="2" borderRadius="xl" role="group" cursor="pointer" _hover={{ bg: "red.500", color: "white" }}>
                    <Icon as={item.icon} fontSize={{ base: "25px", lg: "25px" }} align="center" />
                    <Text align="center" fontSize={{ base: "8", lg: "16" }}>
                      {item.label}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Box>
            <Box>
              {bottomNavItems.map((item, index) => (
                <Link key={index} href={item.href} style={{ textDecoration: "none" }} minW="100px">
                  <Flex direction="column" gap={2} my={2} align="center" px="4" py="2" borderRadius="xl" role="group" cursor="pointer" _hover={{ bg: "red.500", color: "white" }}>
                    <Icon as={item.icon} fontSize={{ base: "25px", lg: "25px" }} align="center" />
                    <Text align="center" fontSize={{ base: "12", lg: "16" }}>
                      {item.label}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Box>
          </VStack>
        </Box>
        <Box>{children}</Box>
      </Flex>
    </>
  );
}
