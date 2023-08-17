import React, { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="prose m-auto flex flex-grow flex-col items-center justify-center md:max-w-[80vw]">
        {children}
      </div>
      <Footer />
    </div>
  );
};
