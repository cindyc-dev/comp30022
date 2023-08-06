import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Layout } from "~/components/layout";

export default function Dashboard() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        Dashboard
        <p>Logged in as {session?.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </Layout>
    </>
  );
}

Dashboard.auth = true;
