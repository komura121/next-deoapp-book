import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Icon, Text, Link } from "@chakra-ui/react";
import { FcAddDatabase, FcPrint, FcPackage } from "react-icons/fc";
import { MdOutlinePowerSettingsNew } from "react-icons/md"; // Import the missing icon
import Image from "next/image";
import usePageStore from "@/services/store/usePageStore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/services/api/firebase";

export default function Sidebar({ children }) {
  const { signOut } = usePageStore();
  const router = useRouter(); // Use Next.js router

  const handleLogout = () => {
    signOut();
    router.push("/login"); // Use router to navigate
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("uid", user.uid);
      } else {
        console.log("user is logged out");
        router.push("/login"); // Redirect to login if user is logged out
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const navItems = [
    { icon: FcPrint, label: "Project", href: "/" },
    { icon: FcPackage, label: "Print", href: "/Print" },
    { icon: FcAddDatabase, label: "Stock", href: "/Stock" },
  ];

  return (
    <Flex bg="white" color="black" zIndex={2} w={{ base: "18vw", md: "12vw", lg: "6vw" }} pos="fixed" minH="full" align="flex-start" top="0">
      <Box w="full">
        <Box flex="1" align="center">
          <Image src="/Deoapp.png" alt="Logo" width="80" height="80" />
        </Box>

        <Flex direction="column" mt={10} px={1}>
          <Box>
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} style={{ textDecoration: "none" }} minW="100px">
                <Flex direction="column" gap={2} my={2} align="center" px="4" py="2" borderRadius="xl" role="group" cursor="pointer" _hover={{ bg: "red.500", color: "white" }}>
                  <Icon as={item.icon} fontSize={{ base: "25px", lg: "30px" }} align="center" color="red" />
                  <Text align="center" fontSize={{ base: "8px", md: "10px", lg: "14px" }}>
                    {item.label}
                  </Text>
                </Flex>
              </Link>
            ))}
            <Link style={{ textDecoration: "none" }} minW="100px">
              <Flex direction="column" gap={2} my={2} align="center" px="4" py="2" onClick={handleLogout} borderRadius="xl" role="group" cursor="pointer" _hover={{ bg: "red.500", color: "white" }}>
                <Icon as={MdOutlinePowerSettingsNew} fontSize={{ base: "25px", lg: "30px" }} align="center" color="red" />
                <Text align="center" fontSize={{ base: "8px", md: "10px", lg: "14px" }}>
                  Log Out
                </Text>
              </Flex>
            </Link>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
