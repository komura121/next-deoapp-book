import Layout from "../../src/app/components/layouts/layout";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <>
      <ChakraProvider>{getLayout(<Component {...pageProps} />)} ;</ChakraProvider>;
    </>
  );
}
