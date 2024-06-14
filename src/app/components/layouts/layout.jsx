import Sidebar from "./sidebar";
import BackButton from "../ui/backButton";
import Background from "./background";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <Box>
        <BackButton />
        {children}
      </Box>
      <Background />
    </>
  );
}
