import Layout from "@/app/components/layouts/layout";
import NonLayout from "@/app/components/layouts/nonLayout";
import { ChakraProvider } from "@chakra-ui/react";
import {Head} from "next/head"

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <>
  <Head>
    <link rel="icon" href="/logo-x.png"/>
  </Head>
  <ChakraProvider>{getLayout(<Component {...pageProps} />)} ;</ChakraProvider>;
    </>
  );
}
