import Head from "next/head";
import React from "react";
import { Layout } from "~/components/layout";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>Dashboard</Layout>
    </>
  );
}
