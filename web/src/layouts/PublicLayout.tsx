import { Outlet } from "react-router-dom";
import Header from "../components/shared/public/Header";
import Footer from "../components/shared/public/Footer";

function PublicLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;
