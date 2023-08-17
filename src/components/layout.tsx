import React, { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div>Header</div>
      <main>{children}</main>
      <div>Footer</div>
    </>
  );
};
