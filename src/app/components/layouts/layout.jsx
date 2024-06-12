import Sidebar from "./sidebar";
import Footer from "./footbar";
import Background from "./background";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <main>{children}</main>
      <Footer />
      <Background />
    </>
  );
}
