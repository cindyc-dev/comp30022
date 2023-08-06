import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps, type AppType } from "next/app";
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

const Auth = ({ children }: { children: ReactNode }) => {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
};

export default api.withTRPC(MyApp);
