import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex, FormControl, useToast, Image, Input, Button, InputGroup, InputRightElement, InputLeftAddon, IconButton, Link, ButtonGroup, Text } from "@chakra-ui/react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, setDoc, doc, db } from "@/services/api/firebase";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { IoMail } from "react-icons/io5";
import { IoIosKey } from "react-icons/io";
import NonLayout from "@/app/components/nonLayout";

export default function Login() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;
      toast({
        title: "Login Successfully!",
        description: `Welcome ${email}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push("/");
      console.log(user);
    } catch (error) {
      setError("Email or password is incorrect or not registered");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });
      toast({
        title: "Signed up with Google successfully!",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <Flex w="full" h="100vh" justify="center" align="center" bgImage="https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg" bgPos="center" bgRepeat="no-repeat">
      <Box
        w={{ base: "90%", md: "400px" }}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        bg="rgba(26, 32, 44, 0.85)" // semi-transparent gray.900
        backdropFilter="blur(10px)" // adds a blur effect
        color="white"
        textAlign="center"
      >
        <Box mb={6}>
          <Image src="/LogoBooks.png" maxH="120px" objectFit="cover" mx="auto" />
        </Box>
        <form onSubmit={handleLogin}>
          <FormControl mb={4}>
            <InputGroup borderColor="gray.700">
              <InputLeftAddon color="black" bg="gray.500">
                <IoMail />
              </InputLeftAddon>
              <Input type="email" color="white" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" bg="gray.700" borderColor="gray.600" _placeholder={{ color: "gray.400" }} />
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <InputGroup borderColor="gray.700" size="md">
              <InputLeftAddon color="black" bg="gray.500">
                <IoIosKey />
              </InputLeftAddon>
              <Input type={showPassword ? "text" : "password"} color="white" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" bg="gray.700" borderColor="gray.600" _placeholder={{ color: "gray.400" }} />
              <InputRightElement width="3rem">
                <IconButton h="1.75rem" size="sm" onClick={handleShowPassword} icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {error && (
            <Text color="red.500" mb={4}>
              {error}
            </Text>
          )}
          <ButtonGroup gap={3} my={2} w="full" justifyContent="center">
            <Button variant="link" colorScheme="teal" size="sm" onClick={() => router.push("/forgot-password")}>
              Forgot password
            </Button>
            <Button size="sm" type="submit">
              Continue
            </Button>
          </ButtonGroup>
        </form>
        <Button colorScheme="red" mb={4} w="full" onClick={handleGoogleSignup}>
          Login with Google
        </Button>
        <Box textAlign="center" mt={4} fontSize="12px">
          <Link color="teal.200" href="/signup">
            Don’t have any account? <b>Join now!</b>
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}
Login.getLayout = (page) => <NonLayout>{page}</NonLayout>;
