// Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"

const Layout = () => {  // Remove children prop
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />  {/* This will render the matched child route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;