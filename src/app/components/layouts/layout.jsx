import Sidebar from "./sidebar";
import Footer from "./footbar";
import Background from "./background";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <Box>{children}</Box>

      <Background />
    </>
  );
}
