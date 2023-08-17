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
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex w-[25%] flex-col items-center justify-center bg-white p-8">
        <form className="w-[80%]">
          <h1 className="mb-1"> Welcome Back</h1>
          <p className="mt-1 text-left">
            New to PotatoCRM?{" "}
            <Link href="/auth/signup">Create an account.</Link>;
          </p>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="mb-2 mt-8 block font-bold">
            Username
            <input
              className="mt-1 block w-full rounded-lg border px-2 py-2"
              name="username"
              type="text"
              placeholder="Username"
            />
          </label>
          <label className="mb-11 block font-bold">
            Password
            <input
              className="mt-1 block w-full rounded-lg border px-2 py-2"
              name="password"
              type="password"
              placeholder=" *******"
              autoComplete="new-password"
            />
          </label>
          <button
            className="mb-4 w-full rounded-lg border-gray-400 bg-purple-100 py-2 text-white hover:bg-blue-600"
            type="submit"
          >
            Sign in
          </button>
          <button className="btn btn-primary " type="submit">
            Sign in
          </button>
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  className="w-full rounded-lg border-gray-400 bg-white p-2 font-bold text-black hover:bg-blue-600"
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
        </form>
      </div>
      <div className="flex w-[75%] bg-blue-50">
        {/* <img
        src="back.png"  
        alt="Description of the image"
        className="max-w-full h-auto"
      /> */}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

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
