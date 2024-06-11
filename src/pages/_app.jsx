import Layout from "@/app/components/layout";
import NonLayout from "@/app/components/nonLayout";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return <ChakraProvider>{getLayout(<Component {...pageProps} />)} ;</ChakraProvider>;
}
