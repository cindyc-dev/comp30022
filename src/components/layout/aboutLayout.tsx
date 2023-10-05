import React from "react";
import Layout from "./layout";
import { FaAngleLeft } from "react-icons/fa";

function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout onlyChildren={true}>
      <div className="my-5">
        {/* Back Button that returns to previous page */}
        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          <FaAngleLeft /> Back
        </button>

        {/* Static back button on the bottom right to return to previous page */}
        <button
          className="btn btn-square btn-primary fixed bottom-5 right-5"
          onClick={() => window.history.back()}
        >
          <FaAngleLeft />
        </button>
        {children}
      </div>
    </Layout>
  );
}

export default AboutLayout;
