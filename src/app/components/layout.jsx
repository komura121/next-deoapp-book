import Sidebar from "./sidebar";
import Footer from "./footbar";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
