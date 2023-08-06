import Head from "next/head";
import { Layout } from "../components/layout";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const [session, setSession] = useState(false); // TODO Remove when backend is ready for authentication
  // const { data: session } = useSession(); // TODO Uncomment when backend is ready for authentication
  const router = useRouter();

  // Redirect to /dashboard if user is logged in
  if (session) {
    router.push("/dashboard");
    return;
  }

  return (
    <>
      <Head>
        <title>Potato CRM</title>
        <meta
          name="description"
          content="A personal CRM powered by potatoes."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        Not Logged In
        <button onClick={() => setSession(true)}>Log In</button>
      </Layout>
    </>
  );
}
