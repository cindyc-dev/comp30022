// Custom Sign In Page
// Reference: https://next-auth.js.org/configuration/pages

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { authOptions } from "~/server/auth";

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      <form>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Username
          <input name="username" type="text" placeholder="Username" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            placeholder="*******"
            autoComplete="new-password"
          />
        </label>
        <button type="submit">Sign in</button>
        <p>
          New to PotatoCRM? <Link href="/auth/signup">Create an account.</Link>
        </p>
      </form>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/dashboard" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers,
      csrfToken: (await getCsrfToken(context)) ?? [],
    },
  };
}
