import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function BackOffice() {
  return (
    <>
      <div className="container">
      <Navbar />
      </div>
      <Outlet/>
    </>
  );
}
