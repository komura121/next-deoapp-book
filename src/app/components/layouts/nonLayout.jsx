import Sidebar from "./sidebar";
import Footer from "./footbar";

export default function NonLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
