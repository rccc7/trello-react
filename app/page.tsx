// Here, instead of importing like '../../..' we use the alias @ which refers to the root level directory
// (see tsconfig.json at the root directory)
import Board from "@/components/Board";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    // here we set the padding-bottom to 44px so that the footer won't overlap the content at the end of the scroll.
    <main className="pb-11">
      {/* Header */}
      <Header />
      {/* Board component */}
      <Board />
      <Footer />
    </main>
  );
}
