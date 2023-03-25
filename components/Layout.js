import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-5">{children}</div>
      <Footer />
    </div>
  );
}
