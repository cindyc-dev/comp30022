import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactNode, Suspense } from "react";
import Providers from "~/components/hooks/providers";
import Script from "next/script";
import Head from "next/head";
import Loading from "~/components/layout/loading";
import Layout from "~/components/layout/layout";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: AppProps["Component"] & { auth: boolean };
  pageProps: { session: Session | null };
}) => {
  return (
    <SessionProvider session={session}>
      <Suspense
        fallback={
          <Layout onlyChildren={true}>
            <Loading />
          </Layout>
        }
      >
        <Head>
          <title>Potato CRM</title>
          <meta name="description" content="Potato CRM" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </Head>
        <Providers>
          <Script src="https://upload-widget.cloudinary.com/global/all.js" />
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Providers>
      </Suspense>
    </SessionProvider>
  );
};

/**
 * Checks if the user is logged in before rendering the component. If the user is not logged in, NextAuth will redirect to the login page.
 *
 * Custom Client Session Handling. Reference: https://next-auth.js.org/getting-started/client#custom-client-session-handling
 */
const Auth = ({ children }: { children: ReactNode }) => {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return (
      <Layout onlyChildren={true}>
        <Loading />
      </Layout>
    );
  }

  return children;
};

export default api.withTRPC(MyApp);
