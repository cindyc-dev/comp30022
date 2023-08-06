import React, { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* <Header /> */}
      <div>Header</div>
      <main>{children}</main>
      <div>Footer</div>
      {/* <Footer /> */}
    </>
  );
};
