import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactNode } from "react";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: AppProps["Component"] & { auth: boolean };
  pageProps: { session: Session | null };
}) => {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
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
    return <div>Loading...</div>;
  }

  return children;
};

export default api.withTRPC(MyApp);
