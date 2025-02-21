import React from "react";
import Navbar from "../components/Navbar";

const SharedLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "1rem" }}>
        {children}
      </main>
    </div>
  );
};

export default SharedLayout;
