import React, { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container prose m-auto flex flex-grow flex-col items-center justify-center">
        {children}
      </div>
      <Footer />
    </div>
  );
};
