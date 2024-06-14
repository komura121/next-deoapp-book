import Sidebar from "./sidebar";
import Footer from "./footbar";
import Background from "./background";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <Box pl="10vw">{children}</Box>
      <Footer />
      <Background />
    </>
  );
}
